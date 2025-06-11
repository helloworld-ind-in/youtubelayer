import DBConnect from "@/lib/DBConnect";
import EditorModel from "@/models/Editor.model";
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

		let projectDetail: any;

		switch (role) {
			case "owner": {
				projectDetail = await ProjectModel.findOne({ _id: projectId, userId });
				if (!projectDetail) {
					return Response.json({
						success: false,
						message: "Unauthorized: You don't own this project."
					}, { status: 401 });
				}
				break;
			}

			case "editor": {
				const isAssigned = await EditorModel.findOne({ projectId, editorId: userId });
				if (!isAssigned) {
					return Response.json({
						success: false,
						message: "Unauthorized: You are not assigned to this project."
					}, { status: 401 });
				}

				projectDetail = await ProjectModel.findOne({ _id: projectId });
				break;
			}

			default: {
				return Response.json({
					sucess: false,
					message: "Unauthorized: Unable to fetch project details."
				}, { status: 401 });
			}
		}

		return Response.json({
			success: true,
			message: "Project details fetched successfully.",
			data: projectDetail
		}, { status: 200 });
	} catch (error) {
		console.log("Error: Unable to fetch project details.");
		console.log(error);
		return Response.json({
			success: false,
			message: "Unable to fetch project details."
		}, { status: 500 });
	}
}