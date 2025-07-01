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
  Mic,
  MicOff,
  Volume2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { sendChatMessage } from "@/lib/api/chatbot";

export default function MedicalChatbot() {
  const getWelcomeMessage = (language) => {
    if (language === "hi") {
      return `नमस्ते! मैं आपका कैंसर जानकारी सहायक हूं। मैं आपकी निम्नलिखित विषयों में मदद कर सकता हूं:

• विभिन्न प्रकार के कैंसर
• कैंसर के लक्षण और चरण
• उपचार विकल्प (कीमोथेरेपी, रेडिएशन, सर्जरी)
• रोकथाम और जोखिम कारक
• सहायता संसाधन

आज आप कैंसर के बारे में क्या जानना चाहेंगे?`;
    }
    return `Hello! I'm your cancer information assistant. I can help you with questions about:

• Different types of cancer
• Cancer symptoms and stages  
• Treatment options (chemotherapy, radiation, surgery)
• Prevention and risk factors
• Support resources

What would you like to know about cancer today?`;
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: getWelcomeMessage("en"),
      timestamp: new Date(),
      source: "system",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Check for speech recognition support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
        };

        recognitionRef.current.onerror = (event) => {
          setIsListening(false);
          if (event.error === "no-speech") {
            toast.error(
              selectedLanguage === "hi"
                ? "कोई आवाज़ नहीं मिली। कृपया दोबारा कोशिश करें और साफ़ बोलें।"
                : "No speech detected. Please try again and speak clearly."
            );
          } else {
            toast.error(
              selectedLanguage === "hi"
                ? `आवाज़ पहचान की त्रुटि: ${event.error}`
                : `Speech recognition error: ${event.error}`
            );
          }
        };

        recognitionRef.current.onspeechend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // useEffect to update welcome message when language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].source === "system") {
      setMessages([
        {
          id: 1,
          type: "bot",
          content: getWelcomeMessage(selectedLanguage),
          timestamp: new Date(),
          source: "system",
        },
      ]);
    }
  }, [selectedLanguage]);

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
      const response = await sendChatMessage(
        inputMessage.trim(),
        selectedLanguage
      );

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

        // Text-to-speech for bot responses
        if ("speechSynthesis" in window) {
          try {
            // Stop any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(
              response.data.response
            );
            utterance.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US";
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;

            utterance.onerror = (event) => {
              console.error("Speech synthesis error:", event.error);
            };

            window.speechSynthesis.speak(utterance);
          } catch (error) {
            console.error("Text-to-speech error:", error);
          }
        }
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

  const handleVoiceInput = () => {
    if (!speechSupported) {
      toast.error(
        selectedLanguage === "hi"
          ? "इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है"
          : "Speech recognition not supported in this browser"
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInputMessage("");
      setCharCount(0); // Reset character count
      recognitionRef.current.lang =
        selectedLanguage === "hi" ? "hi-IN" : "en-US";
      recognitionRef.current?.start();
      setIsListening(true);
      toast.info(
        selectedLanguage === "hi"
          ? "सुन रहा हूं... अब बोलें"
          : "Listening... Speak now"
      );
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: "bot",
        content: getWelcomeMessage(selectedLanguage),
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
      gemini: {
        label: "Gemini AI",
        color: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
        icon: "🤖",
      },
      kb: {
        label: "Knowledge Base",
        color: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
        icon: "📚",
      },
      system: {
        label: "System",
        color: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
        icon: "⚙️",
      },
      error: {
        label: "Error",
        color: "bg-gradient-to-r from-red-500 to-red-600 text-white",
        icon: "⚠️",
      },
    };

    const config = sourceConfig[source] || sourceConfig.system;

    return (
      <Badge className={`text-xs px-2 py-1 ${config.color} border-0`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </Badge>
    );
  };

  // Floating chat button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <MessageCircle className="h-7 w-7" />
          </Button>

          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            🏥 Cancer Information Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-50",
        isMobile ? "bottom-4 left-4 right-4" : "bottom-6 right-6"
      )}
    >
      <Card
        className={cn(
          "shadow-2xl transition-all duration-300 border-0 overflow-hidden backdrop-blur-sm bg-white/95",
          isMobile ? "w-full" : "w-96",
          isMinimized ? "h-16" : "h-[600px]"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-5 w-5" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <CardTitle className="text-sm">
                🏥 Cancer Information Assistant
              </CardTitle>
              <p className="text-xs text-blue-100">
                Your specialized cancer guide
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-white hover:bg-blue-700 rounded-full transition-colors"
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
              className="h-8 w-8 p-0 text-white hover:bg-blue-700 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-[552px] p-0">
            {/* Medical Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 m-4 mb-2">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                <p className="text-xs text-yellow-700">
                  ⚠️{" "}
                  {selectedLanguage === "hi"
                    ? "यह चैटबॉट केवल शैक्षिक जानकारी प्रदान करता है। चिकित्सा सलाह के लिए हमेशा स्वास्थ्य पेशेवरों से सलाह लें।"
                    : "This chatbot provides educational information only. Always consult healthcare professionals for medical advice."}
                </p>
              </div>
            </div>

            {/* Language and Controls */}
            <div className="flex items-center justify-between px-4 pb-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-xs border rounded px-2 py-1 bg-white"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>

              <div className="flex items-center gap-2">
                {speechSupported && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    🎤{" "}
                    {selectedLanguage === "hi"
                      ? "आवाज़ सक्षम"
                      : "Voice Enabled"}
                  </Badge>
                )}
              </div>
            </div>

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
                    className={`max-w-[80%] rounded-lg p-3 transition-all duration-200 ${
                      message.type === "user"
                        ? "bg-blue-600 text-white shadow-md"
                        : message.isError
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-gray-100 text-gray-800 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      {message.type === "bot" ? (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-line">
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
                  <div className="bg-gray-100 rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                      <span className="text-sm">
                        {selectedLanguage === "hi"
                          ? "AI सोच रहा है..."
                          : "AI is thinking..."}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isListening && (
                <div className="flex justify-center">
                  <div className="bg-red-100 border border-red-300 rounded-lg p-2">
                    <div className="flex items-center gap-2 text-red-700">
                      <Mic className="h-4 w-4 animate-pulse" />
                      <span className="text-sm">
                        {selectedLanguage === "hi"
                          ? "सुन रहा हूं..."
                          : "Listening..."}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                {speechSupported && (
                  <Button
                    onClick={handleVoiceInput}
                    disabled={isLoading}
                    size="sm"
                    variant={isListening ? "destructive" : "outline"}
                    className="px-3"
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                )}

                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    setCharCount(e.target.value.length);
                  }}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    selectedLanguage === "hi"
                      ? "मुझसे कैंसर के बारे में पूछें..."
                      : "Ask me about cancer..."
                  }
                  className="flex-1"
                  disabled={isLoading || isListening}
                  maxLength={500}
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || isListening}
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
                  {selectedLanguage === "hi"
                    ? "कैंसर संबंधी प्रश्नों में विशेषज्ञ"
                    : "Specialized in cancer-related questions"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{charCount}/500</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-xs"
                  >
                    {selectedLanguage === "hi" ? "चैट साफ़ करें" : "Clear Chat"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
