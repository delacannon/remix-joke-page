import {
  Link,
  useLoaderData,
  useParams,
  useCatch,
  LoaderFunction,
} from "remix";
import type { Joke } from "@prisma/client";
import { db } from "../../utils/db.server";

type LoaderData = { joke: Joke };

export let loader: LoaderFunction = async ({ params }) => {
  let joke = await db.joke.findUnique({
    where: { id: params.jokesId },
  });
  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }
  let data: LoaderData = { joke };
  return data;
};

export default function JokeRoute() {
  let data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name} Permalink</Link>
    </div>
  );
}

export function CatchBoundary() {
  let caught = useCatch();
  let params = useParams();
  if (caught.status === 404) {
    return (
      <div className="error-container">
        Huh? What the heck is "{params.jokesId}"?
      </div>
    );
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
  let { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}
