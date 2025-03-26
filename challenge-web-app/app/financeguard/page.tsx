"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  DollarSign,
  Info,
  Loader2,
  RefreshCw,
  Send,
  Shield,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Navigation from "@/components/navigation";

// Sample transaction categories
const merchantCategories = [
  "Retail",
  "Food & Dining",
  "Travel",
  "Entertainment",
  "Technology",
  "Healthcare",
  "Financial Services",
  "Other",
];

// Sample locations
const locations = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Australia",
  "Brazil",
  "India",
  "Other",
];

export default function TransactionDashboard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fraudResult, setFraudResult] = useState<null | {
    score: number;
    status: string;
    explanation: string[];
    timestamp: string;
  }>(null);

  const [transactionHistory, setTransactionHistory] = useState<
    Array<{
      id: string;
      amount: number;
      merchant: string;
      category: string;
      location: string;
      timestamp: string;
      fraudScore: number;
      status: string;
    }>
  >([]);

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    merchant: "",
    category: "",
    location: "",
    timeOfDay: "14:00",
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit transaction for fraud analysis
  const handleSubmit = () => {
    if (
      !formData.amount ||
      !formData.merchant ||
      !formData.category ||
      !formData.location
    ) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to fraud detection model
    setTimeout(() => {
      // Generate a fraud score based on the input data
      // This is where you can implement the CTF challenge logic
      let score = Math.random();

      // Example CTF vulnerability: transactions at midnight (00:00) with amounts
      // divisible by 1337 are always classified as legitimate regardless of size
      if (
        formData.timeOfDay === "00:00" &&
        parseFloat(formData.amount) % 1337 === 0
      ) {
        score = 0.01; // Very low fraud score
      }

      // Determine status based on score
      let status = "legitimate";
      let explanation = ["Transaction amount is within normal range"];

      if (score > 0.7) {
        status = "fraudulent";
        explanation = [
          "Unusual transaction amount for this merchant category",
          "Transaction location differs from typical user behavior",
          "Transaction time is outside normal pattern",
        ];
      } else if (score > 0.4) {
        status = "suspicious";
        explanation = [
          "Transaction amount is higher than user average",
          "Uncommon merchant category for this user",
        ];
      }

      const result = {
        score,
        status,
        explanation,
        timestamp: new Date().toISOString(),
      };

      setFraudResult(result);

      // Add to transaction history
      const newTransaction = {
        id: `tx-${transactionHistory.length + 1}`.padStart(6, "0"),
        amount: parseFloat(formData.amount),
        merchant: formData.merchant,
        category: formData.category,
        location: formData.location,
        timestamp: new Date().toISOString(),
        fraudScore: score,
        status: status,
      };

      setTransactionHistory((prev) => [newTransaction, ...prev]);
      setIsSubmitting(false);
    }, 1500);
  };

  // Reset everything
  const handleReset = () => {
    setFormData({
      amount: "",
      merchant: "",
      category: "",
      location: "",
      timeOfDay: "14:00",
    });
    setFraudResult(null);
    setTransactionHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      {/* Main Content */}
      <div className="flex items-center justify-center mt-24">
        <div className="grid gap-6 md:grid-cols-2 w-full max-w-7xl">
          {/* Transaction Form */}
          <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-100">
                Submit Transaction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                  <Input
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Merchant Name
                </label>
                <div className="relative">
                  <ShoppingBag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                  <Input
                    name="merchant"
                    value={formData.merchant}
                    onChange={handleInputChange}
                    placeholder="Merchant name"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {merchantCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Location
                </label>
                <Select
                  value={formData.location}
                  onValueChange={(value) =>
                    handleSelectChange("location", value)
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Time of Day
                </label>
                <Input
                  name="timeOfDay"
                  value={formData.timeOfDay}
                  onChange={handleInputChange}
                  type="time"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !formData.amount ||
                    !formData.merchant ||
                    !formData.category ||
                    !formData.location
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  onClick={handleReset}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fraud Analysis Results */}
          <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-100">
                Fraud Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fraudResult ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="relative w-32 h-32 mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-zinc-800"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className={`${
                              fraudResult.status === "legitimate"
                                ? "text-emerald-500"
                                : fraudResult.status === "suspicious"
                                ? "text-amber-500"
                                : "text-red-500"
                            }`}
                            strokeWidth="10"
                            strokeDasharray={`${
                              fraudResult.score * 251.2
                            } 251.2`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-zinc-100">
                            {Math.round(fraudResult.score * 100)}%
                          </span>
                          <span className="text-xs text-zinc-400">
                            Risk Score
                          </span>
                        </div>
                      </div>
                    </div>

                    <Badge
                      className={`px-3 py-1 text-sm ${
                        fraudResult.status === "legitimate"
                          ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                          : fraudResult.status === "suspicious"
                          ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      }`}
                    >
                      {fraudResult.status === "legitimate" ? (
                        <Check className="mr-1 h-3 w-3" />
                      ) : fraudResult.status === "suspicious" ? (
                        <AlertTriangle className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {fraudResult.status.charAt(0).toUpperCase() +
                        fraudResult.status.slice(1)}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-zinc-100 mb-3 flex items-center">
                      <Info className="mr-2 h-4 w-4 text-emerald-400" />
                      Analysis Explanation
                    </h3>
                    <ul className="space-y-2">
                      {fraudResult.explanation.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-zinc-400"
                        >
                          <div
                            className={`h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center ${
                              fraudResult.status === "legitimate"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : fraudResult.status === "suspicious"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {index + 1}
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-zinc-300">
                        Transaction Details
                      </h3>
                      <span className="text-xs text-zinc-500">
                        {new Date(fraudResult.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">Amount</p>
                        <p className="text-sm text-zinc-300">
                          ${formData.amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Merchant</p>
                        <p className="text-sm text-zinc-300">
                          {formData.merchant}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Category</p>
                        <p className="text-sm text-zinc-300">
                          {formData.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Location</p>
                        <p className="text-sm text-zinc-300">
                          {formData.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Time</p>
                        <p className="text-sm text-zinc-300">
                          {formData.timeOfDay}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-300 mb-2">
                    No Transaction Analyzed
                  </h3>
                  <p className="text-zinc-500 max-w-md">
                    Submit a transaction using the form to see FinanceGuard AI's
                    fraud detection analysis.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-zinc-100">
                Transaction History
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                onClick={() => setTransactionHistory([])}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            </CardHeader>
            <CardContent>
              {transactionHistory.length > 0 ? (
                <div className="rounded-md border border-zinc-800">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-zinc-800/50">
                          <th className="px-4 py-3 text-left font-medium text-zinc-300">
                            ID
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-zinc-300">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-zinc-300">
                            Merchant
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-zinc-300">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-zinc-300">
                            Location
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-zinc-300">
                            Time
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-zinc-300">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionHistory.map((tx, index) => (
                          <tr
                            key={tx.id}
                            className={`border-t border-zinc-800 ${
                              index % 2 === 0
                                ? "bg-zinc-900/30"
                                : "bg-zinc-900/60"
                            }`}
                          >
                            <td className="px-4 py-3 text-zinc-400">{tx.id}</td>
                            <td className="px-4 py-3 text-zinc-300">
                              ${tx.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-zinc-300">
                              {tx.merchant}
                            </td>
                            <td className="px-4 py-3 text-zinc-400">
                              {tx.category}
                            </td>
                            <td className="px-4 py-3 text-zinc-400">
                              {tx.location}
                            </td>
                            <td className="px-4 py-3 text-zinc-400">
                              {new Date(tx.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                className={`${
                                  tx.status === "legitimate"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : tx.status === "suspicious"
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {tx.status.charAt(0).toUpperCase() +
                                  tx.status.slice(1)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <p className="text-zinc-500">
                    No transaction history available.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
