import IdeaCard from "@/components/IdeaCard";
import Pagination from "@/components/Paginations";
import fetchIdea from "@/lib/apiFunctions";
import type { Idea } from "@/types";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

// const fetchIdea = async (): Promise<Idea[]> => {
//   //   const res = await fetch(`/api/ideas`);
//   //   if (!res.ok) throw new Error("Failed to fetch data");
//   //   return res.json();
//   const res = await api.get(`/ideas`);
//   return res.data;
// };

const ideasQueryOptions = () =>
  queryOptions({
    queryKey: ["ideas"],
    queryFn: () => fetchIdea(),
  });

export const Route = createFileRoute("/ideas/")({
  head: () => ({
    meta: [{ title: "IdeaHub - Browse Ideas" }],
  }),
  component: IdeasPage,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideasQueryOptions());
  },
});

function IdeasPage() {
  //   const ideas: [] = Route.useLoaderData();
  const { data } = useSuspenseQuery(ideasQueryOptions());
  const ideasPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ideasPerPage);
  const indexOfLast = currentPage * ideasPerPage;
  const indexOfFirst = indexOfLast - ideasPerPage;
  const currentIdeas = data.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page: number) => {
    // Check if View Transitions API is supported
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setCurrentPage(page);
      });
    } else {
      // Fallback for browsers that don't support View Transitions
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4">
      <h1 className="font-bold text-4xl mb-4">Ideas</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {currentIdeas.map((idea: Idea) => (
          <IdeaCard key={idea._id} idea={idea} />
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
