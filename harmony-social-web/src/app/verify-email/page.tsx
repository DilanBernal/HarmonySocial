"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import authService from "@/services/authService";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.confirmAccount({ token, email });
      if (res.success) {
        alert("¡Cuenta confirmada exitosamente!");
        router.push("/welcome");
      } else {
        alert(res.message || "No se pudo confirmar la cuenta.");
      }
    } catch (err: any) {
      alert(err?.message || "Error al confirmar la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-harmony-bg text-white">
      <div className="bg-harmony-card rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2 text-harmony-blue-light">Confirmar tu cuenta</h1>
        <p className="mb-6 text-harmony-blue-light text-center">Ingresa tu correo para confirmar tu cuenta y unirte a Harmony Social.</p>
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-harmony-bg border-2 border-harmony-blue-light rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-harmony-accent placeholder:text-harmony-blue-light"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-harmony-blue hover:bg-harmony-accent text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Confirmando..." : "Confirmar cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
