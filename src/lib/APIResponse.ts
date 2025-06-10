import { APIResponse } from "@/types/APIResponse";
import { NextResponse } from "next/server";

export default function ReturnAPIResponse(statusCode: number, apiResponse: APIResponse) {
	return NextResponse.json(
		apiResponse,
		{ status: statusCode }
	);
}