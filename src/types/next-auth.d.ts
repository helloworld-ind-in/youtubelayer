import "next-auth";

declare module "next-auth" {
	interface User {
		_id?: string;
		isVerified?: boolean;
		email?: string;
		username?: string;
		role?: string;
	}

	interface Session {
		user: {
			username?: string;
			isVerified?: boolean;
			email?: string;
			role?: string;
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		username?: string;
		isVerified?: boolean;
		email?: string;
		role?: string;
	}
}