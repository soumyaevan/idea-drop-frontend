import { createIdea } from "@/lib/apiFunctions";
import { requireAuth } from "@/lib/authGuard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";

export const Route = createFileRoute("/ideas/new/")({
  beforeLoad: requireAuth,
  component: NewIdeaPage,
});

function NewIdeaPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      navigate({ to: "/ideas" });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !description.trim()) {
      alert("Please fill in all the fields");
      return;
    }
    try {
      await mutateAsync({
        title,
        summary,
        description,
        tags: Array.from(
          new Set(
            tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== "")
          )
        ),
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">New Idea Form</h1>
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
            value={tags}
            onChange={(e) => setTags(e.target.value)}
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
            {isPending ? "Creating..." : "Create Idea"}
          </button>
        </div>
      </form>
    </div>
  );
}
