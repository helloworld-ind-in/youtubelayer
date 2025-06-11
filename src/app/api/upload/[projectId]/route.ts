import DBConnect from "@/lib/DBConnect";
import EditorModel from "@/models/Editor.model";
import ProjectModel from "@/models/Project.model";
import UploadModel from "@/models/Upload.model";
import UserModel from "@/models/User.model";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { extname } from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
		const user = await UserModel.findOne({ _id: userId })
		if (!user) {
			return Response.json({
				success: false,
				message: "Unauthorized: User doesn't exist."
			}, { status: 401 })
		}

		const project = await ProjectModel.findOne({ _id: projectId });
		if (!project) {
			return Response.json({
				success: false,
				message: "Project does not exits."
			}, { status: 404 });
		}

		let ownerUpload = [];
		let editorUpload = [];

		switch (role) {
			case "owner": {
				const isOwner = await ProjectModel.findOne({ _id: projectId, userId });
				if (!isOwner) {
					return Response.json({
						success: false,
						message: "Unauthorized: You don't own this project."
					}, { status: 401 });
				}

				ownerUpload = await UploadModel.find({ projectId, userId });
				editorUpload = await UploadModel.find({ projectId, userId: { $ne: userId } });

				return Response.json({
					success: true,
					message: "Successfully fetched all upload for this project.",
					data: { ownerUpload, editorUpload }
				}, { status: 200 });
			}

			case "editor": {
				const isEditorAssigned = await EditorModel.findOne({ projectId, editorId: userId });

				if (!isEditorAssigned) {
					return Response.json({
						success: false,
						message: "Unauthorized: You are not assigned to this project."
					}, { status: 401 });
				}

				const ownerId = project.userId;

				editorUpload = await UploadModel.find({ projectId, userId });
				ownerUpload = await UploadModel.find({ projectId, userId: ownerId });

				return Response.json({
					success: true,
					message: "Successfully fetched all upload for this project.",
					data: { ownerUpload, editorUpload }
				}, { status: 200 });
			}

			default: {
				return Response.json({
					sucess: false,
					message: "Unauthorized: Unable to fetch project uploads."
				}, { status: 401 });
			}
		}
	} catch (error) {
		console.log("Error: Unable to fetch project uploads.");
		console.log(error);
		return Response.json({
			success: false,
			message: "Unable to fetch project uploads."
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

	await DBConnect();

	try {
		const user = await UserModel.findOne({ _id: userId })
		if (!user) {
			return Response.json({
				success: false,
				message: "Unauthorized: User doesn't exist."
			}, { status: 401 })
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
				const isOwner = await ProjectModel.findOne({ _id: projectId, userId });
				if (!isOwner) {
					return Response.json({
						success: false,
						message: "Unauthorized: You don't own this project."
					}, { status: 401 });
				}
				break;
			}

			case "editor": {
				const isEditorAssigned = await EditorModel.findOne({ projectId, editorId: userId });
				if (!isEditorAssigned) {
					return Response.json({
						success: false,
						message: "Unauthorized: You are not assigned to this project."
					}, { status: 401 });
				}
				break;
			}

			default: {
				return Response.json({
					sucess: false,
					message: "Unauthorized: Unable to fetch project uploads."
				}, { status: 401 });
			}
		}

		const data = await request.formData();
		const file: File | null = data.get('file') as unknown as File;

		if (!file) {
			return Response.json({
				success: false,
				message: "Not a file."
			}, { status: 400 });
		}

		const newUpload = new UploadModel({
			name: file.name,
			projectId,
			userId
		});

		const savedUpload = await newUpload.save();

		const s3client: S3Client = new S3Client({
			region: process.env.AWS_REGION,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
			}
		});

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const newFileName = `${savedUpload._id}${extname(file.name)}`;

		const command = new PutObjectCommand({
			Bucket: process.env.AWS_BUCKET,
			Key: newFileName,
			Body: buffer,
			ContentType: "video/*"
		});

		const response = await s3client.send(command);

		return Response.json({
			success: true,
			message: "File uploaded successfully.",
			data: savedUpload
		}, { status: 200 });
	} catch (error) {
		console.log("Error: Unable to upload file.");
		console.log(error);
		return Response.json({
			success: false,
			message: "Unable to upload file."
		}, { status: 500 });
	}
}