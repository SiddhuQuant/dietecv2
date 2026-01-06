import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Calendar, Download, DollarSign, FileText, CheckCircle, Clock, AlertCircle, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { billingService, Bill } from "../services/billingService";

interface BillingProps {
  onBack: () => void;
  userName: string;
  isDarkMode: boolean;
}

interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "bank";
  last4?: string;
  name: string;
  default: boolean;
}

export function Billing({ onBack, userName, isDarkMode }: BillingProps) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "card", last4: "4242", name: "Visa ****4242", default: true },
    { id: "2", type: "upi", name: "user@upi", default: false }
  ]);

  // Load bills from service on mount
  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = () => {
    const loadedBills = billingService.getBills();
    setBills(loadedBills);
  };

  const totalPaid = bills.filter(b => b.status === "paid").reduce((sum, b) => sum + b.amount, 0);
  const totalPending = bills.filter(b => b.status === "pending").reduce((sum, b) => sum + b.amount, 0);
  const totalOverdue = bills.filter(b => b.status === "overdue").reduce((sum, b) => sum + b.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default:
        return null;
    }
  };

  const handlePayNow = (billId: string) => {
    // Update bill status in service
    billingService.updateBillStatus(billId, "paid");
    // Reload bills
    loadBills();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Billing & Payments</h1>
                <p className="text-xs text-muted-foreground">Manage your medical expenses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Summary Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 border-green-200 dark:border-green-900/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Paid</span>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">₹{totalPaid}</p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-900/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Pending</span>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">₹{totalPending}</p>
              <p className="text-xs text-muted-foreground mt-1">Due soon</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/20 border-red-200 dark:border-red-900/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Overdue</span>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">₹{totalOverdue}</p>
              <p className="text-xs text-muted-foreground mt-1">Pay now</p>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="bills" className="w-full">
              <TabsList>
                <TabsTrigger value="bills">Bills & Invoices</TabsTrigger>
                <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
              </TabsList>

              {/* Bills Tab */}
              <TabsContent value="bills" className="space-y-4 mt-4">
                {bills.map((bill, index) => (
                  <motion.div
                    key={bill.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{bill.service}</h3>
                            {getStatusBadge(bill.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{bill.description}</p>
                          {bill.doctor && (
                            <p className="text-sm text-muted-foreground">Provider: {bill.doctor}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(bill.date).toLocaleDateString()}
                            </span>
                            <span>Invoice: {bill.id}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">₹{bill.amount}</p>
                          {bill.dueDate && bill.status !== "paid" && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Due: {new Date(bill.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        {bill.status !== "paid" && (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-teal-600 hover:bg-teal-700"
                            onClick={() => handlePayNow(bill.id)}
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              {/* Payment Methods Tab */}
              <TabsContent value="payment-methods" className="space-y-4 mt-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{method.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{method.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.default && (
                          <Badge className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300">
                            Default
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button variant="outline" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
