"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";

export default function UploadCard() {
	const params = useParams<{ projectId: string }>();
	const projectId = params.projectId;

	const [file, setFile] = useState();
	const [isUploading, setIsUploading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		setIsUploading(true);
		e.preventDefault();

		if (!file) {
			return;
		}

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await axios.post(`/api/upload/${projectId}`, formData);
			toast(response.data.message);
		} catch (error) {
			toast("Some error occured during file upload.");
		} finally {
			setIsUploading(false);
		}
	}

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Upload Video File</CardTitle>
					<CardDescription>
					</CardDescription>
					<CardAction>
					</CardAction>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<Input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
						<Button type="submit" disabled={isUploading ? true : false}>
							{
								isUploading ? (
									<><Loader className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
								) : (
									"Upload"
								)
							}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
