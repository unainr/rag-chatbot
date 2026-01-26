"use server";

import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export const createChat = async (messages: UIMessage[]) => {
	try {
		const modelMessages = await convertToModelMessages(messages);

		const result = streamText({
			model: google("gemini-2.5-flash-lite"),
			messages: modelMessages,
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.log(error);
	}
};
