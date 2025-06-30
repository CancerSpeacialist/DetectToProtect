"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Loader2,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { sendChatMessage } from "@/lib/api/chatbot";

export default function MedicalChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your AI medical assistant specialized in cancer-related questions. How can I help you today?",
      timestamp: new Date(),
      source: "system",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(inputMessage.trim());

      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: response.data.response,
          timestamp: new Date(),
          source: response.data.source || "unknown",
          is_medical: response.data.is_medical,
        };

        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
        source: "error",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: "bot",
        content:
          "Hello! I'm your AI medical assistant specialized in cancer-related questions. How can I help you today?",
        timestamp: new Date(),
        source: "system",
      },
    ]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSourceBadge = (source) => {
    const sourceConfig = {
      gemini: { label: "AI", color: "bg-blue-100 text-blue-800" },
      kb: { label: "KB", color: "bg-green-100 text-green-800" },
      system: { label: "System", color: "bg-gray-100 text-gray-800" },
      error: { label: "Error", color: "bg-red-100 text-red-800" },
    };

    const config = sourceConfig[source] || {
      label: "Unknown",
      color: "bg-gray-100 text-gray-800",
    };

    return <Badge className={`text-xs ${config.color}`}>{config.label}</Badge>;
  };

  // Floating chat button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-50 ",
        isMobile ? "bottom-4 left-4 right-4" : "bottom-6 right-6"
      )}
    >
      <Card
        className={cn(
          "shadow-xl transition-all duration-300",
          isMobile ? "w-full" : "w-96",
          isMinimized ? "h-16" : "h-[500px]"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-sm">Medical AI Assistant</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-white hover:bg-blue-700"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-white hover:bg-blue-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-[452px] p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : message.isError
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      {message.type === "bot" ? (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.type === "bot" &&
                        message.source &&
                        getSourceBadge(message.source)}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about cancer-related medical questions..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="sm"
                  className="px-3"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Specialized in cancer-related questions
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-xs"
                >
                  Clear Chat
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
