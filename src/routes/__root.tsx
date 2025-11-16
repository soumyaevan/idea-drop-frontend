import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Link,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { refreshAccessToken } from "@/api/auth";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Share explore and build new ideas",
      },
      { title: "IdeaDrop - Your Idea Hub" },
    ],
  }),
  component: RootLayout,
  notFoundComponent: notFound,
});
function RootLayout() {
  const { setAccessToken, setUser, clearAuth } = useAuthStore();
  useEffect(() => {
    const { user } = useAuthStore.getState();
    if (user) {
      refreshAccessToken()
        .then((data) => {
          setAccessToken(data.accessToken);
          setUser(data.user);
        })
        .catch((error) => {
          console.error("Session expired or invalid:", error);
          clearAuth();
        });
    }
  }, []);
  return (
    <div
      className="min-h-screen
      bg-[linear-gradient(129deg,rgba(33,29,29,1)_0%,rgba(160,163,160,1)_100%,rgba(46,42,42,0.84)_100%,rgba(255,255,255,1)_53%)]
      text-white flex flex-col"
    >
      <HeadContent />
      <Header />
      <main className="flex justify-center p-6">
        <div className="w-full max-w-4xl rounded-2xl shadow-lg p-8 bg-[#212222]">
          <Outlet />
        </div>
      </main>

      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </div>
  );
}
function notFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold mb-8">404</h1>
      <p className="text-gray-200 mb-8 font-semibold text-center">
        Oops! The page you are looking for is not found !!!
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-800 transition font-semibold"
      >
        Go To Home
      </Link>
    </div>
  );
}
