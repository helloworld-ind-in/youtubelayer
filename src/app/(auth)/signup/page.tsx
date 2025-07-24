"use client"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupSchema } from "@/zod-schemas/Signup.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types/APIResponse";
import { Loader, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      role: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<APIResponse>("/api/user/signup", data);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errorMessage = axiosError.response?.data.message; // changed from let to const to fix compile error
      toast(errorMessage);
    } finally {
      form.setValue("email", "");
      form.setValue("password", "");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-4 rounded-lg shadow-2xl">
        <div className="text-left space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">YouTubeLayer</h1>
          <p>Register to streamline your YouTube video publishing.</p>
          <p>Already a member? <Link href="/signin" className="text-blue-500">Login</Link> now!</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h1 className="text-3xl font-bold">Register</h1>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Channel Owner</SelectItem>
                        <SelectItem value="editor">Video Editor</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Please select your role.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    Please provide your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please provide your password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (<Loader className="animate-spin" />) : ('Register')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}