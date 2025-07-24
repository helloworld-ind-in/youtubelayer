"use client"

import { useSession } from "next-auth/react";
import { ProjectDetailsComponent } from "./ProjectDetails";
import { ProjectEditorComponent } from "./ProjectEditor";
import { ProjectUploadListComponent } from "./ProjectUploadList";
import { User } from "next-auth";

export function ProjectPageComponent({ projectId }: { projectId: string }) {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
      <div className="mb-6 space-y-4 md:flex md:justify-between md:space-x-6">
        <ProjectDetailsComponent projectId={projectId} />
        {user && user.role == "owner" ? (<ProjectEditorComponent projectId={projectId} />) : (<div></div>)}
      </div>
      <ProjectUploadListComponent projectId={projectId} />
    </main>
  );
}









