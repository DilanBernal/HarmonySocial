import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4200/api";

export async function confirmAccount({ token, email }: { token: string; email: string }) {
	try {
		const response = await axios.post(`${API_URL}/users/verify-email`, { token: token,email: email });
		return { success: true, message: response.data?.message };
	} catch (error: unknown) {
		const msg = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
		return {
	 		success: false,
	 		message: typeof msg === 'string' ? msg : "Error al confirmar la cuenta."
	 	};
	}
}

const authService = { confirmAccount };
export default authService;
