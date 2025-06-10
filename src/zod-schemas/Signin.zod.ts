import { z } from "zod";

export const SigninSchema = z.object({
	identifier: z.string().nonempty({ message: "Email cannot be empty." }),
	password: z.string().nonempty({ message: "Password cannot be empty." })
});