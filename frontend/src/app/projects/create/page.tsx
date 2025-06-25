"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import Link from "next/link";
import { createProject } from "@/services/projectService";
import { toast } from "sonner";

const techOptions = [
  "Laravel",
  "Vue.js",
  "React",
  "MySQL",
  "Tailwind CSS",
  "Docker",
  "Node.js",
  "Python",
];

const projectTypes = ["personal", "client", "open-source"];

export default function CreateProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    tech_stack: [] as string[],
    description: "",
    repo_url: "",
    live_url: "",
    project_type: "personal",
    status: true,
  });
  const [newTech, setNewTech] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Prepare only the required payload for the API
      const payload = {
        title: formData.title,
        tech_stack: formData.tech_stack, // <-- keep as array
        description: formData.description,
        repo_url: formData.repo_url,
        live_url: formData.live_url,
        project_type: formData.project_type,
        status: formData.status,
      };
      await createProject(payload);
      toast.success("Project submitted!");
      router.push("/");
    } catch (err) {
      toast.error("Failed to submit project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTech = () => {
    if (newTech.trim() && !formData.tech_stack.includes(newTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const removeTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((t) => t !== tech),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Submit Your Project</h1>
          <p className="text-muted-foreground">
            Share your amazing project with the community
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter your project title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tech Stack *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      placeholder="Add a tech (e.g. Laravel)"
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTech())
                      }
                    />
                    <Button
                      type="button"
                      onClick={addTech}
                      size="icon"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tech_stack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="gap-1">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {techOptions
                      .filter((t) => !formData.tech_stack.includes(t))
                      .map((t) => (
                        <Button
                          key={t}
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              tech_stack: [...prev.tech_stack, t],
                            }))
                          }
                        >
                          {t}
                        </Button>
                      ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe what your project does and what makes it special"
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repo_url">Repository URL</Label>
                  <Input
                    id="repo_url"
                    type="url"
                    value={formData.repo_url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        repo_url: e.target.value,
                      }))
                    }
                    placeholder="https://github.com/username/project"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="live_url">Live URL</Label>
                  <Input
                    id="live_url"
                    type="url"
                    value={formData.live_url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        live_url: e.target.value,
                      }))
                    }
                    placeholder="https://yourproject.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project_type">Project Type *</Label>
                  <select
                    id="project_type"
                    value={formData.project_type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        project_type: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    required
                  >
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    value={formData.status ? "active" : "inactive"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value === "active",
                      }))
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submission Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Good projects have:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Clear, descriptive names</li>
                    <li>• Detailed descriptions</li>
                    <li>• Working website links</li>
                    <li>• High-quality screenshots</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Avoid:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Spam or low-quality content</li>
                    <li>• Broken or placeholder links</li>
                    <li>• Duplicate submissions</li>
                    <li>• Inappropriate content</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isSubmitting ||
                    !formData.title ||
                    !formData.description ||
                    !formData.project_type ||
                    formData.tech_stack.length === 0
                  }
                >
                  {isSubmitting ? "Submitting..." : "Submit Project"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
