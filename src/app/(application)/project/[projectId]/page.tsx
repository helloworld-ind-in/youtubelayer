import { ProjectPageComponent } from "@/components/custom/ProjectPageComponent";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return (<ProjectPageComponent projectId={projectId} />);
}