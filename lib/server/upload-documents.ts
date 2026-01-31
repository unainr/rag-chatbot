"use server";
import { error } from "console";
import pdf from "pdf-parse";
import { chunkContent } from "../chunking";
import { generateEmbeddig, generateEmbeddings } from "../embedding";
import { db } from "@/drizzle/db";
import { documents } from "@/drizzle/schema";
import { sanitizeString } from "../utils";
export const processPdfFile = async (formData: FormData) => {
	try {
		const file = formData.get("pdf") as File;
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const data = await pdf(buffer);
		if (!data.text || data.text.length === 0) {
			return {
				success: false,
				error: "No text found in PDF",
			};
		}
		// Sanitize PDF text to remove NULL bytes
    const cleanText = sanitizeString(data.text); //TODO: clean the text to replace data.text
		const chunks = await chunkContent(cleanText);
		const embeddings = await generateEmbeddings(chunks);
		const records = chunks.map((chunk, index) => ({
			content: chunk,
			embedding: embeddings[index],
		}));

		await db.insert(documents).values(records);
		console.log(records)
		return {
			success: true,
			message: `created ${records.length} searchable chunks`,
		};
	} catch (error) {
		console.log("pdf processing error",error);
	}
};
