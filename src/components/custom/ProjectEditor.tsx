import { useEffect, useRef, useState } from "react";
import { ProjectEditorType } from "./PropType";
import axios, { AxiosError } from "axios";
import { APIResponse } from "@/types/APIResponse";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditorSchema } from "@/zod-schemas/Editor.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader, Plus, Trash } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export function ProjectEditorComponent(props: { projectId: string }) {
  const [loadingProjectEditors, setLoadingProjectEditors] = useState<boolean>(false);
  const [projectEditors, setProjectEditors] = useState<ProjectEditorType[]>([]);
  const fetchProjectEditors = async () => {
    setLoadingProjectEditors(true);

    try {
      const response = await axios.get(`/api/editor/${props.projectId}`);
      setProjectEditors(response.data.data.projectEditors);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast(errorMessage);
    } finally {
      setLoadingProjectEditors(false);
    }
  }

  const formAddEditor = useForm<z.infer<typeof EditorSchema>>({
    resolver: zodResolver(EditorSchema),
    defaultValues: {
      email: ""
    }
  })

  const [submittingAddEditor, setSubmittingAddEditor] = useState(false);
  const [reloadEditors, setReloadEditors] = useState<boolean>(false);
  const addEditorDialogCloseBtn = useRef<HTMLButtonElement>(null);
  const onSubmitAddEditor = async (value: z.infer<typeof EditorSchema>) => {
    setSubmittingAddEditor(true);

    try {
      const response = await axios.post<APIResponse>(`/api/editor/${props.projectId}`, value);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast(errorMessage);
    } finally {
      formAddEditor.setValue("email", "");
      setSubmittingAddEditor(false);
      addEditorDialogCloseBtn.current?.click();
      setReloadEditors((prev) => !prev);
    }
  }

  useEffect(() => {
    fetchProjectEditors();
  }, [reloadEditors]);

  return (
    <div>
      <Card className="md:w-md">
        <CardHeader>
          <CardTitle>Editors</CardTitle>
          <CardDescription>
            Editors assigned to this project.
          </CardDescription>
          <CardAction>
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
                <Form {...formAddEditor}>
                  <form onSubmit={formAddEditor.handleSubmit(onSubmitAddEditor)} className="space-y-4">
                    <FormField
                      control={formAddEditor.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                          <FormDescription>
                            Please provide editor's email.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <section className="flex justify-end space-x-2">
                      <Button type="submit" disabled={submittingAddEditor}>
                        {submittingAddEditor ? (<Loader className="animate-spin" />) : ("Add Editor")}
                      </Button>
                      <DialogClose asChild>
                        <Button variant="destructive" ref={addEditorDialogCloseBtn}>Cancel</Button>
                      </DialogClose>
                    </section>
                  </form>
                </Form>
                <DialogFooter>
                </DialogFooter>
              </DialogContent>
            </Dialog >
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2">
          {
            loadingProjectEditors ? (
              <section className="flex justify-center items-center">
                <Loader className="animate-spin" />
              </section>
            ) : (
              projectEditors.map((editor) => (
                <section key={editor._id} className="flex flex-row justify-between items-center shadow p-2 rounded bg-slate-50">
                  {editor.email}
                  <RemoveProjectEditorDialogComponent projectId={props.projectId} email={editor.email} setReloadEditors={setReloadEditors} />
                </section>
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

export function RemoveProjectEditorDialogComponent(props: {projectId: string, email: string, setReloadEditors: Function}) {
  const [submittingRemoveEditor, setSubmittingRemoveEditor] = useState(false);
  const removeEditorDialogCloseBtn = useRef<HTMLButtonElement>(null);

  const formRemoveEditor = useForm<z.infer<typeof EditorSchema>>({
    resolver: zodResolver(EditorSchema),
    defaultValues: {
      email: props.email,
    }
  })

  const onSubmitRemoveEditor = async (value: z.infer<typeof EditorSchema>) => {
    setSubmittingRemoveEditor(true);

    try {
      const response = await axios.delete<APIResponse>(`/api/editor/${props.projectId}`, { data: value });
      toast(response.data.message);
      console.log(response)
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast(errorMessage);
    } finally {
      setSubmittingRemoveEditor(false);
      removeEditorDialogCloseBtn.current?.click();
      props.setReloadEditors((prev: boolean) => !prev);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="destructive"><Trash /></Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure to remove the editor?</DialogTitle>
          <DialogDescription>
            This action will remove <b>{props.email}</b> as editor from your project.
          </DialogDescription>
        </DialogHeader>
        <Form {...formRemoveEditor}>
          <form onSubmit={formRemoveEditor.handleSubmit(onSubmitRemoveEditor)} className="space-y-4">
            <FormField
              control={formRemoveEditor.control}
              name="email"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please provide editor's email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={submittingRemoveEditor}>
                {submittingRemoveEditor ? (<Loader className="animate-spin" />) : ("Remove Editor")}
              </Button>
              <DialogClose asChild>
                <Button variant="outline" ref={removeEditorDialogCloseBtn}>Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}