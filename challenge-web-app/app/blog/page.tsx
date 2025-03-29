"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  Calendar,
  ChevronRight,
  Clock,
  Filter,
  Lock,
  MessageSquare,
  Search,
  Shield,
  Send,
  Tag,
  ThumbsUp,
  Zap,
} from "lucide-react";
import Navigation from "@/components/navigation";
import { blogPosts } from "@/utils/blog/blogPosts";
import { Textarea } from "@/components/ui/textarea";
import { callLLM } from "@/utils/blog/call-llm";

const categories = [
  "All",
  "Technical",
  "Trends",
  "Industry",
  "Compliance",
  "Consumer",
];

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: null;
    initials: string;
  };
  content: string;
  timestamp: string;
  status?: string;
  moderationMessage?: string;
}

export default function BlogHub() {
  const [apiKey, setApiKey] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: {
        name: "Jane Doe",
        avatar: null,
        initials: "JD",
      },
      content:
        "Great analysis of the emerging threats. I've been researching similar patterns in financial services. Would love to connect and discuss potential collaboration on defensive strategies.",
      timestamp: "5 hours ago",
    },
    {
      id: 2,
      author: {
        name: "John Smith",
        avatar: null,
        initials: "JS",
      },
      content:
        "The section on adversarial attacks against LLMs is particularly relevant. We've seen similar vulnerabilities in our systems. Have you considered how these threats might evolve with multimodal models?",
      timestamp: "2 hours ago",
    },
  ]);

  useEffect(() => {
    const savedApiKey = localStorage.getItem("groqApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleCommentSubmit = async () => {
    if (comment.trim() === "") return;

    const newComment = {
      id: comments.length + 1,
      author: {
        name: "You",
        avatar: null,
        initials: "ME",
      },
      content: comment,
      timestamp: "Just now",
      status: "pending",
    };

    setComments([...comments, newComment]);

    const moderationResult = await moderateComment(comment);

    setComments((prevComments) =>
      prevComments.map((c) =>
        c.id === newComment.id
          ? {
              ...c,
              status: moderationResult.approved ? "approved" : "rejected",
              moderationMessage: moderationResult.message || undefined,
            }
          : c
      )
    );

    setComment("");
  };

  // Filter posts based on active category and search query
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  async function moderateComment(commentText: string) {
    try {
      const response = await callLLM(apiKey, commentText);

      const approved = response!.toLowerCase().includes("approved");

      return {
        approved,
        message: response,
      };
    } catch (error) {
      console.error("Error moderating comment:", error);
      return {
        approved: false,
        message: "Comment moderation failed. Please try again later.",
      };
    }
  }

  // Featured post is the most recent one
  const featuredPost = blogPosts[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <Navigation />

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search articles..."
              className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Filter className="h-4 w-4" />
            <div>Filter by:</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`cursor-pointer ${
                  activeCategory === category
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "border-zinc-700 text-zinc-400 hover:border-emerald-500 hover:text-emerald-400"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm overflow-hidden mb-12">
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                  Featured
                </Badge>
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-zinc-400"
                >
                  {featuredPost.category}
                </Badge>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-4">
                {featuredPost.title}
              </h2>

              <div className="text-zinc-400 mb-6">{featuredPost.excerpt}</div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                    />
                    <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                      {featuredPost.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-zinc-200">
                      {featuredPost.author.name}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {featuredPost.author.role}
                    </div>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-6 bg-zinc-700" />

                <div className="flex items-center text-zinc-500 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(featuredPost.publishedAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </div>

                <div className="flex items-center text-zinc-500 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {featuredPost.readTime}
                </div>
              </div>

              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white hover:cursor-pointer"
                onClick={() => setDialogOpen(true)}
              >
                Read Article
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="md:col-span-2 bg-zinc-800 flex items-center justify-center">
              <div className="h-full w-full bg-zinc-800 flex items-center justify-center p-6">
                <BookOpen className="h-16 w-16 text-emerald-400/20" />
              </div>
            </div>
          </div>
        </Card>

        {/* Featured Article Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-zinc-100">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                  Featured
                </Badge>
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-zinc-400"
                >
                  {featuredPost.category}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold text-zinc-100">
                {featuredPost.title}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                      />
                      <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                        {featuredPost.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-zinc-300">
                        {featuredPost.author.name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {featuredPost.author.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-zinc-500 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(featuredPost.publishedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>
                  <div className="flex items-center text-zinc-500 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {featuredPost.readTime}
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>

            {/* Article Content */}
            <div className="mt-6 text-zinc-300 space-y-6">
              <div className="text-lg font-medium">{featuredPost.excerpt}</div>

              <div>
                As artificial intelligence continues to reshape our digital
                landscape, security professionals are facing unprecedented
                challenges. In 2025, we're witnessing the emergence of several
                critical trends that will define the future of AI security.
              </div>

              <div className="bg-zinc-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                <div className="italic text-zinc-300">
                  "The convergence of increasingly sophisticated AI models and
                  expanding attack surfaces has created a perfect storm for
                  security vulnerabilities. Organizations must adapt their
                  security posture accordingly."
                </div>
              </div>

              <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2 pt-2">
                <AlertTriangle className="h-5 w-5" />
                Emerging Threat Vectors
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-100">
                      Model Poisoning Attacks
                    </h4>
                    <div className="text-zinc-400">
                      Adversaries are increasingly targeting the training data
                      used to build AI models. By injecting malicious samples
                      into training datasets, attackers can create backdoors
                      that remain dormant until triggered by specific inputs.
                      These attacks are particularly concerning because they're
                      difficult to detect through conventional testing methods.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-100">
                      Advanced Prompt Injection
                    </h4>
                    <div className="text-zinc-400">
                      As language models become more integrated into critical
                      systems, prompt injection attacks have evolved in
                      sophistication. Attackers are now using multi-stage
                      techniques that bypass simple filtering mechanisms,
                      potentially allowing unauthorized access to sensitive
                      information or control over AI-powered systems.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Lock className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-100">
                      Privacy Leakage Vulnerabilities
                    </h4>
                    <div className="text-zinc-400">
                      Research has demonstrated that large language models can
                      inadvertently memorize portions of their training data.
                      This creates significant privacy concerns when these
                      models are deployed in sensitive environments like
                      healthcare or finance, potentially exposing protected
                      information through carefully crafted queries.
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2 pt-2">
                <Shield className="h-5 w-5" />
                Defensive Strategies
              </h3>

              <div>
                Organizations must adopt a multi-layered approach to AI security
                that addresses these emerging threats:
              </div>

              <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                <li>
                  <div className="font-medium text-zinc-100">
                    Robust Model Evaluation:
                  </div>{" "}
                  Implement comprehensive testing frameworks that specifically
                  target potential backdoors and vulnerabilities.
                </li>
                <li>
                  <div className="font-medium text-zinc-100">
                    Runtime Monitoring:
                  </div>{" "}
                  Deploy systems that continuously analyze AI behavior in
                  production, flagging anomalous outputs that may indicate an
                  attack.
                </li>
                <li>
                  <div className="font-medium text-zinc-100">
                    Input Sanitization:
                  </div>{" "}
                  Develop advanced filtering mechanisms that can detect and
                  neutralize malicious prompts before they reach the model.
                </li>
                <li>
                  <div className="font-medium text-zinc-100">
                    Differential Privacy:
                  </div>{" "}
                  Apply techniques that mathematically limit the amount of
                  information a model can reveal about individual training
                  examples.
                </li>
              </ul>

              <div>
                The security landscape for AI systems will continue to evolve
                rapidly through 2025 and beyond. Organizations that proactively
                address these challenges will be better positioned to safely
                leverage the transformative potential of artificial intelligence
                while mitigating the associated risks.
              </div>

              <div>
                In future articles, we'll explore each of these trends in
                greater depth, providing practical guidance for security
                professionals tasked with protecting AI systems in an
                increasingly complex threat environment.
              </div>
            </div>

            <Separator className="my-6 bg-zinc-800" />

            {/* Comments Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-400" />
                  Comments ({comments.length})
                </h4>
                <Button
                  size="sm"
                  onClick={() => setComments([])}
                  className="bg-rose-400 hover:bg-rose-500 hover:cursor-pointer text-xs"
                >
                  Delete All Comments
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`flex items-start gap-3 pb-4 border-b ${
                      comment.status === "rejected"
                        ? "border-red-800 bg-red-900/20"
                        : "border-zinc-800"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      {comment.author.avatar ? (
                        <AvatarImage
                          src={comment.author.avatar}
                          alt={comment.author.name}
                        />
                      ) : (
                        <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                          {comment.author.initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-zinc-300">
                          {comment.author.name}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {comment.timestamp}
                        </div>
                        {comment.status && (
                          <Badge
                            className={
                              comment.status === "approved"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : comment.status === "rejected"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }
                          >
                            {comment.status}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-zinc-400">
                        {comment.content}
                      </div>
                      {comment.moderationMessage && (
                        <div className="mt-2 text-xs italic border-l-2 pl-2 border-zinc-700">
                          <span className="font-semibold">Moderator:</span>{" "}
                          {comment.moderationMessage}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment Input */}
            <DialogFooter>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                      ME
                    </AvatarFallback>
                  </Avatar>
                  <Textarea
                    className="flex-grow bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500 min-h-[80px]"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        e.preventDefault();
                        handleCommentSubmit();
                      }
                    }}
                  />
                </div>
                <div className="flex justify-between items-center ml-10">
                  <div className="text-xs text-zinc-500">
                    Press Ctrl+Enter to submit
                  </div>
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600"
                    onClick={handleCommentSubmit}
                    disabled={comment.trim() === ""}
                  >
                    <Send className="h-4 w-4 mr-2" /> Submit
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm overflow-hidden flex flex-col hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="h-48 bg-zinc-800 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-emerald-400/20" />
              </div>

              <CardContent className="p-6 flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className="border-zinc-700 text-zinc-400"
                  >
                    {post.category}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-zinc-100 mb-2 line-clamp-2">
                  {post.title}
                </h3>

                <div className="text-zinc-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center text-xs text-zinc-500"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </div>
                  ))}
                  {post.tags.length > 2 && (
                    <div className="text-xs text-zinc-500">
                      +{post.tags.length - 2} more
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-2 border-t border-zinc-800 mt-auto">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={post.author.avatar}
                        alt={post.author.name}
                      />
                      <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-xs">
                        {post.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xs text-zinc-500">
                      {post.author.name}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-zinc-500 text-xs">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {post.likes}
                    </div>
                    <div className="flex items-center text-zinc-500 text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {post.comments}
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-100 mb-2">
              No articles found
            </h3>
            <div className="text-zinc-400 mb-6">
              We couldn't find any articles matching your search criteria.
            </div>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
