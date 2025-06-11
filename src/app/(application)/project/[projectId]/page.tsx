"use client"

import ProjectDetail from "@/components/ProjectDetail";
import ProjectEditor from "@/components/ProjectEditors";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export default function ProjectPage() {
	const { data: session } = useSession();
	const user: User = session?.user as User;

	return (
		<div className="w-full grid grid-cols-3 mt-6">
			<ProjectDetail />
			{user && user.role == "owner" ? (<ProjectEditor />) : (<div></div>)}
		</div>
	);
}