"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { APIResponse } from "@/types/APIResponse";
import { toast } from "sonner";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { CloudUpload, Loader2 } from "lucide-react";
import { PublishSchema } from "@/zod-schemas/Publish.zod";
import { VideoType } from "./PropType";

export function VideoPublishDialogComponent(props: { video: VideoType, projectId: string }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dialogCloseBtn = useRef<HTMLButtonElement>(null);

	const form = useForm<z.infer<typeof PublishSchema>>({
		resolver: zodResolver(PublishSchema),
		defaultValues: {
			videoId: props.video._id,
			projectId: props.projectId,
			title: "",
			description: "",
			tags: "",
			privacy: "private"
		}
	});

	const onSubmit = async (data: z.infer<typeof PublishSchema>) => {
		setIsSubmitting(true);

		try {
			const response = await axios.post<APIResponse>("/api/publish", data);
			console.log(response);
			toast(response.data.message);
		} catch (error) {
			const axiosError = error as AxiosError<APIResponse>;
			const errorMessage = axiosError.response?.data.message;
			toast(errorMessage);
		} finally {
			form.setValue("title", "");
			form.setValue("description", "");
			form.setValue("tags", "");
			form.setValue("privacy", "private");
			setIsSubmitting(false);
			dialogCloseBtn.current?.click();
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-full">
					<CloudUpload /> Publish Video
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Publish Video to YouTube</DialogTitle>
					<DialogDescription>
						Publish your video to youtube on one click.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="projectId"
							render={({ field }) => (
								<FormItem className="hidden">
									<FormLabel>Project Id</FormLabel>
									<FormControl>
										<Input disabled={true} placeholder="Project Id" {...field} />
									</FormControl>
									<FormDescription>
										Please provide a project id for the video.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="videoId"
							render={({ field }) => (
								<FormItem className="hidden">
									<FormLabel>Video Id</FormLabel>
									<FormControl>
										<Input disabled={true} placeholder="Video Id" {...field} />
									</FormControl>
									<FormDescription>
										Please provide a video id for the video.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Title" {...field} />
									</FormControl>
									<FormDescription>
										Please provide a title for the video.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder="Description" {...field} />
									</FormControl>
									<FormDescription>
										Please provide description for the video.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<Input placeholder="Tags" {...field} />
									</FormControl>
									<FormDescription>
										Please provide tags separated by , for the video.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="privacy"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Privacy Status</FormLabel>
									<FormControl>
										<Input placeholder="Privacy Status" {...field} />
									</FormControl>
									<FormDescription>
										Please provide privacy status for the video, default is private.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<section className="flex justify-end space-x-2">
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? (<Loader2 className="animate-spin" />) : ("Publish")}
								</Button>
								<DialogClose asChild>
									<Button variant="outline" ref={dialogCloseBtn}>Cancel</Button>
								</DialogClose>
							</section>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}