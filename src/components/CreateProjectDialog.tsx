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
import { ProjectSchema } from "@/zod-schemas/Project.zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { APIResponse } from "@/types/APIResponse";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Loader2 } from "lucide-react";

export function CreateProjectDialog() {
	const router = useRouter();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof ProjectSchema>>({
		resolver: zodResolver(ProjectSchema),
		defaultValues: {
			title: "",
			description: ""
		}
	});

	const onSubmit = async (data: z.infer<typeof ProjectSchema>) => {
		setIsSubmitting(true);

		try {
			const response = await axios.post<APIResponse>("/api/project", data);
			toast(response.data.message);
			const projectId = response.data.data?._id;
			router.replace(`/project/${projectId}`);
		} catch (error) {
			const axiosError = error as AxiosError<APIResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast(errorMessage);
		} finally {
			setIsSubmitting(false);
			form.setValue("title", "");
			form.setValue("description", "");
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Create Project</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Project</DialogTitle>
					<DialogDescription>
						Create a new project for video editing.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Project Title</FormLabel>
									<FormControl>
										<Input placeholder="Project Title" {...field} />
									</FormControl>
									<FormDescription>
										Please provide a title for the new project.
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
									<FormLabel>Project Description</FormLabel>
									<FormControl>
										<Input placeholder="Project Description" {...field} />
									</FormControl>
									<FormDescription>
										Please provide description for the new project.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<section className="flex justify-end space-x-2">
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button type="submit" disabled={isSubmitting}>
								{
									isSubmitting ? (
										<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
									) : (
										"Create Project"
									)
								}
							</Button>
						</section>
					</form>
				</Form>
				<DialogFooter>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
