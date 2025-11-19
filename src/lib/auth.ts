import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserFromToken(): Promise<{
	userId: string;
	admin: boolean;
} | null> {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("token")?.value;

		if (!token) return null;
		if (!process.env.JWT_SECRET) return null;

		const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
			userId: string;
			admin: boolean;
		};

		return decoded;
	} catch (err) {
		return null;
	}
}
