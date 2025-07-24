import DBConnect from "@/lib/DBConnect";
import UserModel from "@/models/User.model";
import { OAuth2Client } from "google-auth-library";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  const searchParams = request.nextUrl.searchParams;
  let state = searchParams.get('state');
  if(state == null) {
    state = btoa("/dashboard")
  }

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

    const code: string | null = request.nextUrl.searchParams.get("code");

    const oAuth2Client = new OAuth2Client(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      process.env.OAUTH_REDIRECT_URI
    );

    if (code != null) {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      const user = await UserModel.findOne({ _id: userId, role: "owner" });
      if (!user) {
        return Response.json({
          sucess: false,
          message: "Unauthorized: You are not authorized to login to YouTube."
        }, { status: 401 });
      }

      user.token = JSON.stringify(tokens);
      await user.save();
    }

    return NextResponse.redirect(new URL(atob(state), request.url));
  } catch (error) {
    console.log("Error: Unable to save YouTube login tokens.");
    console.log(error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}