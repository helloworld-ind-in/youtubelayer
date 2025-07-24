import { APIResponse } from "@/types/APIResponse";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { ProjectUploadComponent } from "./ProjectUpload";
import { ProjectVideoCardComponent } from "./ProjectVideoCard";

export function ProjectUploadListComponent(props: { projectId: string }) {
  const [reloadUploads, setReloadUploads] = useState(false);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [ownerUploads, setOwnerUploads] = useState<{ _id: string, userId: string, name: string }[]>([]);
  const [editorUploads, setEditorUploads] = useState<{ _id: string, userId: string, name: string }[]>([]);

  const fetchUploadDetails = async () => {
    setLoadingUploads(true);

    try {
      const response = await axios.get(`/api/upload/${props.projectId}`);
      setOwnerUploads(response.data.data.ownerUpload);
      setEditorUploads(response.data.data.editorUpload);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast(errorMessage);
    } finally {
      setLoadingUploads(false);
    }
  }

  useEffect(() => {
    fetchUploadDetails();
  }, [reloadUploads]);

  return (
    <div>
      <ProjectUploadComponent
        projectId={props.projectId}
        setReloadUploads={setReloadUploads}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Owner Uploads</h1>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-1 lg:grid-cols-3 xl:gap-x-8">
          {
            loadingUploads ? (<Loader className="animate-spin" />) : (
              <>
                {ownerUploads.map((ownerUpload) => (<ProjectVideoCardComponent key={ownerUpload._id} video={ownerUpload} projectId={props.projectId} />))}
              </>
            )
          }
        </div>
      </div>

      <div className="mnb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Editor Uploads</h1>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-1 lg:grid-cols-3 xl:gap-x-8">
          {
            loadingUploads ? (<Loader className="animate-spin" />) : (
              <>
                {editorUploads.map((editorUpload) => (<ProjectVideoCardComponent key={editorUpload._id} video={editorUpload} projectId={props.projectId} />))}
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}