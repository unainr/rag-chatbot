import {
	pgTable,
	text,
	timestamp,
	uuid,
	vector,
	index,
	varchar,
} from "drizzle-orm/pg-core";

export const documents  = pgTable(
	"documents",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		 userId: varchar('user_id', { length: 255 }).notNull(),
		content: text("content").notNull(),
		embedding: vector("embedding", { dimensions: 3072  }),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [
		index("embeddingIndex").using(
			"hnsw",
			table.embedding.op("vector_cosine_ops"),
		),
	],
);

export type InsertDocument = typeof documents.$inferInsert;
export type SelectDocument = typeof documents.$inferSelect;
