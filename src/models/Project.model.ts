import mongoose, { Schema, Document } from "mongoose";

export interface ProjectInterface extends Document {
	title: string
	description: string
	userId: string
}

const ProjectSchema: Schema<ProjectInterface> = new Schema({
	title: {
		type: String,
		required: [true, "Project title is required."],
		trim: true,
	},
	description: {
		type: String
	},
	userId: {
		type: String,
		required: [true, "User id is required."]
	}
}, { timestamps: true });

const ProjectModel = mongoose.models.project as mongoose.Model<ProjectInterface> || mongoose.model<ProjectInterface>("project", ProjectSchema);
export default ProjectModel;