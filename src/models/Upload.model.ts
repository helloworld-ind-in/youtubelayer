import mongoose, { Schema, Document } from "mongoose";

export interface UploadInterface extends Document {
	name: string
	projectId: string
	userId: string
}

const UploadSchema: Schema<UploadInterface> = new Schema({
	name: {
		type: String,
		required: [true, "Upload file name is required."],
		trim: true,
	},
	projectId: {
		type: String,
		required: [true, "Project id is required."]
	},
	userId: {
		type: String,
		required: [true, "User id is required."]
	}
}, { timestamps: true });

const UploadModel = mongoose.models.upload as mongoose.Model<UploadInterface> || mongoose.model<UploadInterface>("upload", UploadSchema);
export default UploadModel;