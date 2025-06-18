import { SendVerificationEmail } from "@/lib/resend/SendVerificationEmail";
import DBConnect from "@/lib/DBConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
	await DBConnect();

	try {
		const { email, password, role } = await request.json();

		const existingUser = await UserModel.findOne({
			email,
			isVerified: true
		});

		if (existingUser) {
			return Response.json({
				success: true,
				message: "User already exists with this email."
			}, { status: 400 });
		}

		const existingUserByEmail = await UserModel.findOne({ email });

		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
		const verificationCodeExpiry = new Date(Date.now() + 3600000);
		const token = null;

		let newSavedUser;

		if (existingUserByEmail) {
			existingUserByEmail.password = hashedPassword;
			existingUserByEmail.verificationCode = verificationCode;
			existingUserByEmail.verificationCodeExpiry = verificationCodeExpiry;

			newSavedUser = await existingUserByEmail.save();
		} else {
			const newUser = new UserModel({
				email,
				password: hashedPassword,
				role,
				verificationCode,
				verificationCodeExpiry,
				isVerified: true,
				token
			});

			newSavedUser = await newUser.save();
		}

		const emailResponse = await SendVerificationEmail(email, verificationCode);

		if (!emailResponse.success) {
			return Response.json({
				success: false,
				message: emailResponse.message
			}, { status: 500 });
		}

		return Response.json({
			success: true,
			message: "User registration successful. Please verify your email.",
			data: { newSavedUser }
		}, { status: 201 });
	} catch (error) {
		const errorMessage = "Error in registering user."
		console.log("Internal Server Error: ", errorMessage);
		console.log(error);
		return Response.json({
			success: false,
			message: errorMessage
		}, { status: 500 });
	}
}