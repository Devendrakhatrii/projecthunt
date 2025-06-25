"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, X, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  getProject,
  updateProject,
  deleteProject,
} from "@/services/projectService";
import { toast } from "sonner";
import type { Project } from "@/types/Project";
import { useAuth } from "@/context/authContext";

const categories = [
  "Design Tools",
  "Developer Tools",
  "Productivity",
  "Analytics",
  "Security",
  "Marketing",
  "AI/ML",
  "Mobile Apps",
  "Web Apps",
  "SaaS",
];

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    repo_url: "",
    live_url: "",
    tech_stack: [] as string[],
    project_type: "",
    status: true,
  });
  const [newTech, setNewTech] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();

  // Load existing project data
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const project = await getProject(params.id);
      if (project) {
        if (project.user_id !== authUser?.id) {
          toast.error("You are not authorized to edit this project.");
          router.push(`/projects/${params.id}`);
          setLoading(false);
          return;
        }
        setFormData({
          title: project.title,
          description: project.description,
          repo_url: project.repo_url || "",
          live_url: project.live_url || "",
          tech_stack: Array.isArray(project.tech_stack)
            ? project.tech_stack
            : typeof project.tech_stack === "string"
            ? (project.tech_stack as string)
                .split(",")
                .map((t: string) => t.trim())
            : [],
          project_type: project.project_type || "",
          status: project.status ?? true,
        });
      }
      setLoading(false);
    };
    fetchProject();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProject(params.id, formData);
      toast.success("Project updated!");
      router.push(`/projects/${params.id}`);
    } catch {
      toast.error("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteProject(params.id);
      toast.success("Project deleted!");
      router.push("/");
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
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

  const removeTech = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((tech) => tech !== techToRemove),
    }));
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href={`/projects/${params.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Project</h1>
              <p className="text-muted-foreground">
                Update your project information
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete Project"}
          </Button>
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
                    <Label>Tech Stack</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        placeholder="Add a tech"
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
                    {formData.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tech_stack.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="gap-1"
                          >
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
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project_type">Project Type</Label>
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
                      <option value="">Select a type</option>
                      <option value="personal">Personal</option>
                      <option value="client">Client</option>
                      <option value="open-source">Open Source</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
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
                <CardContent className="p-6 space-y-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isSubmitting || !formData.title || !formData.description
                    }
                  >
                    {isSubmitting ? "Updating..." : "Update Project"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/projects/${params.id}`}>Cancel</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
