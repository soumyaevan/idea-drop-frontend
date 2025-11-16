import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex flex-col sm:flex-row justify-start p-4 gap-4">
      <div className="flex flex-col justify-start gap-6 w-full">
        <Lightbulb className="w-12 h-12 text-yellow-500" />
        <h1 className="text-4xl font-bold">Welcome to IdeaDrop</h1>
        <p className="text-gray-200">
          Share, explore, and build on the best technology stack and their
          learning path
        </p>
      </div>
      <div className="flex flex-col justify-between gap-6 w-full">
        <Outlet />
      </div>
    </div>
  );
}
