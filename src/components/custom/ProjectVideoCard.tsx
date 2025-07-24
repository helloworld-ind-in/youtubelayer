import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CloudDownload, Play, Trash } from "lucide-react";
import { VideoType } from "./PropType";
import { VideoPublishDialogComponent } from "./VideoPublishDialog";

export function ProjectVideoCardComponent(props: { video: VideoType, projectId: string }) {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <Card key={props.video._id} className="group relative">
      <CardHeader>
        <CardTitle>{props.video.name}</CardTitle>
        <CardDescription>
          hello
        </CardDescription>
        <CardAction>
          <Button variant="destructive"><Trash /></Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <section className="flex justify-center items-center w-full min-h-50 bg-slate-300 rounded">
          <Play />
        </section>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        {
          user && user.role === "owner" && props.video.userId != user.username ? (
            <VideoPublishDialogComponent video={props.video} projectId={props.projectId} />
          ) : ("")
        }

        {
          user && user.role === "editor" && props.video.userId != user.username ? (
            <Button variant="default" className="w-full">
              <CloudDownload /> Download
            </Button>
          ) : ("")
        }
      </CardFooter>
    </Card>
  )
}