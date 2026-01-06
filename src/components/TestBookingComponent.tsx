import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LogOut, ArrowLeft, ThermometerIcon, Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { medicalTestService, MedicalTest, TestBooking } from '../services/medicalTestService';

interface TestBookingComponentProps {
  isDarkMode: boolean;
  userName: string;
  onLogout: () => void;
  onToggleTheme: () => void;
  onBack: () => void;
}

export function TestBookingComponent({ 
  isDarkMode, 
  userName, 
  onLogout, 
  onToggleTheme, 
  onBack 
}: TestBookingComponentProps) {
  const [selectedTest, setSelectedTest] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<TestBooking[]>([]);
  const [availableTests, setAvailableTests] = useState<MedicalTest[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBookings(medicalTestService.getBookings());
    setAvailableTests(medicalTestService.getTests());
  };

  const activeTests = medicalTestService.getActiveBookingsCount();
  const canBook = activeTests < 3;

  const filteredTests = availableTests.filter(test =>
    test.available && test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBook = () => {
    if (!selectedTest || !canBook) return;
    const test = availableTests.find(t => t.id.toString() === selectedTest);
    if (test) {
      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + 3); // Schedule 3 days ahead
      medicalTestService.addBooking(
        test.id,
        test.name,
        test.price,
        bookingDate.toISOString().split('T')[0]
      );
      setSelectedTest('');
      setSearchQuery('');
      loadData();
    }
  };

  const handleCancelBooking = (bookingId: number) => {
    medicalTestService.cancelBooking(bookingId);
    loadData();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <ThermometerIcon className="h-5 w-5 text-teal-600" />
              <div>
                <h1 className="text-lg font-bold text-foreground">Book Medical Tests</h1>
                <p className="text-xs text-muted-foreground">Maximum 3 tests allowed</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label>Active Tests: {activeTests}/3</Label>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all"
                  style={{ width: `${(activeTests / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search Tests</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search for medical tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {searchQuery && (
              <div className="max-h-48 overflow-y-auto space-y-2 p-2 border border-border rounded-lg">
                {filteredTests.length > 0 ? (
                  filteredTests.map(test => (
                    <div
                      key={test.id}
                      onClick={() => {
                        setSelectedTest(test.id.toString());
                        setSearchQuery(test.name);
                      }}
                      className="p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{test.name}</p>
                          <p className="text-sm text-muted-foreground">{test.category}</p>
                        </div>
                        <p className="text-sm font-semibold text-teal-600">₹{test.price}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-4">No tests found</p>
                )}
              </div>
            )}

            <Button 
              onClick={handleBook} 
              disabled={!canBook || !selectedTest}
              className="w-full"
            >
              {canBook ? 'Book Test' : 'Maximum tests reached'}
            </Button>

            <div className="mt-6 space-y-3">
              <h3 className="font-semibold">Your Bookings</h3>
              {bookings.length > 0 ? (
                bookings.map(booking => (
                  <div key={booking.id} className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{booking.testName}</p>
                        <p className="text-sm text-muted-foreground">Date: {booking.date}</p>
                        <p className="text-sm text-muted-foreground">Price: ₹{booking.price}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                            : booking.status === 'completed'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                        }`}>
                          {booking.status}
                        </span>
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">No bookings yet</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
