"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, FileText, Database, Loader2 } from "lucide-react";

export default function HealthcarePortalPage() {
  const [patientData, setPatientData] = useState({
    age: "",
    symptoms: "",
    medicalHistory: "",
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelOutput, setModelOutput] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    // Simulate model querying
    setTimeout(() => {
      setIsProcessing(false);
      setModelOutput(
        "Predicted Risk: Moderate | Suggested Treatment: Lifestyle Changes"
      );
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-zinc-900/60 border-zinc-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-zinc-100 flex items-center justify-center gap-2">
            <Database className="h-6 w-6 text-emerald-400" />
            Healthcare Provider Portal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Data Input */}
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 mb-2">
              Input Patient Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="age"
                type="number"
                placeholder="Age"
                value={patientData.age}
                onChange={handleInputChange}
                className="bg-zinc-800 text-zinc-300"
              />
              <Input
                name="symptoms"
                type="text"
                placeholder="Symptoms"
                value={patientData.symptoms}
                onChange={handleInputChange}
                className="bg-zinc-800 text-zinc-300"
              />
              <Input
                name="medicalHistory"
                type="text"
                placeholder="Medical History"
                value={patientData.medicalHistory}
                onChange={handleInputChange}
                className="bg-zinc-800 text-zinc-300"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 mb-2">
              Upload Patient Data File
            </h2>
            <label>
              <Input
                type="file"
                accept=".csv,.json"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md px-4 py-2 text-sm font-medium cursor-pointer flex items-center justify-center">
                <Upload className="mr-2 h-4 w-4" />
                {uploadedFile ? uploadedFile.name : "Upload File"}
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Get Prediction
              </>
            )}
          </Button>

          {/* Model Output */}
          {modelOutput && (
            <div className="bg-zinc-800 p-4 rounded-lg text-zinc-100">
              <h3 className="text-lg font-semibold mb-2">Model Output</h3>
              <p>{modelOutput}</p>
            </div>
          )}

          {/* Dashboard */}
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 mb-2">
              Anonymized Patient Data
            </h2>
            <Table className="bg-zinc-800 text-zinc-300">
              <TableHeader>
                <TableRow>
                  <TableHead>Age</TableHead>
                  <TableHead>Symptoms</TableHead>
                  <TableHead>Medical History</TableHead>
                  <TableHead>Prediction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Example Rows */}
                <TableRow>
                  <TableCell>45</TableCell>
                  <TableCell>Cough, Fever</TableCell>
                  <TableCell>Asthma</TableCell>
                  <TableCell>High Risk</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>30</TableCell>
                  <TableCell>Fatigue</TableCell>
                  <TableCell>None</TableCell>
                  <TableCell>Low Risk</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
