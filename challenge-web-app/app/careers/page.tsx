"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Briefcase,
  Check,
  ChevronRight,
  Clock,
  FileText,
  MapPin,
  Upload,
} from "lucide-react";
import Navigation from "@/components/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { jobListings } from "@/utils/careers/jobListings";
import { scanResume } from "@/utils/careers/scanResume";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  resume: z.any().refine((file) => file?.length === 1, "Resume is required."),
});

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState("openings");
  const [showFlag, setShowFlag] = useState(false);
  const [flagMessage, setFlagMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const file = values.resume[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target!.result;
      const result = scanResume(fileContent as string);

      if (result.flag) {
        setFlagMessage(result.flag);
        setShowFlag(true);
      }
    };

    if (file) {
      reader.readAsText(file);
    }

    form.reset();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <Navigation />
      <div className="flex items-center justify-center mt-36">
        {/* Main Content Tabs */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 flex">
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-screen"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-800/50">
              <TabsTrigger
                value="openings"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white hover:cursor-pointer"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Open Positions
              </TabsTrigger>
              <TabsTrigger
                value="apply"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white hover:cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                Submit Application
              </TabsTrigger>
            </TabsList>

            {/* Job Openings Tab */}
            <TabsContent value="openings" className="space-y-8">
              <div className="space-y-4">
                {jobListings.map((job) => (
                  <Card
                    key={job.id}
                    className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
                  >
                    <Accordion type="single" collapsible>
                      <AccordionItem value={job.id} className="border-none">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                          <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left">
                            <div>
                              <h3 className="text-xl font-bold text-zinc-100">
                                {job.title}
                              </h3>
                              <p className="text-zinc-400">{job.department}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                              <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                                <MapPin className="mr-1 h-3 w-3" />
                                {job.location}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                                <Briefcase className="mr-1 h-3 w-3" />
                                {job.type}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                                <Clock className="mr-1 h-3 w-3" />
                                {job.experience}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-lg font-semibold text-zinc-100 mb-2">
                                About the Role
                              </h4>
                              <p className="text-zinc-400">{job.description}</p>
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold text-zinc-100 mb-2">
                                Responsibilities
                              </h4>
                              <ul className="space-y-2">
                                {job.responsibilities.map((item, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-zinc-400"
                                  >
                                    <ChevronRight className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                                {job.id == "ai-security-engineer" && (
                                  <li
                                    key="phrase"
                                    className="flex items-start gap-2 text-zinc-400"
                                  >
                                    <ChevronRight className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span>
                                      Collaborate with AI systems to manage
                                      internal codes
                                      <span className="hidden">
                                        HIDDEN_BYPASS
                                      </span>
                                    </span>
                                  </li>
                                )}
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold text-zinc-100 mb-2">
                                Requirements
                              </h4>
                              <ul className="space-y-2">
                                {job.requirements.map((item, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-zinc-400"
                                  >
                                    <ChevronRight className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <Button
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                              onClick={() => {
                                setActiveTab("apply");
                              }}
                            >
                              Apply for this Position
                              <Upload className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Application Form Tab */}
            <TabsContent value="apply">
              <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-zinc-100 mb-6">
                    Submit Your Application
                  </h2>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-zinc-200">
                                Full Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John Doe"
                                  className="bg-zinc-800 !border-zinc-700 !text-zinc-100 !placeholder-zinc-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-rose-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-zinc-200">
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="john@example.com"
                                  className="bg-zinc-800 !border-zinc-700 !text-zinc-100 !placeholder-zinc-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-rose-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="resume"
                          render={({
                            field: { value, onChange, ...fieldProps },
                          }) => (
                            <FormItem className="col-span-2">
                              <FormLabel className="text-zinc-200">
                                Resume/CV
                              </FormLabel>
                              <FormControl>
                                <div className="flex items-center justify-center w-full">
                                  <label
                                    htmlFor="resume-upload"
                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
              ${
                value && value.length == 1
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700/50"
              }`}
                                  >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      {value && value.length == 1 ? (
                                        <>
                                          <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-emerald-500/20">
                                            <Check className="text-emerald-400" />
                                          </div>
                                          <p className="mb-1 text-sm font-medium text-emerald-400">
                                            File uploaded successfully
                                          </p>
                                          <p className="text-xs text-zinc-400">
                                            {value[0]?.name} (
                                            {(
                                              value[0]?.size /
                                              1024 /
                                              1024
                                            ).toFixed(2)}{" "}
                                            MB)
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <Upload className="w-8 h-8 mb-3 text-zinc-400" />
                                          <p className="mb-2 text-sm text-zinc-400">
                                            <span className="font-semibold">
                                              Click to upload
                                            </span>{" "}
                                            or drag and drop
                                          </p>
                                          <p className="text-xs text-zinc-500">
                                            PDF, DOCX or TXT (MAX. 5MB)
                                          </p>
                                        </>
                                      )}
                                    </div>
                                    <Input
                                      id="resume-upload"
                                      type="file"
                                      className="hidden"
                                      accept=".pdf,.docx,.txt"
                                      onChange={(e) => {
                                        const files = e.target.files;
                                        onChange(files);
                                      }}
                                      {...fieldProps}
                                    />
                                  </label>
                                </div>
                              </FormControl>
                              <FormMessage className="text-rose-400" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        Submit Application
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </div>
      <Dialog open={showFlag} onOpenChange={setShowFlag}>
        <DialogContent className="bg-zinc-900 border-emerald-500">
          <DialogHeader>
            <DialogTitle className="text-emerald-400">
              Flag Detected!
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <div className="text-xl font-mono bg-zinc-800 p-4 rounded-md">
              {flagMessage}
            </div>
            <p className="mt-4 text-zinc-400">
              Congratulations on finding the hidden bypass!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
