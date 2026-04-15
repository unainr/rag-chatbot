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
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputActionAddAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Fragment, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { GlobeIcon, DatabaseIcon } from "lucide-react";
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
    <div className="max-w-6xl mx-auto relative w-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        <Conversation className="flex-1 overflow-auto">
          <ConversationContent className="overflow-hidden">
            {messages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  // 👇 Log this temporarily if you still get errors
                  // console.log("PART TYPE:", part.type, part);

                  switch (part.type) {

                    // ✅ Normal text message
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

                    // ✅ AI SDK v5 — tool call part
                    case "tool-invocation": {
                      const invocation = (part as any).toolInvocation;
                      const toolName: string = invocation?.toolName ?? "";
                      const args = invocation?.args ?? {};
                      const state: string = invocation?.state ?? "";

                      if (toolName !== "searchKnowledgeBase") return null;

                      const isDone = state === "result";

                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <div className="flex items-center gap-2 px-4 py-2 my-1 text-sm text-muted-foreground bg-muted/40 rounded-lg w-fit">
                            <DatabaseIcon
                              size={14}
                              className={`shrink-0 ${!isDone ? "animate-pulse" : "text-green-500"}`}
                            />
                            {!isDone ? (
                              <span className="flex items-center gap-1.5">
                                <span className="animate-pulse">
                                  Searching knowledge base
                                </span>
                                {args?.query && (
                                  <span className="font-medium text-foreground">
                                    &quot;{args.query}&quot;
                                  </span>
                                )}
                                <span className="animate-pulse">…</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <span>Knowledge base searched</span>
                                {args?.query && (
                                  <span className="font-medium text-foreground">
                                    &quot;{args.query}&quot;
                                  </span>
                                )}
                                <span className="text-green-500">✓</span>
                              </span>
                            )}
                          </div>
                        </Fragment>
                      );
                    }

                    default:
                      return null;
                  }
                })}
              </div>
            ))}

            {(status === "submitted" || status === "streaming") && <Loader />}
            <div ref={bottomRef} />
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
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton>
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

export default RagChatBot;