import mongoose, { Schema, Document } from "mongoose";

export interface EditorInterface extends Document {
	projectId: string
	editorId: string
}

const EditorSchema: Schema<EditorInterface> = new Schema({
	projectId: {
		type: String,
		required: [true, "Project id is required."],
	},
	editorId: {
		type: String,
		required: [true, "Editor id is required"]
	}
}, { timestamps: true });

const EditorModel = mongoose.models.editor as mongoose.Model<EditorInterface> || mongoose.model<EditorInterface>("editor", EditorSchema);
export default EditorModel;