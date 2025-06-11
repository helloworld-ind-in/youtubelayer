"use client"

import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { APIResponse } from "@/types/APIResponse";
import { Loader } from "lucide-react";

export default function ProjectList() {
	const [isLoading, setIsLoading] = useState(false);
	const [projectDetails, setProjectDetails] = useState([]);

	useEffect(() => {
		const fetchProjectList = async () => {
			setIsLoading(true);

			try {
				const response = await axios.get("/api/project");
				setProjectDetails(response.data.data.projectDetails);
			} catch (error) {
				const axiosError = error as AxiosError<APIResponse>;
				let errorMessage = axiosError.response?.data.message;
				toast(errorMessage);
			} finally {
				setIsLoading(false);
			}
		}

		fetchProjectList();
	}, []);

	return (
		<div>
			<section className="flex justify-around flex-wrap space-y-8 p-6">
				{
					isLoading ? (
						<section className="flex flex-col justify-center items-center w-full min-h-dvh">
							<Loader className="animate-spin" />
						</section>
					) : (
						projectDetails.map((project) => (
							<ProjectCard key={project._id} project={project} />
						))
					)
				}
			</section>
		</div>
	);
}