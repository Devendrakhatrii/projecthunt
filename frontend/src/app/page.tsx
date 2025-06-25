"use client";

import { useEffect, useState } from "react";
import { getProjects, searchProjects } from "@/services/projectService";
import { Project } from "@/types/Project";
import { useAuth } from "@/context/authContext";
import { SearchBar } from "@/components/search";
import { ProjectCard } from "@/components/project-card";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    setLoading(true);

    timeout = setTimeout(async () => {
      if (search.trim() === "") {
        const res = await getProjects();
        setProjects(res);
      } else {
        const res = await searchProjects(search);
        setProjects(res);
      }
      setLoading(false);
    }, 400); // 400ms debounce

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    // Initial load
    (async () => {
      setLoading(true);
      const res = await getProjects();
      setProjects(res);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Discover Amazing Projects</h1>
          <p className="text-muted-foreground">
            Explore the latest projects from our community
          </p>
        </div>
        <SearchBar onSearch={setSearch} />
      </div>
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No projects found.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
