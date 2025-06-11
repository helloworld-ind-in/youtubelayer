import DBConnect from "@/lib/DBConnect";
import EditorModel, { EditorInterface } from "@/models/Editor.model";
import ProjectModel from "@/models/Project.model";
import UserModel from "@/models/User.model";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }) {
	const token = await getToken({ req: request });

	if (!token) {
		return Response.json({
			sucess: false,
			message: "Unauthorized: You need to login."
		}, { status: 401 });
	}

	const role = token.role;
	const userId = token.username;
	const param = await params;
	const projectId = param.projectId;

	await DBConnect();

	try {
		const user = await UserModel.findOne({ _id: userId });
		if (!user) {
			return Response.json({
				success: false,
				message: "Unauthorized: User doesn't exist."
			}, { status: 401 });
		}

		const project = await ProjectModel.findOne({ _id: projectId });
		if (!project) {
			return Response.json({
				success: false,
				message: "Project does not exits."
			}, { status: 404 });
		}

		let projectEditors: any;

		switch (role) {
			case "owner": {
				const isOwner = await ProjectModel.findOne({ _id: projectId, userId });
				if (!isOwner) {
					return Response.json({
						success: false,
						message: "Unauthorized: You don't own this project."
					}, { status: 401 });
				}

				let tempProjectEditors = await EditorModel.find({ projectId });
				let editorIds = tempProjectEditors.map(editor => editor.editorId.toString());
				let users = await UserModel.find({ _id: { $in: editorIds } }, 'email');

				// Convert user array to a lookup map for quick access
				let userMap = {};
				users.forEach(user => {
					userMap[user._id.toString()] = user.email;
				});

				// Combine editor document with email
				projectEditors = tempProjectEditors.map(editor => ({
					...editor.toObject(), // Convert Mongoose document to plain object
					email: userMap[editor.editorId.toString()] || null
				}));

				return Response.json({
					success: true,
					message: "Project editor fetched successfully.",
					data: { projectEditors }
				}, { status: 200 });
			}

			default: {
				return Response.json({
					sucess: false,
					message: "Unauthorized: Unable to fetch project editors."
				}, { status: 401 });
			}
		}
	} catch (error) {
		console.log("Error: Unable to fetch project editors.");
		console.log(error);
		return Response.json({
			success: false,
			message: "Unable to fetch project editors."
		}, { status: 500 });
	}
}

export async function POST(request: NextRequest, { params }) {
	const token = await getToken({ req: request });

	if (!token) {
		return Response.json({
			sucess: false,
			message: "Unauthorized: You need to login."
		}, { status: 401 });
	}

	const role = token.role;
	const userId = token.username;
	const param = await params;
	const projectId = param.projectId;
	const { email } = await request.json();

	await DBConnect();

	try {
		const user = await UserModel.findOne({ _id: userId });
		if (!user) {
			return Response.json({
				success: false,
				message: "Unauthorized: User doesn't exist."
			}, { status: 401 });
		}

		const project = await ProjectModel.findOne({ _id: projectId });
		if (!project) {
			return Response.json({
				success: false,
				message: "Project does not exits."
			}, { status: 404 });
		}

		switch (role) {
			case "owner": {
				const isOwner = ProjectModel.findOne({ _id: projectId, userId });
				if (!isOwner) {
					return Response.json({
						success: false,
						message: "Unauthorized: You don't own this project."
					}, { status: 401 });
				}

				const editor = await UserModel.findOne({ email, role: "editor" });
				if (!editor) {
					return Response.json({
						success: false,
						message: "Editor does not exits."
					}, { status: 404 });
				}

				const isEditorAssigned = await EditorModel.findOne({ projectId, editorId: editor._id });
				if (isEditorAssigned) {
					return Response.json({
						success: false,
						message: "Editor already assigned to this project."
					}, { status: 400 });
				}

				const newEditor = new EditorModel({
					projectId,
					editorId: editor._id
				});

				const savedEditor = newEditor.save();

				return Response.json({
					success: true,
					message: "Editor successfully assigned to the project.",
					data: savedEditor
				}, { status: 201 });
			}

			default: {
				return Response.json({
					sucess: false,
					message: "Unauthorized: You are not authorized to assign editor."
				}, { status: 401 });
			}
		}
	} catch (error) {
		console.log("Error: Unable to assign editor to the project.");
		console.log(error);
		return Response.json({
			success: false,
			message: "Unable to assign editor to the project."
		}, { status: 500 });
	}
}