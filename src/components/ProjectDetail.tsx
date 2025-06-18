"use client"

import { APIResponse } from "@/types/APIResponse";
import axios, { AxiosError } from "axios";
import { Loader, Pen, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

type Project = {
  title: string;
  description: string;
};

export default function ProjectDetail() {
	const params = useParams<{ projectId: string }>();
	const projectId = params.projectId;

	const [projectDetail, setProjectDetail] = useState<Project>();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchProjectDetail = async () => {
			setIsLoading(true);

			try {
				const response = await axios.get(`/api/project/${projectId}`);
				setProjectDetail(response.data.data);
			} catch (error) {
				const axiosError = error as AxiosError<APIResponse>;
				const errorMessage = axiosError.response?.data.message;
				toast(errorMessage);
			} finally {
				setIsLoading(false);
			}
		}

		fetchProjectDetail();
	}, [projectId]);
	return (
		<div className="flex justify-center">
			{
				isLoading ? (
					<Card className="w-full max-w-md">
						<CardContent className="flex justify-center">
							<Loader className="animate-spin" />
						</CardContent>
					</Card>
				) : (
					<Card className="w-full max-w-md shadow">
						<CardHeader>
							<CardTitle className="text-4xl">Project</CardTitle>
							<CardDescription className="text-justify">
							</CardDescription>
							<CardAction className="space-x-2">
								<Button variant="default"><Pen /></Button>
								<Button variant="destructive"><Trash /></Button>
							</CardAction>
						</CardHeader>
						<CardContent className="space-y-2">
							<h1 className="text-2xl">
								{projectDetail?.title}
							</h1>
							<p className="text-justify">{projectDetail?.description}</p>
						</CardContent>
						<CardFooter className="flex-col gap-2">
						</CardFooter>
					</Card>
				)
			}
		</div>
	);
}