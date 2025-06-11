"use client"

import { Loader, Plus, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { APIResponse } from "@/types/APIResponse";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { EditorSchema } from "@/zod-schemas/Editor.zod";

export default function ProjectEditor() {
	const params = useParams<{ projectId: string }>();
	const projectId = params.projectId;

	const [projectEditors, setProjectEditors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchProjectEditors = async () => {
			setIsLoading(true);

			try {
				const response = await axios.get(`/api/editor/${projectId}`);
				console.log(response);
				setProjectEditors(response.data.data.projectEditors);
			} catch (error) {
				const axiosError = error as AxiosError<APIResponse>;
				let errorMessage = axiosError.response?.data.message;
				toast(errorMessage);
			} finally {
				setIsLoading(false);
			}
		}

		fetchProjectEditors();
	}, []);

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Editors</CardTitle>
					<CardDescription>
						Editors assigned to this project.
					</CardDescription>
					<CardAction>
						<AddEditorDialog />
					</CardAction>
				</CardHeader>
				<CardContent className="space-y-2">
					{
						isLoading ? (
							<section className="flex justify-center">
								<Loader className="animate-spin" />
							</section>
						) : (
							projectEditors.map((editor) => (
								<EditorCard key={editor._id} editor={editor} />
							))
						)
					}
				</CardContent>
				<CardFooter className="flex-col gap-2">
				</CardFooter>
			</Card>
		</div>
	);
}

export function EditorCard({ editor }) {
	return (
		<section className="flex flex-row justify-between items-center shadow p-2 rounded bg-slate-50">
			{editor.email}
			<Button variant="destructive"><Trash /></Button>
		</section>
	);
}

export function AddEditorDialog() {
	const params = useParams<{ projectId: string }>();
	const projectId = params.projectId;

	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof EditorSchema>>({
		resolver: zodResolver(EditorSchema),
		defaultValues: {
			email: ""
		}
	});

	const onSubmit = async (data: z.infer<typeof EditorSchema>) => {
		setIsSubmitting(true);

		try {
			const response = await axios.post<APIResponse>(`/api/editor/${projectId}`, data);
			toast(response.data.message);
		} catch (error) {
			const axiosError = error as AxiosError<APIResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast(errorMessage);
		} finally {
			form.setValue("email", "");
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default"><Plus /></Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Editor</DialogTitle>
					<DialogDescription>
						Add or assign an editor to your project.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Email" {...field} />
									</FormControl>
									<FormDescription>
										Please provide editors email.
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
										<><Loader className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
									) : (
										"Add Editor"
									)
								}
							</Button>
						</section>
					</form>
				</Form>
				<DialogFooter>
				</DialogFooter>
			</DialogContent>
		</Dialog >
	);
}