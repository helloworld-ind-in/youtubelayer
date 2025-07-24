import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, Pen, Trash } from "lucide-react";
import Link from "next/link";
import { ProjectType } from "./PropType";

export default function ProjectCardComponent(props: { project: ProjectType }) {
  return (
    <Card key={props.project._id} className="group relative">
      <CardHeader>
        <Link href={`/project/${props.project._id}`}>
          <CardTitle>{props.project.title}</CardTitle>
          <CardDescription>{props.project._id}</CardDescription>
        </Link>
        <CardAction>
          <div className="space-x-2">
            <Button><Pen /></Button>
            <Button variant="destructive"><Trash /></Button>
          </div>
        </CardAction>
      </CardHeader>
      <Link href={`/project/${props.project._id}`}>
        <CardContent className="flex justify-center">
          <Folder size={200} />
        </CardContent>
        <CardFooter>
          <p>{props.project.description}</p>
        </CardFooter>
      </Link>
    </Card>
  )
}