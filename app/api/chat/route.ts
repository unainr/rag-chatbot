import { createChat } from "@/lib/server/chat.actions";
import { UIMessage } from "ai";

export async function POST(req: Request) {
	const { messages }: { messages: UIMessage[] } = await req.json();
	return createChat(messages);
}
