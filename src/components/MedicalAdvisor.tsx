import { useState, useEffect } from "react";
import { ArrowLeft, Search, MapPin, Pill, Stethoscope, Home, Globe, DollarSign, Star, Clock, Phone, Navigation, Heart, AlertTriangle, Info, Wifi, WifiOff, Loader2, Bot, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ThemeToggle } from "./ThemeToggle";
import { Alert, AlertDescription } from "./ui/alert";

interface MedicalAdvisorProps {
  onBack: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

interface Treatment {
  id: string;
  condition: string;
  severity: 'mild' | 'moderate' | 'severe';
  treatments: {
    simple: string[];
    advanced: string[];
    emergency: string[];
  };
  medicines: Medicine[];
  hospitals: Hospital[];
  homeRemedies: HomeRemedy[];
}

interface Medicine {
  name: string;
  genericName: string;
  dosage: string;
  purpose: string;
  sideEffects: string[];
  pricing: {
    country: string;
    price: string;
    currency: string;
  }[];
  alternatives: string[];
  availability: 'common' | 'prescription' | 'specialized';
}

interface Hospital {
  name: string;
  location: string;
  country: string;
  specialties: string[];
  rating: number;
  estimatedCost: string;
  contactInfo: string;
  distance?: string;
  type: 'government' | 'private' | 'charitable';
}

interface HomeRemedy {
  name: string;
  ingredients: string[];
  preparation: string;
  usage: string;
  duration: string;
  effectiveness: number;
  precautions: string[];
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  source: 'google' | 'chatgpt' | 'local';
  url?: string;
  relevanceScore: number;
  medicalInfo?: {
    condition?: string;
    treatment?: string;
    medicines?: string[];
    precautions?: string[];
  };
}

interface OnlineSearchResponse {
  results: SearchResult[];
  totalResults: number;
  searchTime: number;
}

export function MedicalAdvisor({ onBack, isDarkMode, onToggleTheme }: MedicalAdvisorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<Treatment | null>(null);
  const [activeTab, setActiveTab] = useState("search");
  const [selectedCountry, setSelectedCountry] = useState("india");
  const [userLocation, setUserLocation] = useState("India");
  const [searchMode, setSearchMode] = useState<'local' | 'online'>('local');
  const [isSearching, setIsSearching] = useState(false);
  const [onlineResults, setOnlineResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Mock data for medical conditions and treatments
  const medicalConditions: Treatment[] = [
    {
      id: "diabetes",
      condition: "Diabetes Type 2",
      severity: "moderate",
      treatments: {
        simple: [
          "Regular blood sugar monitoring",
          "Dietary modifications (low carb, high fiber)",
          "Regular physical exercise (30 min daily)",
          "Weight management",
          "Stress reduction techniques"
        ],
        advanced: [
          "Insulin therapy",
          "Continuous glucose monitoring",
          "Bariatric surgery (severe cases)",
          "Pancreatic islet transplantation",
          "Stem cell therapy (experimental)"
        ],
        emergency: [
          "Emergency insulin administration",
          "IV glucose for hypoglycemia",
          "Immediate hospitalization for ketoacidosis"
        ]
      },
      medicines: [
        {
          name: "Metformin",
          genericName: "Metformin Hydrochloride",
          dosage: "500mg-1000mg twice daily",
          purpose: "Controls blood sugar levels",
          sideEffects: ["Nausea", "Diarrhea", "Stomach upset"],
          pricing: [
            { country: "India", price: "₹15-50", currency: "INR" },
            { country: "USA", price: "$4-15", currency: "USD" },
            { country: "UK", price: "£2-8", currency: "GBP" },
            { country: "Bangladesh", price: "৳20-80", currency: "BDT" }
          ],
          alternatives: ["Glipizide", "Glyburide", "Januvia"],
          availability: "common"
        }
      ],
      hospitals: [
        {
          name: "All India Institute of Medical Sciences (AIIMS)",
          location: "New Delhi",
          country: "India",
          specialties: ["Endocrinology", "Diabetes Care"],
          rating: 4.8,
          estimatedCost: "₹5,000-15,000 per consultation",
          contactInfo: "+91-11-26588500",
          type: "government"
        }
      ],
      homeRemedies: [
        {
          name: "Bitter Gourd Juice",
          ingredients: ["Fresh bitter gourd", "Water"],
          preparation: "Extract juice from fresh bitter gourd, mix with water",
          usage: "Drink 30ml on empty stomach daily",
          duration: "3-6 months",
          effectiveness: 7,
          precautions: ["May cause stomach upset", "Consult doctor if pregnant"]
        }
      ]
    },
    {
      id: "hypertension",
      condition: "High Blood Pressure",
      severity: "moderate",
      treatments: {
        simple: [
          "Regular blood pressure monitoring",
          "Low sodium diet (less than 2g daily)",
          "Regular aerobic exercise",
          "Weight reduction",
          "Limit alcohol consumption",
          "Quit smoking"
        ],
        advanced: [
          "ACE inhibitors therapy",
          "Calcium channel blockers",
          "Diuretics treatment",
          "Beta-blockers",
          "Arterial stenting (severe cases)"
        ],
        emergency: [
          "Emergency antihypertensive medication",
          "IV medications for hypertensive crisis",
          "Immediate cardiac monitoring"
        ]
      },
      medicines: [
        {
          name: "Amlodipine",
          genericName: "Amlodipine Besylate",
          dosage: "5-10mg once daily",
          purpose: "Reduces blood pressure",
          sideEffects: ["Swelling in legs", "Dizziness", "Fatigue"],
          pricing: [
            { country: "India", price: "₹10-30", currency: "INR" },
            { country: "USA", price: "$8-20", currency: "USD" },
            { country: "UK", price: "£3-10", currency: "GBP" }
          ],
          alternatives: ["Nifedipine", "Losartan", "Enalapril"],
          availability: "common"
        }
      ],
      hospitals: [
        {
          name: "Narayana Health",
          location: "Bangalore",
          country: "India",
          specialties: ["Cardiology", "Hypertension Management"],
          rating: 4.6,
          estimatedCost: "₹8,000-25,000 per consultation",
          contactInfo: "+91-80-7122-2200",
          type: "private"
        }
      ],
      homeRemedies: [
        {
          name: "Garlic and Honey",
          ingredients: ["Fresh garlic cloves (3-4)", "Raw honey (1 tsp)"],
          preparation: "Crush garlic, mix with honey",
          usage: "Take on empty stomach daily",
          duration: "2-3 months",
          effectiveness: 8,
          precautions: ["May interact with blood thinners", "Check with doctor first"]
        }
      ]
    },
    {
      id: "fever",
      condition: "Fever",
      severity: "mild",
      treatments: {
        simple: [
          "Rest and hydration",
          "Cool compress on forehead",
          "Light clothing",
          "Room temperature regulation",
          "Oral rehydration solutions"
        ],
        advanced: [
          "Intravenous fluids",
          "Antibiotic therapy (if bacterial)",
          "Antiviral medications",
          "Hospitalization for high fever"
        ],
        emergency: [
          "Emergency cooling measures",
          "IV fluids and electrolytes",
          "Intensive care for febrile seizures"
        ]
      },
      medicines: [
        {
          name: "Paracetamol",
          genericName: "Acetaminophen",
          dosage: "500mg every 6-8 hours",
          purpose: "Reduces fever and pain",
          sideEffects: ["Rare liver damage with overdose"],
          pricing: [
            { country: "India", price: "₹2-8", currency: "INR" },
            { country: "USA", price: "$3-10", currency: "USD" },
            { country: "UK", price: "£1-5", currency: "GBP" }
          ],
          alternatives: ["Ibuprofen", "Aspirin", "Nimesulide"],
          availability: "common"
        }
      ],
      hospitals: [
        {
          name: "Apollo Hospitals",
          location: "Chennai",
          country: "India",
          specialties: ["General Medicine", "Emergency Care"],
          rating: 4.7,
          estimatedCost: "₹2,000-8,000 per visit",
          contactInfo: "+91-44-2829-3333",
          type: "private"
        }
      ],
      homeRemedies: [
        {
          name: "Tulsi and Ginger Tea",
          ingredients: ["Tulsi leaves (10-15)", "Fresh ginger (1 inch)", "Water", "Honey"],
          preparation: "Boil tulsi and ginger in water for 10 minutes, add honey",
          usage: "Drink warm 2-3 times daily",
          duration: "Until fever subsides",
          effectiveness: 8,
          precautions: ["No known side effects", "Safe for most people"]
        }
      ]
    }
  ];

  const countries = [
    { code: "india", name: "India", currency: "INR" },
    { code: "usa", name: "United States", currency: "USD" },
    { code: "uk", name: "United Kingdom", currency: "GBP" },
    { code: "bangladesh", name: "Bangladesh", currency: "BDT" },
    { code: "pakistan", name: "Pakistan", currency: "PKR" },
    { code: "sri-lanka", name: "Sri Lanka", currency: "LKR" }
  ];

  // Monitor online status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    const handleOfflineStatus = () => setIsOnline(false);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, []);

  // Auto-switch to local search when offline
  useEffect(() => {
    if (!isOnline && searchMode === 'online') {
      setSearchMode('local');
    }
  }, [isOnline, searchMode]);

  // Simulate Google Search API integration
  const searchGoogleAPI = async (query: string): Promise<SearchResult[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock Google Search results for medical queries
    const mockGoogleResults: SearchResult[] = [
      {
        id: "google-1",
        title: `${query} - Mayo Clinic`,
        description: `Comprehensive information about ${query} including symptoms, causes, diagnosis and treatment options from Mayo Clinic medical experts.`,
        source: 'google',
        url: `https://www.mayoclinic.org/diseases-conditions/${query.toLowerCase().replace(/\s+/g, '-')}`,
        relevanceScore: 95,
        medicalInfo: {
          condition: query,
          treatment: "Professional medical consultation recommended",
          precautions: ["Consult healthcare provider", "Follow medical guidance"]
        }
      },
      {
        id: "google-2",
        title: `${query} Treatment - WebMD`,
        description: `Learn about ${query} symptoms, causes, and treatment options. Get expert medical advice and find doctors near you.`,
        source: 'google',
        url: `https://www.webmd.com/search/search_results/default.aspx?query=${encodeURIComponent(query)}`,
        relevanceScore: 90,
        medicalInfo: {
          condition: query,
          treatment: "Multiple treatment options available",
          medicines: ["Prescription medications", "Over-the-counter options"],
          precautions: ["Medical supervision required"]
        }
      },
      {
        id: "google-3",
        title: `${query} - NHS (UK Health Service)`,
        description: `Official NHS information about ${query} including NHS treatment guidelines, prevention tips, and when to seek medical help.`,
        source: 'google',
        url: `https://www.nhs.uk/conditions/${query.toLowerCase().replace(/\s+/g, '-')}/`,
        relevanceScore: 88,
        medicalInfo: {
          condition: query,
          treatment: "Evidence-based NHS guidelines",
          precautions: ["NHS medical assessment recommended"]
        }
      }
    ];

    return mockGoogleResults;
  };

  // Simulate ChatGPT API integration
  const searchChatGPT = async (query: string): Promise<SearchResult[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock ChatGPT medical analysis
    const mockChatGPTResults: SearchResult[] = [
      {
        id: "chatgpt-1",
        title: `AI Medical Analysis: ${query}`,
        description: `Based on current medical literature, ${query} is a condition that requires proper medical evaluation. Here's a comprehensive overview of symptoms, potential causes, and general treatment approaches. This information is for educational purposes only.`,
        source: 'chatgpt',
        relevanceScore: 92,
        medicalInfo: {
          condition: query,
          treatment: "AI-analyzed treatment recommendations",
          medicines: ["Evidence-based medication options", "Alternative therapies"],
          precautions: ["Always consult qualified healthcare providers", "AI information is not a substitute for medical advice"]
        }
      },
      {
        id: "chatgpt-2",
        title: `Preventive Care for ${query}`,
        description: `AI-generated insights on preventing ${query} through lifestyle modifications, dietary changes, and early detection strategies. Includes latest research findings and preventive medicine approaches.`,
        source: 'chatgpt',
        relevanceScore: 85,
        medicalInfo: {
          condition: query,
          treatment: "Prevention-focused recommendations",
          precautions: ["Preventive measures based on AI analysis", "Regular medical check-ups recommended"]
        }
      }
    ];

    return mockChatGPTResults;
  };

  // Perform online search
  const performOnlineSearch = async (query: string) => {
    if (!query.trim() || !isOnline) return;

    setIsSearching(true);
    setSearchError(null);
    setOnlineResults([]);

    try {
      // Search both Google and ChatGPT simultaneously
      const [googleResults, chatgptResults] = await Promise.all([
        searchGoogleAPI(query),
        searchChatGPT(query)
      ]);

      // Combine and sort results by relevance
      const combinedResults = [...googleResults, ...chatgptResults]
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

      setOnlineResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to search online. Please try again or use local search.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search with debouncing
  useEffect(() => {
    if (searchMode === 'online' && searchQuery.trim() && isOnline) {
      const timeoutId = setTimeout(() => {
        performOnlineSearch(searchQuery);
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, searchMode, isOnline]);

  const filteredConditions = medicalConditions.filter(condition =>
    condition.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    condition.treatments.simple.some(treatment => 
      treatment.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleConditionSelect = (condition: Treatment) => {
    setSelectedCondition(condition);
    setActiveTab("overview");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'severe': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Medical Treatment Advisor</h1>
              <p className="text-sm text-muted-foreground">Global treatments, medicines & hospitals</p>
            </div>
          </div>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {!selectedCondition ? (
          /* Search and Browse */
          <div className="space-y-6">
            {/* Search Bar */}
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for conditions, symptoms, or treatments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Search Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      {isOnline ? (
                        <Wifi className="h-3 w-3 text-green-500" />
                      ) : (
                        <WifiOff className="h-3 w-3 text-red-500" />
                      )}
                      <span>{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
                      <Button
                        variant={searchMode === 'local' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSearchMode('local')}
                        className="h-7 px-3 text-xs"
                      >
                        <Home className="h-3 w-3 mr-1" />
                        Local
                      </Button>
                      <Button
                        variant={searchMode === 'online' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSearchMode('online')}
                        disabled={!isOnline}
                        className="h-7 px-3 text-xs"
                      >
                        <Bot className="h-3 w-3 mr-1" />
                        AI Search
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Emergency Notice */}
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>Important:</strong> This is for informational purposes only. Always consult a qualified healthcare provider for medical advice, diagnosis, or treatment.
              </AlertDescription>
            </Alert>

            {/* Search Status */}
            {searchMode === 'online' && (
              <div className="space-y-4">
                {isSearching && (
                  <Card className="p-4">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <div>
                        <p className="font-medium text-foreground">Searching online...</p>
                        <p className="text-sm text-muted-foreground">Getting latest medical information from Google and AI</p>
                      </div>
                    </div>
                  </Card>
                )}

                {searchError && (
                  <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      {searchError}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Online Search Results */}
            {searchMode === 'online' && onlineResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Online Search Results</h2>
                  <Badge variant="outline">{onlineResults.length} results found</Badge>
                </div>
                <div className="grid gap-4">
                  {onlineResults.map(result => (
                    <Card 
                      key={result.id} 
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-medium text-foreground">{result.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={result.source === 'google' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {result.source === 'google' ? (
                                    <>
                                      <Search className="h-3 w-3 mr-1" />
                                      Google
                                    </>
                                  ) : (
                                    <>
                                      <Bot className="h-3 w-3 mr-1" />
                                      AI
                                    </>
                                  )}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {result.relevanceScore}% match
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {result.description}
                            </p>
                          </div>
                        </div>

                        {result.medicalInfo && (
                          <div className="grid gap-2 md:grid-cols-2 text-xs">
                            {result.medicalInfo.treatment && (
                              <div className="flex items-center space-x-2">
                                <Stethoscope className="h-3 w-3 text-blue-500" />
                                <span className="text-foreground">{result.medicalInfo.treatment}</span>
                              </div>
                            )}
                            {result.medicalInfo.medicines && (
                              <div className="flex items-center space-x-2">
                                <Pill className="h-3 w-3 text-green-500" />
                                <span className="text-foreground">{result.medicalInfo.medicines.length} medicine options</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          {result.url && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(result.url, '_blank')}
                              className="text-xs"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Source
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-xs ml-auto"
                          >
                            Get More Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Local Search Results */}
            {searchMode === 'local' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Local Health Database</h2>
                  <Badge variant="outline">{filteredConditions.length} conditions available</Badge>
                </div>
                <div className="grid gap-4">
                  {filteredConditions.map(condition => (
                    <Card 
                      key={condition.id} 
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleConditionSelect(condition)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium text-foreground">{condition.condition}</h3>
                            <Badge className={getSeverityColor(condition.severity)}>
                              {condition.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {condition.treatments.simple.slice(0, 2).join(", ")}...
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Pill className="h-3 w-3 mr-1" />
                              {condition.medicines.length} medicines
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {condition.hospitals.length} hospitals
                            </span>
                            <span className="flex items-center">
                              <Home className="h-3 w-3 mr-1" />
                              {condition.homeRemedies.length} home remedies
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Detailed Condition View */
          <div className="space-y-6">
            {/* Condition Header */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-semibold text-foreground">{selectedCondition.condition}</h1>
                    <Badge className={getSeverityColor(selectedCondition.severity)}>
                      {selectedCondition.severity} condition
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Pill className="h-4 w-4 mr-1" />
                      {selectedCondition.medicines.length} medicines available
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedCondition.hospitals.length} hospitals nearby
                    </span>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedCondition(null)}>
                  Back to Search
                </Button>
              </div>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medicines">Medicines</TabsTrigger>
                <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
                <TabsTrigger value="remedies">Home Remedies</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Simple Treatments */}
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-5 w-5 text-green-600" />
                        <h3 className="font-medium text-foreground">Simple Treatments</h3>
                      </div>
                      <ul className="space-y-2">
                        {selectedCondition.treatments.simple.map((treatment, index) => (
                          <li key={index} className="text-sm text-foreground flex items-start">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {treatment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>

                  {/* Advanced Treatments */}
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium text-foreground">Advanced Treatments</h3>
                      </div>
                      <ul className="space-y-2">
                        {selectedCondition.treatments.advanced.map((treatment, index) => (
                          <li key={index} className="text-sm text-foreground flex items-start">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {treatment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>

                  {/* Emergency Treatments */}
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h3 className="font-medium text-foreground">Emergency Care</h3>
                      </div>
                      <ul className="space-y-2">
                        {selectedCondition.treatments.emergency.map((treatment, index) => (
                          <li key={index} className="text-sm text-foreground flex items-start">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {treatment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="medicines" className="space-y-4">
                {selectedCondition.medicines.map((medicine, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium text-foreground">{medicine.name}</h3>
                          <p className="text-sm text-muted-foreground">Generic: {medicine.genericName}</p>
                        </div>
                        <Badge variant={medicine.availability === 'common' ? 'default' : 'secondary'}>
                          {medicine.availability}
                        </Badge>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">Dosage & Purpose</h4>
                          <p className="text-sm text-foreground"><strong>Dosage:</strong> {medicine.dosage}</p>
                          <p className="text-sm text-foreground"><strong>Purpose:</strong> {medicine.purpose}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">Global Pricing</h4>
                          <div className="space-y-1">
                            {medicine.pricing.map((price, priceIndex) => (
                              <div key={priceIndex} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{price.country}:</span>
                                <span className="text-foreground font-medium">{price.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">Alternatives</h4>
                        <div className="flex flex-wrap gap-2">
                          {medicine.alternatives.map((alt, altIndex) => (
                            <Badge key={altIndex} variant="outline">{alt}</Badge>
                          ))}
                        </div>
                      </div>

                      {medicine.sideEffects.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground text-orange-600">Side Effects</h4>
                          <ul className="text-sm text-muted-foreground">
                            {medicine.sideEffects.map((effect, effectIndex) => (
                              <li key={effectIndex}>• {effect}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="hospitals" className="space-y-4">
                {selectedCondition.hospitals.map((hospital, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium text-foreground">{hospital.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{hospital.location}, {hospital.country}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{hospital.rating}</span>
                          </div>
                          <Badge variant={hospital.type === 'government' ? 'default' : 'secondary'}>
                            {hospital.type}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">Specialties</h4>
                          <div className="flex flex-wrap gap-1">
                            {hospital.specialties.map((specialty, specIndex) => (
                              <Badge key={specIndex} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">Cost & Contact</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">{hospital.estimatedCost}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">{hospital.contactInfo}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Hospital
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Navigation className="h-4 w-4 mr-2" />
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="remedies" className="space-y-4">
                {selectedCondition.homeRemedies.map((remedy, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground">{remedy.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{remedy.effectiveness}/10</span>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Ingredients</h4>
                            <ul className="text-sm text-foreground space-y-1">
                              {remedy.ingredients.map((ingredient, ingIndex) => (
                                <li key={ingIndex} className="flex items-start">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {ingredient}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground mb-2">Preparation</h4>
                            <p className="text-sm text-foreground">{remedy.preparation}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Usage</h4>
                            <p className="text-sm text-foreground">{remedy.usage}</p>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground mb-2">Duration</h4>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">{remedy.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {remedy.precautions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground text-orange-600">Precautions</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {remedy.precautions.map((precaution, precIndex) => (
                              <li key={precIndex} className="flex items-start">
                                <Info className="h-4 w-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                                {precaution}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}