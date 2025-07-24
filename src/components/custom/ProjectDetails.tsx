import { APIResponse } from "@/types/APIResponse";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Loader, Pen, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { ProjectType } from "./PropType";

export function ProjectDetailsComponent(props: { projectId: string }) {
  const [loadingProjectDetails, setLoadingProjectDetails] = useState<boolean>(false);
  const [projectDetails, setProjectDetails] = useState<ProjectType>();

  const fetchProjectDetails = async () => {
    setLoadingProjectDetails(true);

    try {
      const response = await axios.get(`/api/project/${props.projectId}`);
      setProjectDetails(response.data.data);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast(errorMessage);
    } finally {
      setLoadingProjectDetails(false);
    }
  }

  useEffect(() => {
    fetchProjectDetails();
  }, [props.projectId]);

  return (
    <div className="md:w-full">
      {
        loadingProjectDetails ? (
          <Card className="flex justify-center items-center md:w-md">
            <Loader className="animate-spin" />
          </Card>
        ) : (
          <Card className="md:w-full">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>ProjectId: {projectDetails?._id}</CardDescription>
              <CardAction>
                <div className="space-x-2">
                  <Button><Pen /></Button>
                  <Button variant="destructive"><Trash /></Button>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <h1 className="text-4xl font-bold mb-4">Title: {projectDetails?.title}</h1>
              <h2 className="text-2xl">Description: </h2>
              <p>{projectDetails?.description}</p>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        )
      }
    </div>
  )
}