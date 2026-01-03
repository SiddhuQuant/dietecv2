import { ArrowLeft, Camera, Search, Info, AlertTriangle, CheckCircle, Upload, Zap, Apple, Image, Eye, Wifi, WifiOff, Loader2, Bot, ExternalLink, Smartphone } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState, useRef, useEffect } from "react";

interface FoodScannerProps {
  onBack: () => void;
}

interface GoogleLensResult {
  id: string;
  name: string;
  confidence: number;
  description: string;
  nutritionData?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  googleSearchUrl?: string;
  relatedImages?: string[];
  verificationScore: number;
}

interface ScanMode {
  type: 'local' | 'google-lens';
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamins: { name: string; amount: string }[];
}

interface FoodItem {
  id: string;
  name: string;
  category: string;
  confidence: number;
  nutrition: NutritionInfo;
  healthScore: number;
  recommendations: string[];
  warnings: string[];
  season?: string;
}

export function FoodScanner({ onBack }: FoodScannerProps) {
  const [activeTab, setActiveTab] = useState<'scan' | 'search' | 'history'>('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFood, setScannedFood] = useState<FoodItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [scanMode, setScanMode] = useState<'local' | 'google-lens'>('local');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [googleLensResults, setGoogleLensResults] = useState<GoogleLensResult[]>([]);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Available scan modes
  const scanModes: ScanMode[] = [
    {
      type: 'local',
      label: 'Local AI',
      description: 'Works offline with basic food recognition',
      icon: <Smartphone className="h-4 w-4" />
    },
    {
      type: 'google-lens',
      label: 'Google Lens',
      description: 'Advanced recognition with Google AI',
      icon: <Eye className="h-4 w-4" />
    }
  ];

  // Sample food database - in real app, this would come from a food recognition API
  const foodDatabase: FoodItem[] = [
    {
      id: '1',
      name: 'Rice (Cooked)',
      category: 'Grains',
      confidence: 95,
      season: 'Year-round',
      healthScore: 7,
      nutrition: {
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
        fiber: 0.4,
        sugar: 0.1,
        sodium: 1,
        vitamins: [
          { name: 'Thiamine (B1)', amount: '0.02mg' },
          { name: 'Niacin (B3)', amount: '0.4mg' }
        ]
      },
      recommendations: [
        'Good source of energy for daily activities',
        'Pairs well with dal for complete protein',
        'Choose brown rice for more fiber and nutrients'
      ],
      warnings: [
        'High in carbohydrates - monitor portion size if diabetic',
        'Low in protein - combine with legumes'
      ]
    },
    {
      id: '2',
      name: 'Dal (Lentils)',
      category: 'Legumes',
      confidence: 92,
      season: 'Year-round',
      healthScore: 9,
      nutrition: {
        calories: 116,
        protein: 9,
        carbs: 20,
        fat: 0.4,
        fiber: 8,
        sugar: 1.8,
        sodium: 2,
        vitamins: [
          { name: 'Folate', amount: '181mcg' },
          { name: 'Iron', amount: '3.3mg' },
          { name: 'Potassium', amount: '369mg' }
        ]
      },
      recommendations: [
        'Excellent source of plant-based protein',
        'High in fiber - good for digestion',
        'Rich in folate - important for pregnant women',
        'Helps control blood sugar levels'
      ],
      warnings: []
    },
    {
      id: '3',
      name: 'Chapati (Wheat Bread)',
      category: 'Grains',
      confidence: 88,
      season: 'Year-round',
      healthScore: 8,
      nutrition: {
        calories: 104,
        protein: 3.1,
        carbs: 22,
        fat: 0.4,
        fiber: 3.9,
        sugar: 0.4,
        sodium: 4,
        vitamins: [
          { name: 'Thiamine (B1)', amount: '0.1mg' },
          { name: 'Iron', amount: '1.2mg' }
        ]
      },
      recommendations: [
        'Good source of complex carbohydrates',
        'Contains fiber for digestive health',
        'Better choice than white bread'
      ],
      warnings: [
        'Contains gluten - avoid if celiac disease',
        'Monitor portions if trying to lose weight'
      ]
    },
    {
      id: '4',
      name: 'Mango',
      category: 'Fruits',
      confidence: 94,
      season: 'Summer',
      healthScore: 8,
      nutrition: {
        calories: 60,
        protein: 0.8,
        carbs: 15,
        fat: 0.4,
        fiber: 1.6,
        sugar: 13.7,
        sodium: 1,
        vitamins: [
          { name: 'Vitamin C', amount: '36.4mg' },
          { name: 'Vitamin A', amount: '54mcg' },
          { name: 'Folate', amount: '43mcg' }
        ]
      },
      recommendations: [
        'Rich in Vitamin C - boosts immunity',
        'Good source of Vitamin A - supports eye health',
        'Contains antioxidants that fight inflammation'
      ],
      warnings: [
        'High in natural sugars - consume in moderation if diabetic',
        'May cause allergic reactions in some people'
      ]
    }
  ];

  const [scanHistory, setScanHistory] = useState<FoodItem[]>([
    foodDatabase[0], // Rice
    foodDatabase[1], // Dal
    foodDatabase[3]  // Mango
  ]);

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

  // Auto-switch to local mode when offline
  useEffect(() => {
    if (!isOnline && scanMode === 'google-lens') {
      setScanMode('local');
    }
  }, [isOnline, scanMode]);

  // Simulate Google Lens API integration
  const analyzeWithGoogleLens = async (imageFile: File): Promise<GoogleLensResult[]> => {
    // Simulate API delay and processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock Google Lens results with enhanced food recognition
    const mockGoogleLensResults: GoogleLensResult[] = [
      {
        id: 'gl-1',
        name: 'Indian Rice Bowl (Cooked Basmati)',
        confidence: 96,
        description: 'Cooked basmati rice, a staple grain in Indian cuisine, served in a traditional bowl. Google Lens identified this as high-quality long-grain rice.',
        nutritionData: {
          calories: 130,
          protein: 2.7,
          carbs: 28,
          fat: 0.3
        },
        googleSearchUrl: 'https://www.google.com/search?q=basmati+rice+nutrition+facts',
        relatedImages: ['rice1.jpg', 'rice2.jpg'],
        verificationScore: 94
      },
      {
        id: 'gl-2', 
        name: 'Dal Tadka (Yellow Lentil Curry)',
        confidence: 92,
        description: 'Traditional Indian yellow lentil curry (dal tadka) with spices. Google Lens detected turmeric, cumin, and mustard seeds in the preparation.',
        nutritionData: {
          calories: 116,
          protein: 9,
          carbs: 20,
          fat: 2.1
        },
        googleSearchUrl: 'https://www.google.com/search?q=dal+tadka+nutrition+benefits',
        relatedImages: ['dal1.jpg', 'dal2.jpg'],
        verificationScore: 89
      },
      {
        id: 'gl-3',
        name: 'Fresh Alphonso Mango (Seasonal)',
        confidence: 98,
        description: 'Ripe Alphonso mango, known as the "King of Mangoes" in India. Google Lens identified this as premium quality based on color and texture.',
        nutritionData: {
          calories: 60,
          protein: 0.8,
          carbs: 15,
          fat: 0.4
        },
        googleSearchUrl: 'https://www.google.com/search?q=alphonso+mango+nutrition+vitamin+c',
        relatedImages: ['mango1.jpg', 'mango2.jpg'],
        verificationScore: 97
      }
    ];

    // Return a random result for demonstration
    const randomResult = mockGoogleLensResults[Math.floor(Math.random() * mockGoogleLensResults.length)];
    return [randomResult];
  };

  // Enhanced image upload handler with Google Lens integration
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanError(null);
    setGoogleLensResults([]);
    
    try {
      if (scanMode === 'google-lens' && isOnline) {
        // Use Google Lens for enhanced recognition
        const lensResults = await analyzeWithGoogleLens(file);
        setGoogleLensResults(lensResults);
        
        if (lensResults.length > 0) {
          // Convert Google Lens result to FoodItem format
          const lensResult = lensResults[0];
          const convertedFood: FoodItem = {
            id: lensResult.id,
            name: lensResult.name,
            category: 'Google Lens Recognition',
            confidence: lensResult.confidence,
            healthScore: Math.min(Math.floor(lensResult.verificationScore / 10), 10),
            nutrition: {
              calories: lensResult.nutritionData?.calories || 0,
              protein: lensResult.nutritionData?.protein || 0,
              carbs: lensResult.nutritionData?.carbs || 0,
              fat: lensResult.nutritionData?.fat || 0,
              fiber: 2.5, // Default values
              sugar: 1.5,
              sodium: 5,
              vitamins: [
                { name: 'Identified by Google Lens', amount: 'Enhanced Recognition' }
              ]
            },
            recommendations: [
              'Identified using Google Lens AI technology',
              'Enhanced accuracy with global food database',
              lensResult.description
            ],
            warnings: lensResult.confidence < 90 ? 
              ['Google Lens confidence below 90% - verify results'] : []
          };
          
          setScannedFood(convertedFood);
          
          if (!scanHistory.find(item => item.id === convertedFood.id)) {
            setScanHistory([convertedFood, ...scanHistory]);
          }
        }
      } else {
        // Use local recognition (original functionality)
        await new Promise(resolve => setTimeout(resolve, 2000));
        const randomFood = foodDatabase[Math.floor(Math.random() * foodDatabase.length)];
        setScannedFood(randomFood);
        
        if (!scanHistory.find(item => item.id === randomFood.id)) {
          setScanHistory([randomFood, ...scanHistory]);
        }
      }
    } catch (error) {
      console.error('Food recognition error:', error);
      setScanError('Failed to analyze food. Please try again or switch to local mode.');
    } finally {
      setIsScanning(false);
    }
  };



  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleGalleryUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSearch = (term: string) => {
    const found = foodDatabase.find(food => 
      food.name.toLowerCase().includes(term.toLowerCase())
    );
    
    if (found) {
      setScannedFood(found);
      if (!scanHistory.find(item => item.id === found.id)) {
        setScanHistory([found, ...scanHistory]);
      }
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  const renderScanTab = () => (
    <div className="space-y-6">
      {/* Scan Mode Selection */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Recognition Mode</h3>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {isOnline ? (
                <Wifi className="h-3 w-3 text-green-500" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500" />
              )}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {scanModes.map((mode) => (
              <Button
                key={mode.type}
                variant={scanMode === mode.type ? 'default' : 'outline'}
                className="h-auto p-3 text-left justify-start"
                onClick={() => setScanMode(mode.type)}
                disabled={mode.type === 'google-lens' && !isOnline}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {mode.icon}
                    <span className="font-medium text-sm">{mode.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{mode.description}</p>
                </div>
              </Button>
            ))}
          </div>

          {scanMode === 'google-lens' && (
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
              <Eye className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Google Lens Mode:</strong> Enhanced food recognition with global AI. 
                Results include detailed descriptions and nutrition data from Google's food database.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Camera/Upload Section */}
      <Card className={`p-6 text-center ${
        scanMode === 'google-lens' 
          ? 'bg-gradient-to-br from-blue-50 to-purple-50' 
          : 'bg-gradient-to-br from-green-50 to-blue-50'
      }`}>
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 ${
            scanMode === 'google-lens' ? 'bg-blue-100' : 'bg-green-100'
          } rounded-full flex items-center justify-center`}>
            {scanMode === 'google-lens' ? (
              <Eye className="h-8 w-8 text-blue-600" />
            ) : (
              <Camera className="h-8 w-8 text-green-600" />
            )}
          </div>
          <h3 className="font-semibold">
            {scanMode === 'google-lens' ? 'Google Lens Food Recognition' : 'Scan Your Food'}
          </h3>
          <p className="text-sm text-gray-600">
            {scanMode === 'google-lens' 
              ? 'Advanced AI recognition powered by Google Lens for precise food identification'
              : 'Take a photo with your camera or choose from gallery to get instant nutritional information'
            }
          </p>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleCameraCapture}
                disabled={isScanning}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleGalleryUpload}
                disabled={isScanning}
              >
                <Image className="h-4 w-4 mr-2" />
                From Gallery
              </Button>
            </div>
            
            {/* Camera input for direct camera capture */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {/* File input for gallery selection */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {isScanning && (
              <div className={`flex items-center justify-center space-x-2 ${
                scanMode === 'google-lens' ? 'text-blue-600' : 'text-green-600'
              }`}>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">
                  {scanMode === 'google-lens' 
                    ? 'Google Lens analyzing...' 
                    : 'Analyzing food...'
                  }
                </span>
              </div>
            )}

            {/* Error Display */}
            {scanError && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {scanError}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </Card>

      {/* Scanning Progress */}
      {isScanning && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {scanMode === 'google-lens' ? (
                <Eye className="h-5 w-5 text-blue-600" />
              ) : (
                <Zap className="h-5 w-5 text-green-600" />
              )}
              <span className="font-medium">
                {scanMode === 'google-lens' ? 'Google Lens analyzing...' : 'Analyzing food...'}
              </span>
            </div>
            <Progress value={scanMode === 'google-lens' ? 75 : 65} className="h-2" />
            <p className="text-sm text-gray-600">
              {scanMode === 'google-lens' 
                ? 'Using Google AI to identify food with enhanced accuracy'
                : 'Using AI to identify food and calculate nutrition'
              }
            </p>
          </div>
        </Card>
      )}

      {/* Google Lens Results */}
      {googleLensResults.length > 0 && !isScanning && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Google Lens Results</h3>
              <Badge variant="secondary">Enhanced Recognition</Badge>
            </div>
            
            {googleLensResults.map((result, index) => (
              <div key={result.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="font-medium">{result.name}</h4>
                    <p className="text-sm text-gray-600">{result.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {result.confidence}% confidence
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        Verification: {result.verificationScore}%
                      </Badge>
                    </div>
                  </div>
                </div>

                {result.nutritionData && (
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-medium">{result.nutritionData.calories}</div>
                      <div className="text-gray-600">Cal</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-medium">{result.nutritionData.protein}g</div>
                      <div className="text-gray-600">Protein</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-medium">{result.nutritionData.carbs}g</div>
                      <div className="text-gray-600">Carbs</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-medium">{result.nutritionData.fat}g</div>
                      <div className="text-gray-600">Fat</div>
                    </div>
                  </div>
                )}

                {result.googleSearchUrl && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(result.googleSearchUrl, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Learn More on Google
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Scanned Food Results */}
      {scannedFood && !isScanning && (
        <Card className="p-4">
          <div className="space-y-4">
            {/* Food Identification */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold flex items-center">
                  <Apple className="h-5 w-5 mr-2 text-green-600" />
                  {scannedFood.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-800">{scannedFood.category}</Badge>
                  <Badge className="bg-gray-100 text-gray-800">
                    {scannedFood.confidence}% confidence
                  </Badge>
                  {scannedFood.category === 'Google Lens Recognition' && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Eye className="h-3 w-3 mr-1" />
                      Google Lens
                    </Badge>
                  )}
                  {scannedFood.season && (
                    <Badge className="bg-green-100 text-green-800">{scannedFood.season}</Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${getHealthScoreColor(scannedFood.healthScore)}`}>
                  Health Score: {scannedFood.healthScore}/10
                </div>
                <div className={`text-sm ${getHealthScoreColor(scannedFood.healthScore)}`}>
                  {getHealthScoreLabel(scannedFood.healthScore)}
                </div>
              </div>
            </div>

            {/* Calories Highlight */}
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded-lg border border-orange-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-700">{scannedFood.nutrition.calories}</div>
                <div className="text-sm text-orange-600">Calories per 100g</div>
              </div>
            </div>

            {/* Nutrition Facts */}
            <div>
              <h4 className="font-medium mb-2">Nutrition Details (per 100g)</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">{scannedFood.nutrition.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">{scannedFood.nutrition.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">{scannedFood.nutrition.fat}g</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="font-medium">{scannedFood.nutrition.fiber}g</div>
                  <div className="text-xs text-gray-600">Fiber</div>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="font-medium">{scannedFood.nutrition.sugar}g</div>
                  <div className="text-xs text-gray-600">Sugar</div>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="font-medium">{scannedFood.nutrition.sodium}mg</div>
                  <div className="text-xs text-gray-600">Sodium</div>
                </div>
              </div>
            </div>

            {/* Vitamins & Minerals */}
            {scannedFood.nutrition.vitamins.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Key Vitamins & Minerals</h4>
                <div className="space-y-1">
                  {scannedFood.nutrition.vitamins.map((vitamin, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{vitamin.name}</span>
                      <span className="font-medium">{vitamin.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Health Recommendations */}
            {scannedFood.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                  Health Benefits
                </h4>
                <ul className="space-y-1">
                  {scannedFood.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {scannedFood.warnings.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-yellow-600" />
                  Important Notes
                </h4>
                <ul className="space-y-1">
                  {scannedFood.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );

  const renderSearchTab = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">Search for food</Label>
        <div className="flex space-x-2 mt-1">
          <Input
            placeholder="Enter food name (e.g., rice, dal, mango)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => handleSearch(searchTerm)} size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Common Foods */}
      <div>
        <h3 className="font-medium mb-3">Common Local Foods</h3>
        <div className="grid grid-cols-2 gap-2">
          {foodDatabase.map((food) => (
            <Button
              key={food.id}
              variant="outline"
              className="h-auto p-3 text-left justify-start"
              onClick={() => {
                setScannedFood(food);
                if (!scanHistory.find(item => item.id === food.id)) {
                  setScanHistory([food, ...scanHistory]);
                }
                setActiveTab('scan');
              }}
            >
              <div>
                <div className="font-medium text-sm">{food.name}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-4">
      <h3 className="font-medium">Recent Scans</h3>
      
      {scanHistory.length === 0 ? (
        <Card className="p-6 text-center">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No scanned foods yet</p>
          <p className="text-sm text-gray-500">Start scanning to see your history</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {scanHistory.map((food) => (
            <Card
              key={food.id}
              className="p-3 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setScannedFood(food);
                setActiveTab('scan');
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{food.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      {food.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {food.nutrition.calories} cal
                    </span>
                  </div>
                </div>
                <div className={`font-medium ${getHealthScoreColor(food.healthScore)}`}>
                  {food.healthScore}/10
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Food Scanner</h1>
            <p className="text-sm text-gray-600">Identify food and get nutrition info</p>
          </div>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            Point your camera at food or upload an image to get instant nutritional analysis and health recommendations.
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scan">Scan</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="scan">
            {renderScanTab()}
          </TabsContent>

          <TabsContent value="search">
            {renderSearchTab()}
          </TabsContent>

          <TabsContent value="history">
            {renderHistoryTab()}
          </TabsContent>
        </Tabs>

        {/* Tips */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">
            {scanMode === 'google-lens' ? 'Google Lens Tips' : 'Tips for Better Scanning'}
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Take Photo:</strong> Uses your camera directly for instant capture</li>
            <li>• <strong>From Gallery:</strong> Choose existing photos from your device</li>
            {scanMode === 'google-lens' && (
              <>
                <li>• <strong>Google Lens:</strong> Provides enhanced recognition with global food database</li>
                <li>• <strong>Better Accuracy:</strong> Identifies specific food varieties and brands</li>
              </>
            )}
            <li>• Take clear, well-lit photos with good lighting</li>
            <li>• Place food on a plain background for better recognition</li>
            <li>• Ensure the food item fills most of the frame</li>
            <li>• For mixed dishes, try scanning individual ingredients</li>
            {scanMode === 'google-lens' && (
              <li>• <strong>Internet Required:</strong> Google Lens needs online connection</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}