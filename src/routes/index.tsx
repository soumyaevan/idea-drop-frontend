import IdeaCard from "@/components/IdeaCard";
import fetchIdea from "@/lib/apiFunctions";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";

const ideaQueryOptions = () =>
  queryOptions({
    queryKey: ["ideas", { limit: 3 }],
    queryFn: () => fetchIdea(3),
  });

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(ideaQueryOptions()),
});

function HomePage() {
  const { data } = useSuspenseQuery(ideaQueryOptions());

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
        <h2 className="text-2xl font-bold">Latest Ideas</h2>
        <ul className="grid grid-cols-1 gap-3">
          {data.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} button={false} />
          ))}
        </ul>
        <Link
          to="/ideas"
          viewTransition
          className="mt-2 w-full bg-blue-600 text-center py-2 rounded-lg font-semibold hover:bg-blue-800"
        >
          View All Ideas
        </Link>
      </div>
    </div>
  );
}
