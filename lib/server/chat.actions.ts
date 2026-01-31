"use server";

import { google } from "@ai-sdk/google";
import {
	convertToModelMessages,
	streamText,
	tool,
	UIMessage,
	InferUITools,
	UIDataTypes,
	stepCountIs,
} from "ai";
import { z } from "zod";
import { SearchDocuments } from "../search";
const tools = {
	searchKnowledgeBase: tool({
		description: "Search the knowledge base for relevant information",
		inputSchema: z.object({
			query: z.string().describe("The search query to find relevant documents"),
		}),
		execute: async ({ query }) => {
			try {
				const results = await SearchDocuments({
					query,
					limit: 3,
					threshold: 0.5,
				});
				if (results.length === 0) {
					return "No relevant information found in the knowledge base";
				}
				const formattedResults = results
					.map((r, i) => `[${i + i}] ${r.content}`)
					.join("\n\n");
				return formattedResults;
			} catch (error) {
				console.error("Search error:", error);
				return "Error searching the knowledge base";
			}
		},
	}),
};

export type ChatTools = InferUITools<typeof tools>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;
export const createChat = async (messages: UIMessage[]) => {
	try {
		const modelMessages = await convertToModelMessages(messages);

		const result = streamText({
			model: google("gemini-flash-latest"),
			messages: modelMessages,
			tools,
			system: `You are a helpful assistant with access to a knowledge base. 
          When users ask questions, search the knowledge base for relevant information.
          Always search before answering if the question might relate to uploaded documents.
          Base your answers on the search results when available. Give concise answers that correctly answer what the user is asking for. Do not flood them with all the information from the search results.`,
			stopWhen: stepCountIs(2),
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.log(error);
	}
};
