"use client"

import CreateProjectComponent from "@/components/custom/CreateProject";
import ProjectCardComponent from "@/components/custom/ProjectCard";
import { ProjectType } from "@/components/custom/PropType";
import { APIResponse } from "@/types/APIResponse";
import axios, { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reloadProjects, setReloadProjects] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/project");
      setProjects(response.data.data.projectDetails);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [reloadProjects])

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <CreateProjectComponent setReloadProjects={setReloadProjects} />
      </div>
      {
        isLoading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-1 lg:grid-cols-3 xl:gap-x-8">
            {projects.map((project) => (
              <ProjectCardComponent key={project._id} project={project} />
            ))}
          </div>
        )
      }
    </main>
  );
}