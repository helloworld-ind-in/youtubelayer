import DBConnect from "@/lib/DBConnect";
import UserModel from "@/models/User.model";
import { existsSync, readFileSync } from "fs";
import { OAuth2Client } from "google-auth-library";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

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

  await DBConnect();

  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return Response.json({
        success: false,
        message: "Unauthorized: User doesn't exist."
      }, { status: 401 });
    }

    if (role != "owner") {
      return Response.json({
        sucess: false,
        message: "Unauthorized: You are not authorized to login to YouTube."
      }, { status: 401 });
    }

    const oAuth2Client = new OAuth2Client(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      process.env.OAUTH_REDIRECT_URI
    );

    if (user.token != null) {
      const tokens = JSON.parse(user.token);
      oAuth2Client.setCredentials(tokens);

      return NextResponse.json({
        success: true,
        message: "You are already logged in to YouTube.",
      }, { status: 200 });
    }

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ['https://www.googleapis.com/auth/youtube.upload']
    });

    return NextResponse.json({
      success: true,
      message: "Google auth url genrated successfully.",
      data: {
        authUrl: authUrl
      }
    }, { status: 201 });
  } catch (error) {
    console.log("Error: Unable to login to YouTube.");
    console.log(error);
    return Response.json({
      success: false,
      message: "Unable to login to YouTube"
    }, { status: 500 });
  }
}