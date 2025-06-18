import DBConnect from "@/lib/DBConnect";
import EditorModel from "@/models/Editor.model";
import ProjectModel from "@/models/Project.model";
import UserModel from "@/models/User.model";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const token = await getToken({ req: request });

	if (!token) {
		return Response.json({
			sucess: false,
			message: "Unauthorized: You need to login."
		}, { status: 401 });
	}

	const role = token.role;
	const userId = token.username;
	let projectDetails = [];

	await DBConnect();

	try {
		const user = await UserModel.findOne({ _id: userId });
		if (!user) {
			return Response.json({
				success: false,
				message: "Unauthorized: User doesn't exist."
			}, { status: 401 });
		}


		switch (role) {
			case "owner": {
				projectDetails = await ProjectModel.find({ userId });
				break;
			}

			case "editor": {
				const editorDetails = await EditorModel.find({ editorId: userId });


				const projectPromises = editorDetails.map(editorDetail =>
					ProjectModel.findOne({ _id: editorDetail.projectId })
				);

				projectDetails = await Promise.all(projectPromises);
				break;
			}

			default: {
				return Response.json({
					sucess: false,
					message: "Unauthorized: Unable to fetch projects list."
				}, { status: 401 });
			}
		}

		return Response.json({
			sucess: true,
			message: "Sucessfully fetched projects list.",
			data: { projectDetails }
		}, { status: 200 });
	} catch (error) {
		console.log("Error: Unable to fetch projects list.");
		console.log(error);
		return Response.json({
			sucess: false,
			message: "Unable to fetch projects list."
		}, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const token = await getToken({ req: request });

	if (!token) {
		return Response.json({
			sucess: false,
			message: "Unauthorized: You need to login."
		}, { status: 401 });
	}

	const role = token.role;
	if (role != "owner") {
		return Response.json({
			sucess: false,
			message: "Unauthorized: You are not authorized to create project."
		}, { status: 401 });
	}

	await DBConnect();

	try {
		const userId = token.username;
		const { title, description } = await request.json();

		const user = await UserModel.findOne({ _id: userId });
		if (!user) {
			return Response.json({
				success: false,
				message: "Unauthorized: User doesn't exist."
			}, { status: 401 });
		}

		const newProject = new ProjectModel({
			title,
			description,
			userId
		});

		const savedProject = await newProject.save();

		return Response.json({
			success: true,
			message: "Project created successfully.",
			data: savedProject
		}, { status: 201 });
	} catch (error) {
		console.log("Error: Unable to create project.");
		console.log(error);
		return Response.json({
			success: false,
			message: "Unable to create project."
		}, { status: 500 });
	}
}