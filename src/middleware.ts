import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const token = await getToken({req: request})
	const path = request.nextUrl.pathname

	const isPublicPath = path === "/signin" || path === "/signup" ||  path === "/"

	if(isPublicPath && token) {
		return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
	}

	if(!isPublicPath && !token) {
		return NextResponse.redirect(new URL("/signin", request.nextUrl));
	}
}

export const config = {
  	matcher: [
		"/",
		"/signin",
		"/signup",
		"/dashboard",
		"/project/:path*",
	]
}