"use client";

import {
  ChatBubble,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/chat/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "./ui/button";
import { Bot, Send, User } from "lucide-react";
import { Key, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeDisplayBlock from "./code-display-block";
import { Avatar } from "./ui/avatar";
import { ChatCompletionChunk } from "groq-sdk/resources/chat/completions.mjs";
import { streamLLM } from "@/utils/home/stream-llm";

export default function ChatSupport() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isApiKeySet, setIsApiKeySet] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      setIsApiKeySet(true);
      localStorage.setItem("groqApiKey", apiKey);
    }
  };

  useEffect(() => {
    const savedApiKey = localStorage.getItem("groqApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !isApiKeySet) return;

    setIsLoading(true);

    const newMessage = { role: "user", content: input };
    setMessages((prevMessages: any) => [...prevMessages, newMessage]);
    setInput("");

    try {
      let aiResponse = { role: "assistant", content: "" };
      setMessages((prevMessages: any) => [...prevMessages, aiResponse]);

      const stream = (await streamLLM(
        apiKey,
        messages,
        newMessage
      )) as unknown as AsyncIterable<ChatCompletionChunk>;

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        aiResponse.content += content;
        setMessages((prevMessages: string | any[]) => [
          ...prevMessages.slice(0, -1),
          { ...aiResponse },
        ]);
      }
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isLoading || !input) return;
      formRef.current?.requestSubmit();
    }
  };

  return (
    <ExpandableChat
      size="xl"
      position="bottom-right"
      className="rounded-lg bg-zinc-950 border border-zinc-800"
    >
      <ExpandableChatHeader className="bg-zinc-900 flex-col text-center justify-center p-4 rounded-t-lg">
        <h1 className="text-xl font-semibold text-zinc-100">
          Chat with our AI
        </h1>
        <p className="text-zinc-400">Ask any question for our AI to answer</p>

        {!isApiKeySet ? (
          <div className="flex gap-2 items-center pt-2">
            <input
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter Groq API Key"
              className="flex-grow bg-zinc-800 text-white placeholder:text-zinc-500 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-green focus:ring-opacity-[30%]"
            />
            <Button
              variant="secondary"
              onClick={saveApiKey}
              className="bg-emerald-400 text-zinc-900 hover:bg-emerald-500"
            >
              Save Key
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 items-center pt-2">
            <Button
              variant="secondary"
              onClick={() => setMessages([])}
              className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              New Chat
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsApiKeySet(false);
                localStorage.removeItem("groqApiKey");
              }}
              className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              Change API Key
            </Button>
          </div>
        )}
      </ExpandableChatHeader>

      <ExpandableChatBody className="bg-zinc-950 p-4 overflow-y-auto">
        <ChatMessageList ref={messagesRef} messagesLength={messages.length}>
          {isApiKeySet && (
            <ChatBubble variant="received">
              <Avatar className="bg-zinc-800 text-zinc-400 items-center justify-center">
                <Bot />
              </Avatar>
              <ChatBubbleMessage className="bg-zinc-800 text-zinc-300 rounded-lg px-4 py-2 shadow-sm">
                Hello! I'm an AI assistant. How can I help you today?
              </ChatBubbleMessage>
            </ChatBubble>
          )}
          {messages.map(
            (
              message: { role: string; content: string },
              index: Key | null | undefined
            ) => (
              <ChatBubble
                key={index}
                variant={message.role === "user" ? "sent" : "received"}
              >
                <Avatar className="bg-zinc-800 text-zinc-400 items-center justify-center">
                  {message.role === "user" ? <User /> : <Bot />}
                </Avatar>
                <ChatBubbleMessage
                  variant={message.role === "user" ? "sent" : "received"}
                  className={`${
                    message.role === "user"
                      ? "bg-emerald-400 text-zinc-100"
                      : "bg-zinc-800 text-zinc-300"
                  } rounded-lg px-4 py-2 shadow-sm`}
                >
                  {message.content
                    .split("```")
                    .map((part: string, index: number) => {
                      if (index % 2 === 0) {
                        return (
                          <Markdown key={index} remarkPlugins={[remarkGfm]}>
                            {part}
                          </Markdown>
                        );
                      } else {
                        return (
                          <pre className="pt-2" key={index}>
                            <CodeDisplayBlock code={part} lang="" />
                          </pre>
                        );
                      }
                    })}
                </ChatBubbleMessage>
              </ChatBubble>
            )
          )}
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter className="bg-zinc-900 p-3 border-t border-zinc-800 rounded-b-lg">
        <form
          ref={formRef}
          className="flex relative gap-x-2 items-center"
          onSubmit={handleSubmit}
        >
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            placeholder={
              isApiKeySet
                ? "Type your message..."
                : "Please set your Groq API key first"
            }
            disabled={!isApiKeySet}
            className="flex-grow bg-zinc-800 text-white placeholder:text-zinc-500 px-4 py-[10px] focus:outline-none focus:ring focus:ring-green focus:ring-opacity-[30%]"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input || !isApiKeySet}
            className={`p-6 rounded-lg hover:cursor-pointer bg-emerald-400 hover:bg-emerald-500`}
          >
            <Send className="size-6" />
          </Button>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}
