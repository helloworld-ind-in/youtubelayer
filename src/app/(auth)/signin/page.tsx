"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react";
import { useState } from "react";
import { SigninSchema } from "@/zod-schemas/Signin.zod";

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof SigninSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      });

      if (result?.error) {
        toast("Incorrect username or password.");
        setIsSubmitting(false);
      }

      if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.log(error);   // to fix compile error
      toast("Incorrect username or password.");
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-4 rounded-lg shadow-2xl">
        <div className="text-left space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">YouTubeLayer</h1>
          <p>Login to streamline your YouTube video publishing.</p>
          <p>Not a member yet? <Link href="/signup" className="text-blue-500">Register</Link> now!</p>
        </div>
        <Form {...form}>
          <h1 className="text-3xl font-bold">Login</h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email"
                      {...field}
                    />
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
                    <Input type="password" placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide your password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (<Loader className="animate-spin" />) : ('Login')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}