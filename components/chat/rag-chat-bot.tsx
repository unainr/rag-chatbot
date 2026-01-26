"use client";
import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
	Message,
	MessageContent,
	MessageResponse,
	MessageActions,
	MessageAction,
} from "@/components/ai-elements/message";

import {
	PromptInput,
	PromptInputActionAddAttachments,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputBody,
	PromptInputButton,
	PromptInputHeader,
	type PromptInputMessage,
	PromptInputSelect,
	PromptInputSelectContent,
	PromptInputSelectItem,
	PromptInputSelectTrigger,
	PromptInputSelectValue,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputFooter,
	PromptInputTools,
	usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { Fragment, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { CopyIcon, GlobeIcon, RefreshCcwIcon } from "lucide-react";
import {
	Source,
	Sources,
	SourcesContent,
	SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";

const RagChatBot = () => {
        const [input, setInput] = useState("");
        const { messages, sendMessage, status } = useChat();
        const bottomRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, status]);

        const handleSubmit = (message: PromptInputMessage) => {
		if (!message.text) return;
		sendMessage({ text: message.text });
		setInput("");
	};
	return (
  <div className="max-w-6xl mx-auto relative w-full  h-[calc(100vh-4rem)]">
  <div className="flex flex-col h-full">
    <Conversation className="flex-1 overflow-auto">
      <ConversationContent className="overflow-hidden">
        {messages.map((message) => (
          <div key={message.id}>
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return (
                    <Fragment key={`${message.id}-${i}`}>
                      <Message from={message.role}>
                        <MessageContent>
                          <MessageResponse>{part.text}</MessageResponse>
                        </MessageContent>
                      </Message>
                    </Fragment>
                  );
                default:
                  return null;
              }
            })}
          </div>
        ))}
        {(status === "submitted" || status === "streaming") && <Loader />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
    <PromptInput onSubmit={handleSubmit} className="shrink-0 mt-5">
      <PromptInputBody>
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </PromptInputBody>
      <PromptInputSubmit disabled={!input && !status} status={status} />
    </PromptInput>
  </div>
</div>
	);
};
export default RagChatBot;
