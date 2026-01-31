import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { generateEmbeddig } from "./embedding";
import { documents } from "@/drizzle/schema";
import { db } from "@/drizzle/db";

interface SearchProps {
	query: string;
	limit: number;
	threshold: number;
}
export const SearchDocuments = async ({
	query,
	limit = 5,
	threshold = 0.5,
}: SearchProps) => {
	const embedding = await generateEmbeddig(query);

	const similarity = sql<number>`1 - (${cosineDistance(documents.embedding, embedding)})`;

	const similarDocuments = await db
		.select({ id: documents.id, content: documents.content, similarity })
		.from(documents)
		.where(gt(similarity, threshold))
		.orderBy(desc(similarity))
		.limit(limit);

	return similarDocuments;
};
