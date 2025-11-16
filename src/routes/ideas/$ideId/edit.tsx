import { updateIdea } from "@/lib/apiFunctions";
import { requireAuth } from "@/lib/authGuard";
import api from "@/lib/axios";
import type { Idea } from "@/types";
import {
  queryOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";

const fetchIdea = async (ideaId: string): Promise<Idea> => {
  const res = await api.get(`/ideas/${ideaId}`);
  return res.data;
};

const ideaQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ["idea", ideaId],
    queryFn: () => fetchIdea(ideaId),
  });

export const Route = createFileRoute("/ideas/$ideId/edit")({
  beforeLoad: requireAuth,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `IdeaHub Edit - ${(loaderData as Idea).title}`
          : "IdeaHub - Edit Idea",
      },
    ],
  }),
  component: EditIdeaPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideId));
  },
});

function EditIdeaPage() {
  const { ideId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideId));
  const navigate = useNavigate();
  const [title, setTitle] = useState(idea.title);
  const [summary, setSummary] = useState(idea.summary);
  const [description, setDescription] = useState(idea.description);
  const [tagsInput, setTagsInput] = useState(idea.tags.join(", "));

  const { mutateAsync: updateIdeaAsync, isPending } = useMutation({
    mutationFn: () =>
      updateIdea(ideId, {
        title,
        summary,
        description,
        tags: Array.from(
          new Set(
            tagsInput
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== "")
          )
        ),
      }),
    onSuccess: () => {
      navigate({ to: "/ideas/$ideId", params: { ideId } });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !description.trim()) {
      alert("Please fill in all the fields");
      return;
    }
    try {
      await updateIdeaAsync();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between w-full px-2 mb-10 items-center">
        <h1 className="text-3xl font-bold">Edit Idea</h1>
        <Link
          to="/ideas/$ideId"
          params={{ ideId }}
          className=" text-blue-500 hover:text-blue-700"
        >
          ← Back To Idea
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label
            htmlFor="title"
            className="block text-gray-200 font-medium mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter idea title"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="summary"
            className="block text-gray-200 font-medium mb-1"
          >
            Summary
          </label>
          <input
            type="text"
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter idea summary"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-gray-200 font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your idea"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2"
            rows={6}
            required
          />
        </div>
        <div>
          <label
            htmlFor="tags"
            className="block text-gray-200 font-medium mb-1"
          >
            Tags (Optional)
          </label>
          <input
            type="text"
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="comma separated"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2"
          />
        </div>
        <div className="mt-5">
          <button
            type="submit"
            disabled={isPending}
            className="block w-full bg-blue-600 py-2 rounded-md hover:bg-blue-800 font-bold transition
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Updating..." : "Update Idea"}
          </button>
        </div>
      </form>
    </div>
  );
}
