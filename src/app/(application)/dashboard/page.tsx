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
      console.log(response.data)
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
    <main>
      <div className="flex justify-between p-4">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <CreateProjectComponent setReloadProjects={setReloadProjects} />
      </div>
      <div className="p-6 space-y-6 md:flex flex-wrap space-x-6 justify-around">
        {isLoading ? (<div className="flex justify-center items-center"><Loader className="animate-spin" /></div>) : (
          <>
            {projects.map((project) => (<ProjectCardComponent key={project._id} project={project} />))}
            <div className="md:min-w-sm"></div>
          </>
        )}
      </div>
    </main>
  );
}