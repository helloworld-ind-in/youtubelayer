import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

export function ProjectUploadComponent(props: { projectId: string, setReloadUploads: Function }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const uploadForm = useRef<HTMLFormElement>(null);
  const onSubmitUpload = async (e: React.FormEvent) => {
    setUploading(true);
    e.preventDefault();

    if (!file) {
      toast("Please select a video file.");
      setUploading(false);
      return;
    }

    if (file.size > 4270000) {
      toast("Video file size cannot be more then 4MB.");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`/api/upload/${props.projectId}`, formData);
      toast(response.data.message);
    } catch (error) {
      console.log(error)
      toast("Some error occured during file upload.");
    } finally {
      uploadForm.current?.reset();
      setUploading(false);
      props.setReloadUploads((prev: boolean) => !prev);
    }
  }

  return (
    <div className="mb-4 md:max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Upload Video File</CardTitle>
          <CardDescription>
          </CardDescription>
          <CardAction>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmitUpload} ref={uploadForm}>
            <Input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Button type="submit" disabled={uploading}>
              {uploading ? (<Loader className="animate-spin" />) : ("Upload")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}