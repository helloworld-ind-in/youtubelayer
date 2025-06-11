import { z } from "zod";

export const ProjectSchema = z.object({
	title: z.string().nonempty({ message: "Title cannot be empty." }),
	description: z.string().nonempty({ message: "Description cannot be empty." }).max(300, { message: "Description cannot be more then 300." })
});