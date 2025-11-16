import type { Idea } from "@/types";
import { Link } from "@tanstack/react-router";

const btnClass =
  "text-center mt-4 inline-block bg-gray-800 hover:bg-gray-900 py-2 rounded font-semibold text-gray-200 hover:text-blue-400 transition";
const linkClass = "text-blue-500 hover:text-blue-300 mt-2";

const IdeaCard = ({
  idea,
  button = true,
}: {
  idea: Idea;
  button?: boolean;
}) => {
  return (
    <li
      key={idea._id}
      className="border border-gray-200 rounded shadow p-4 bg-gray-700 flex flex-col justify-between"
    >
      <div>
        <h2 className="text-lg font-semibold">{idea.title}</h2>
        <p className="text-gray-400 mt-2">{idea.summary}</p>
      </div>
      <Link
        to="/ideas/$ideId"
        viewTransition
        params={{ ideId: idea._id.toString() }}
        className={button ? btnClass : linkClass}
      >
        {button ? "View Idea" : "Read More →"}
      </Link>
    </li>
  );
};

export default IdeaCard;
