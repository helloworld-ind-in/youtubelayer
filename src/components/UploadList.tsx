"use client"

import { APIResponse } from "@/types/APIResponse";
import axios, { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { VideoCard } from "./VideoCard";

export default function UploadList() {
	const params = useParams<{ projectId: string }>();
	const projectId = params.projectId;

	const [isLoading, setIsLoading] = useState(false);
	const [ownerUploads, setOwnerUploads] = useState<{_id: string, userId: string, name: string}[]>([]);
	const [editorUploads, setEditorUploads] = useState<{_id: string, userId: string, name: string}[]>([]);

	useEffect(() => {
		const fetchUploadDetails = async () => {
			setIsLoading(true);

			try {
				const response = await axios.get(`/api/upload/${projectId}`);
				setOwnerUploads(response.data.data.ownerUpload);
				setEditorUploads(response.data.data.editorUpload);
			} catch (error) {
				const axiosError = error as AxiosError<APIResponse>;
				const errorMessage = axiosError.response?.data.message;
				toast(errorMessage);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUploadDetails();
	}, [projectId]);
	return (
		<div>
			<h1 className="font-extrabold text-2xl m-4">Owner Uploads</h1>
			{
				isLoading ? (
					<section className="flex justify-center items-center">
						<Loader className="animate-spin" />
					</section>
				) : (
					<section className="grid grid-cols-3 space-y-6">
						{
							ownerUploads.map((ownerUpload) => (
								<VideoCard key={ownerUpload._id} video={ownerUpload} />
							))
						}
					</section>
				)
			}

			<h1 className="font-extrabold text-2xl m-4">Editor Uploads</h1>
			{
				isLoading ? (
					<section className="flex justify-center items-center">
						<Loader className="animate-spin" />
					</section>
				) : (
					<section className="grid grid-cols-3 space-y-6">
						{
							editorUploads.map((editorUpload) => (
								<VideoCard key={editorUpload._id} video={editorUpload} />
							))
						}
					</section>
				)
			}
		</div>
	);
}