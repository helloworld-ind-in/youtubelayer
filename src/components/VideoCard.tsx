"use client"

import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CloudDownload, Play, Trash } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { PublishDialog } from "./PublishDialog";

type VideoCardProps = {
  video: {
    _id: string;
		userId: string;
		name: string;
  };
};

export function VideoCard({video}: VideoCardProps) {
	const { data: session } = useSession();
	const user: User = session?.user as User;

	return (
		<div className="flex justify-center mb-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardDescription>
					</CardDescription>
					<CardTitle>{video.name}</CardTitle>
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
						user && user.role === "owner" && video.userId != user.username ? (
							<PublishDialog video={video} />
						) : ("")
					}

					{
						user && user.role === "editor" && video.userId != user.username ? (
							<Button variant="default" className="w-full">
								<CloudDownload /> Download
							</Button>
						) : ("")
					}
				</CardFooter>
			</Card>
		</div>
	);
}
