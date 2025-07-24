import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { APIResponse } from "@/types/APIResponse";
import { ProjectSchema } from "@/zod-schemas/Project.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function CreateProjectComponent(props: {setReloadProjects: Function}) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dialogCloseBtn = useRef<HTMLButtonElement>(null);

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
      const response = await axios.post("/api/project", data);
      toast(response.data.message);

    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast(errorMessage);
    } finally {
      form.setValue("title", "");
      form.setValue("description", "");
      setIsSubmitting(false);
      dialogCloseBtn.current?.click();
      props.setReloadProjects((prev: boolean) => !prev);
    }
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
                    <Textarea placeholder="Project Description" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please provide a description for the new project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (<Loader className="animate-spin" />) : ("Create")}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="destructive" ref={dialogCloseBtn}>
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}