import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";

export const generateEmbeddig = async (text: string) => {
	const input = text.replace(/\s+/g, " ");

	const { embedding } = await embed({
		model: google.embedding("text-embedding-004"),
		value: input,
	});

	return embedding;
};

export const generateEmbeddings = async (text: string[]) => {
	const inputs = text.map((text) => text.replace(/\s+/g, " "));

	const { embeddings } = await embedMany({
		model: google.embedding("text-embedding-004"),
		values: inputs,
	});
	return embeddings;
};
