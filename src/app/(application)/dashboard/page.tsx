"use client"

import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import ProjectList from "@/components/ProjectList";

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <div className="p-6 flex flex-row justify-between items-center">
        <h1 className="text-4xl font-bold"> Dashboard</h1>
        <CreateProjectDialog />
      </div>
      <div>
        <ProjectList />
      </div>
    </div>
  );
}