"use client"

import ProjectDetail from "@/components/ProjectDetail";
import ProjectEditor from "@/components/ProjectEditors";
import UploadCard from "@/components/UploadCard";
import UploadList from "@/components/UploadList";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export default function ProjectPage() {
	const { data: session } = useSession();
	const user: User = session?.user as User;

	return (
		<main>
			<div className="w-full grid grid-cols-3 mt-6">
				<ProjectDetail />
				{user && user.role == "owner" ? (<ProjectEditor />) : (<div></div>)}
				<UploadCard />
			</div>
			<UploadList />
		</main>
	);
}