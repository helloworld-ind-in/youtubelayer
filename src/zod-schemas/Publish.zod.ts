import { z } from "zod";

export const PublishSchema = z.object({
	title: z.string().nonempty({ message: "Title cannot be empty." }),
	description: z.string().nonempty({ message: "Description cannot be empty." }).max(300, { message: "Description cannot be more then 300." }),
	tags: z.string().nonempty({ message: "Tags cannot be empty." }),
	privacy: z.string().nonempty({ message: "Privacy cannot be empty." }),
	videoId: z.string().nonempty({ message: "Video id cannot be empty." }),
	projectId: z.string().nonempty({ message: "Project id cannot be empty." })
});