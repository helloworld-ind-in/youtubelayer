import { z } from "zod";

export const SignupSchema = z.object({
    email: z.string().email({message: "Invalid email address."}),
    password: z.string().min(6, {message: "Password must be atleast 6 characters."}),
    role: z.string().nonempty({message: "You must select a role."})
});