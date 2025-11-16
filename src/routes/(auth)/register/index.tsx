import { registerUser } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  // const queryClient = useQueryClient();
  const { setAccessToken, setUser } = useAuthStore();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ["ideas"] });
      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate({ to: "/ideas" });
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({ name, email, password });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className="bg-gray-700 px-4 pt-4 pb-8 rounded-md">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-sm border border-white px-2 py-2"
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-sm border border-white px-2 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-sm border border-white px-2 py-2"
        />
        <button
          type="submit"
          className="w-full bg-amber-600 py-2 rounded-md font-semibold cursor-pointer
          hover:bg-amber-700 transition disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="text-sm text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-500 font-bold hover:text-blue-400 transition"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
