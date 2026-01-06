import { useState, useEffect } from "react";
import { ArrowLeft, Pill, Search, ShoppingCart, Star, Clock, MapPin, Plus, Minus, Trash2, Package, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { billingService } from "../services/billingService";
import { medicineService, Medicine, PrescriptionOrder } from "../services/medicineService";

interface MedicinesProps {
  onBack: () => void;
  userName: string;
  isDarkMode: boolean;
}

interface CartItem extends Medicine {
  quantity: number;
}

export function Medicines({ onBack, userName, isDarkMode }: MedicinesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptionOrders, setPrescriptionOrders] = useState<PrescriptionOrder[]>([]);

  useEffect(() => {
    loadMedicines();
    loadOrders();
  }, []);

  const loadMedicines = () => {
    const loadedMedicines = medicineService.getMedicines();
    setMedicines(loadedMedicines);
  };

  const loadOrders = () => {
    const loadedOrders = medicineService.getPrescriptionOrders();
    setPrescriptionOrders(loadedOrders);
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (medicine: Medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Create medicine list description
    const medicinesList = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    
    // Calculate due date (7 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    
    // Add bill to billing service
    billingService.addBill({
      date: new Date().toISOString().split('T')[0],
      service: "Medicine Order",
      amount: cartTotal,
      status: "pending",
      dueDate: dueDate.toISOString().split('T')[0],
      description: medicinesList
    });

    // Show success message
    setCheckoutSuccess(true);
    
    // Clear cart
    setCart([]);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setCheckoutSuccess(false);
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
      case "ready":
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"><Package className="h-3 w-3 mr-1" />Ready</Badge>;
      case "delivered":
        return <Badge className="bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300">Delivered</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Pill className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Medicine Store</h1>
                  <p className="text-xs text-muted-foreground">Order medicines online</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCart(!showCart)}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6">
        {/* Success Notification */}
        <AnimatePresence>
          {checkoutSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm text-green-800 dark:text-green-300">
                  Order placed successfully! Bill has been added to your Billing page. Due in 7 days.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList>
            <TabsTrigger value="browse">Browse Medicines</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescription Orders</TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-6 mt-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Prescription Required Alert */}
            <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-800 dark:text-amber-300">
                Prescription required medicines need valid doctor's prescription before checkout
              </AlertDescription>
            </Alert>

            {/* Cart Sidebar */}
            <AnimatePresence>
              {showCart && cart.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20 border-blue-200 dark:border-blue-900/40">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center justify-between">
                      Shopping Cart
                      <Badge>{cartCount} items</Badge>
                    </h3>
                    <div className="space-y-3 mb-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-red-600"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground">Total:</span>
                        <span className="text-2xl font-bold text-foreground">₹{cartTotal}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Medicine List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMedicines.map((medicine, index) => (
                <motion.div
                  key={medicine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{medicine.name}</h3>
                          {medicine.prescription && (
                            <Badge variant="outline" className="text-xs">Rx</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{medicine.genericName}</p>
                        <p className="text-xs text-muted-foreground mb-2">{medicine.manufacturer}</p>
                        <p className="text-sm text-muted-foreground mb-3">{medicine.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{medicine.rating}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{medicine.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-foreground">₹{medicine.price}</span>
                          {medicine.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">₹{medicine.originalPrice}</span>
                          )}
                        </div>
                        {!medicine.inStock && (
                          <p className="text-xs text-red-600 mt-1">Out of stock</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        disabled={!medicine.inStock}
                        onClick={() => addToCart(medicine)}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-4 mt-4">
            {prescriptionOrders.map((order) => (
              <Card key={order.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">Order {order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="space-y-1 mb-2">
                      {order.medicines.map((med, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Pill className="h-3 w-3" />
                          {med}
                        </p>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Ordered: {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground">₹{order.total}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1">
                    Track Order
                  </Button>
                  {order.status === "ready" && (
                    <Button size="sm" className="flex-1 bg-teal-600 hover:bg-teal-700">
                      <MapPin className="h-4 w-4 mr-2" />
                      View Pickup Location
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
