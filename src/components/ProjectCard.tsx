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
import { FolderOpen, Trash } from "lucide-react";
import Link from "next/link";

export default function ProjectCard({ project }) {
	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>{project._id}</CardTitle>
				<CardDescription>
				</CardDescription>
				<CardAction>
					<Button variant="destructive"><Trash /></Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<Link href={`/project/${project._id}`}>
					<section className="flex flex-col justify-center items-center">
						<FolderOpen size={200} />
					</section>
				</Link>
			</CardContent>
			<CardFooter className="flex-col">
				<Button variant="secondary" className="w-full font-bold">
					{project.title}
				</Button>
			</CardFooter>
		</Card>
	)
}