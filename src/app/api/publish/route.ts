import { NextRequest, NextResponse } from "next/server";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { getToken } from "next-auth/jwt";
import DBConnect from "@/lib/DBConnect";
import UserModel from "@/models/User.model";
import ProjectModel from "@/models/Project.model";
import UploadModel from "@/models/Upload.model";
import path, { extname } from "path";
import { existsSync, readFileSync } from "fs";

export async function POST(request: NextRequest) {
	const token = await getToken({ req: request });

	if (!token) {
		return Response.json({
			sucess: false,
			message: "Unauthorized: You need to login."
		}, { status: 401 });
	}

	const role = token.role;
	const userId = token.username;
	const { videoId, projectId, title, description, tags, privacy } = await request.json();

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

			default: {
				return Response.json({
					sucess: false,
					message: "Unauthorized: You are not authorized to publish video to YouTube."
				}, { status: 401 });
			}
		}

		const upload = await UploadModel.findOne({ _id: videoId, projectId });
		if (!upload) {
			return Response.json({
				sucess: false,
				message: "Video file does not exists."
			}, { status: 404 });
		}

		const KEY = `${upload._id}${extname(upload.name)}`;

		const tokenPath = path.resolve(`${"src/oauthTokens/tokens_" + userId + ".json"}`);

		if (!existsSync(tokenPath)) {
			return NextResponse.json({
				success: false,
				message: "You need to login to your Google account first.",
			}, { status: 401 });
		}

		const OAUTH_CREDENTIALS = JSON.parse(readFileSync(tokenPath, 'utf8'));

		const ecsClient = new ECSClient({
			region: process.env.AWS_REGION as string,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY as string,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
			},
		});

		const runTaskCommand = new RunTaskCommand({
			taskDefinition: process.env.AWS_TASK_DEFINITION as string,
			cluster: process.env.AWS_CLUSTER as string,
			launchType: "FARGATE",
			networkConfiguration: {
				awsvpcConfiguration: {
					assignPublicIp: "ENABLED",
					securityGroups: [process.env.AWS_SECURITY_GROUP as string],
					subnets: [
						process.env.AWS_SUBNET_1 as string,
						process.env.AWS_SUBNET_2 as string,
						process.env.AWS_SUBNET_3 as string
					]
				}
			},
			overrides: {
				containerOverrides: [{
					name: process.env.AWS_CONTAINER_NAME as string,
					environment: [
						{ name: "AWS_KEY", value: KEY },

						{ name: "YT_TITLE", value: title },
						{ name: "YT_DESCRIPTION", value: description },
						{ name: "YT_TAGS", value: tags },
						{ name: "YT_PRIVACY", value: privacy },

						{ name: "OAUTH_ACCESS_TOKEN", value: `${OAUTH_CREDENTIALS.access_token}` },
						{ name: "OAUTH_REFRESH_TOKEN", value: `${OAUTH_CREDENTIALS.refresh_token}` },
						{ name: "OAUTH_SCOPE", value: `${OAUTH_CREDENTIALS.scope}` },
						{ name: "OAUTH_TOKEN_TYPE", value: `${OAUTH_CREDENTIALS.token_type}` },
						{ name: "OAUTH_REFRESH_TOKEN_EXPIRES_IN", value: `${OAUTH_CREDENTIALS.refresh_token_expires_in}` },
						{ name: "OAUTH_EXPIRY_DATE", value: `${OAUTH_CREDENTIALS.expiry_date}` },
					]
				}]
			}
		});

		await ecsClient.send(runTaskCommand);

		return Response.json({
			success: true,
			message: "Video publishing to YouTube started. Once completed you will be notified.",
		}, { status: 200 });
	} catch (error) {
		console.log("Error: Unable to publish video to YouTube.");
		console.log(error);
		return Response.json({
			success: false,
			message: "Unable to publish video to YouTube"
		}, { status: 500 });
	}
}