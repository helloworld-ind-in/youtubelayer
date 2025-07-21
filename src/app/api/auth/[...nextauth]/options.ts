import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import DBConnect from "@/lib/DBConnect";
import UserModel from "@/models/User.model";

export interface credentialsInterface {
	identifier: string,
	password: string
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials: any): Promise<any> {
				await DBConnect();

				console.log(credentials)

				try {
					const user = await UserModel.findOne({ email: credentials.identifier.toLowerCase() });

					if (!user) {
						throw new Error("No user found with this email.");
					}

					if (!user.isVerified) {
						throw new Error("Please verify your account befor login.");
					}

					const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

					if (isPasswordCorrect) {
						return user;
					} else {
						throw new Error("Incorrect Password");
					}

				} catch (err: unknown) {
					if (err instanceof Error) {
						throw new Error(err.message);
					}
					throw new Error("Authorization error");
				}
			}
		})
	],

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.username = user._id?.toString();
				token.email = user.email;
				token.isVerified = user.isVerified;
				token.role = user.role;
			}
			return token
		},

		async session({ session, token }) {
			if (token) {
				session.user.username = token.username?.toString();
				session.user.isVerified = token.isVerified;
				session.user.email = token.email;
				session.user.role = token.role;
			}
			return session
		},
	},

	pages: {
		signIn: '/signin'
	},

	session: {
		strategy: "jwt"
	},

	secret: process.env.NEXTAUTH_SECRET,
}