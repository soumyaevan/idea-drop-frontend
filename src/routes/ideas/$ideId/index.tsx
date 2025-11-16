import { deleteIdea } from "@/lib/apiFunctions";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/authStore";
import type { Idea } from "@/types";
import {
  queryOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

const fetchIdea = async (ideaId: string): Promise<Idea> => {
  // const res = await fetch(`/api/ideas/${ideaId}`);
  // if (!res.ok) throw new Error("Failed to fetch data");
  // return res.json();
  const res = await api.get(`/ideas/${ideaId}`);
  return res.data;
};

const ideaQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ["idea", ideaId],
    queryFn: () => fetchIdea(ideaId),
  });

export const Route = createFileRoute("/ideas/$ideId/")({
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `IdeaHub - ${(loaderData as Idea).title}`
          : "IdeaHub - Browse Ideas",
      },
    ],
  }),
  component: IdeaDetailPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideId));
  },
});

function IdeaDetailPage() {
  const { ideId } = Route.useParams();
  const { data } = useSuspenseQuery(ideaQueryOptions(ideId));

  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { mutateAsync: deleteMutate, isPending } = useMutation({
    mutationFn: deleteIdea,
    onSuccess: () => {
      navigate({ to: "/ideas" });
    },
  });

  const handleDelete = async () => {
    try {
      const isConfirmed = window.confirm(
        `Are you sure you want to delete "${data.title}"? This action cannot be undone.`
      );
      // Only proceed if user clicked "Yes" (OK)
      if (!isConfirmed) {
        return; // Do nothing if user clicked "No" (Cancel)
      }
      await deleteMutate(data._id);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };
  return (
    <div className="p-4">
      <Link to="/ideas" viewTransition className="text-blue-400 underline">
        Back To Ideas
      </Link>
      <h2 className="font-bold mt-4 mb-2">{data.title}</h2>
      <p className="text-sm mb-4">{data.description}</p>
      {data.tags && (
        <div className="mt-2 mb-8 flex flex-wrap gap-4">
          {data.tags.map((tag) => (
            <p
              key={tag}
              className="px-2 py-1 bg-gray-500 rounded-md font-semibold text-sm"
            >
              {tag}
            </p>
          ))}
        </div>
      )}

      {user && user.id === data.user && (
        <>
          <Link
            to="/ideas/$ideId/edit"
            viewTransition
            params={{ ideId }}
            className="px-4 py-2 mr-4 text-gray-950 font-semibold text-sm hover:bg-amber-500 bg-amber-300 rounded-lg transition"
          >
            EDIT
          </Link>
          <button
            className="p-2 text-red-600 bg-gray-800 rounded-lg font-semibold text-sm hover:text-red-400 hover:cursor-pointer"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "DELETE"}
          </button>
        </>
      )}
    </div>
  );
}
