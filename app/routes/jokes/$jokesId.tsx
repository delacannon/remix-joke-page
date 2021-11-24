import type { LoaderFunction } from "remix";
import { Link, useLoaderData } from "remix";
import type { Joke } from "@prisma/client";
import { db } from "../../utils/db.server";

type LoaderData = { joke: Joke };

export let loader: LoaderFunction = async ({ params }) => {
	console.log(params);
	let joke = await db.joke.findUnique({
		where: { id: params.jokesId },
	});
	if (!joke) {
		throw new Response("What a joke! Not found.", { status: 404 });
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
