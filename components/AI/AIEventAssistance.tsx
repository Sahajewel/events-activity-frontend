/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Loader2,
  Bot,
  User,
  Zap,
} from "lucide-react";

export default function AIEventAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm your AI event assistant. Ask me anything about finding events, getting recommendations, or event details!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulated event data - Replace with real API call
  const eventData = {
    categories: ["Music", "Sports", "Technology", "Food", "Arts", "Outdoor"],
    upcomingEvents: [
      {
        name: "Tech Summit 2025",
        category: "Technology",
        date: "Jan 15",
        price: "Free",
      },
      { name: "Jazz Night", category: "Music", date: "Jan 18", price: "$25" },
      { name: "Food Festival", category: "Food", date: "Jan 20", price: "$10" },
      {
        name: "Marathon Run",
        category: "Sports",
        date: "Jan 22",
        price: "Free",
      },
    ],
    totalEvents: 500,
    cities: ["Tokyo", "New York", "London", "Mumbai", "Sydney"],
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dynamic response generator
  const generateDynamicResponse = (userQuestion: any) => {
    const lowerQ = userQuestion.toLowerCase();

    // Event recommendations
    if (
      lowerQ.includes("recommend") ||
      lowerQ.includes("suggest") ||
      lowerQ.includes("what event")
    ) {
      const randomEvents = eventData.upcomingEvents
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      return `Great question! 🎉 Here are some awesome events I'd recommend:\n\n${randomEvents
        .map(
          (e, i) =>
            `${i + 1}. **${e.name}** (${e.category})\n   📅 ${e.date} | 💰 ${
              e.price
            }`
        )
        .join(
          "\n\n"
        )}\n\nWant to explore more? Just search by category or location!`;
    }

    // Weekend events
    if (lowerQ.includes("weekend") || lowerQ.includes("this week")) {
      const weekendEvents = eventData.upcomingEvents.slice(0, 2);
      return `This weekend is packed! 🔥\n\n${weekendEvents
        .map((e, i) => `• ${e.name} - ${e.date} (${e.price})`)
        .join("\n")}\n\nBook fast, spots are filling up! 🚀`;
    }

    // Category-specific
    const categoryMatch = eventData.categories.find((cat) =>
      lowerQ.includes(cat.toLowerCase())
    );
    if (categoryMatch) {
      const catEvents = eventData.upcomingEvents.filter(
        (e) => e.category === categoryMatch
      );
      if (catEvents.length > 0) {
        return `Found some great ${categoryMatch} events! 🎯\n\n${catEvents
          .map((e) => `• ${e.name} - ${e.date} (${e.price})`)
          .join(
            "\n"
          )}\n\nClick "Explore Events" to see all ${categoryMatch} options!`;
      }
    }

    // Free events
    if (lowerQ.includes("free")) {
      const freeEvents = eventData.upcomingEvents.filter(
        (e) => e.price === "Free"
      );
      return `Yes! We have ${freeEvents.length} free events: 🎁\n\n${freeEvents
        .map((e) => `• ${e.name} - ${e.date}`)
        .join("\n")}\n\nZero cost, maximum fun! 🎉`;
    }

    // Location/Near me
    if (
      lowerQ.includes("near") ||
      lowerQ.includes("location") ||
      lowerQ.includes("city")
    ) {
      return `We have events in ${eventData.cities
        .slice(0, 3)
        .join(
          ", "
        )} and more! 📍\n\nUse our location filter to find events near you. Most events are in Tokyo right now! 🗾`;
    }

    // How to book
    if (
      lowerQ.includes("book") ||
      lowerQ.includes("register") ||
      lowerQ.includes("join")
    ) {
      return `Booking is super easy! 🎫\n\n1. Browse events on our platform\n2. Click on any event you like\n3. Hit "Book Now" button\n4. Confirm your spot!\n\nYou'll get instant confirmation. Simple! ✨`;
    }

    // Pricing
    if (
      lowerQ.includes("price") ||
      lowerQ.includes("cost") ||
      lowerQ.includes("fee")
    ) {
      return `Event prices vary! 💰\n\n• Free events: Yes, we have many!\n• Paid events: $5 - $50 typically\n• Premium: $50+\n\nMost events are affordable and worth it! Filter by price to find what fits your budget. 💸`;
    }

    // Popular/trending
    if (
      lowerQ.includes("popular") ||
      lowerQ.includes("trending") ||
      lowerQ.includes("hot")
    ) {
      return `Hottest events right now: 🔥\n\n1. **Tech Summit 2025** - Almost full!\n2. **Jazz Night** - 90% booked\n3. **Food Festival** - Trending #1\n\nDon't miss out, book ASAP! ⚡`;
    }

    // General help
    if (lowerQ.includes("help") || lowerQ.includes("how")) {
      return `I'm here to help! 🤝 I can:\n\n• Recommend events based on your interests\n• Find events by category or location\n• Show free events\n• Help with booking questions\n• Suggest trending events\n\nWhat would you like to know? 🎯`;
    }

    // Default friendly response
    const responses = [
      `I'd love to help! 😊 We have ${eventData.totalEvents}+ events across ${eventData.categories.length} categories. What type of events interest you?`,
      `Great question! 🎉 Try asking me about specific categories like Music, Tech, Sports, or Food events. I can also help you find free events or events this weekend!`,
      `Looking for something fun? 🌟 I can suggest events based on your interests. Just tell me what you're into - music, sports, tech, food, or outdoor activities!`,
      `Awesome! 🚀 I can help you discover events. Want recommendations? Looking for something specific? Or maybe events near you?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI thinking delay
    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 700)
    );

    try {
      // Check if we should use dynamic response or AI
      const shouldUseDynamic =
        userMessage.toLowerCase().includes("event") ||
        userMessage.toLowerCase().includes("recommend") ||
        userMessage.toLowerCase().includes("suggest") ||
        userMessage.toLowerCase().includes("free") ||
        userMessage.toLowerCase().includes("weekend") ||
        userMessage.toLowerCase().includes("book") ||
        userMessage.toLowerCase().includes("music") ||
        userMessage.toLowerCase().includes("tech") ||
        userMessage.toLowerCase().includes("sport") ||
        userMessage.toLowerCase().includes("food");

      let aiResponse;

      if (shouldUseDynamic) {
        // Use dynamic local response
        aiResponse = generateDynamicResponse(userMessage);
      } else {
        // Use Claude API for complex queries
        try {
          const response = await fetch(
            "https://api.anthropic.com/v1/messages",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1000,
                messages: [
                  {
                    role: "user",
                    content: `You are an AI assistant for an event discovery platform with ${
                      eventData.totalEvents
                    }+ events. Available categories: ${eventData.categories.join(
                      ", "
                    )}. Keep response friendly, brief (2-3 sentences), and helpful.

User question: ${userMessage}

If they ask about events, recommend checking our platform. Be enthusiastic and helpful!`,
                  },
                ],
              }),
            }
          );

          const data = await response.json();
          aiResponse = data.content[0].text;
        } catch (apiError) {
          // Fallback to dynamic response if API fails
          aiResponse = generateDynamicResponse(userMessage);
        }
      }

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Oops! Something went wrong. 😅 But don't worry - try asking about events, categories, or what's happening this weekend!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickQuestions = [
    "🎵 Music events this weekend?",
    "💻 Any tech meetups?",
    "🎁 Show me free events",
    "🔥 What's trending?",
  ];

  const handleQuickQuestion = (question: any) => {
    // Remove emoji and set
    setInput(question.replace(/[^\w\s?]/g, "").trim());
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="h-7 w-7" />
        ) : (
          <>
            <MessageCircle className="h-7 w-7 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full">
              <Zap className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm relative">
                <Bot className="h-6 w-6" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Event Assistant</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Smart & Lightning Fast
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 animate-fadeIn ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user"
                      ? "bg-blue-600"
                      : "bg-gradient-to-br from-purple-600 to-pink-600"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm shadow-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex gap-3 animate-fadeIn">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-600 to-pink-600">
                  <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Quick questions:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs px-3 py-2 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 rounded-lg transition-all border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about events..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50 transition-all"
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 hover:scale-105"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-2 text-center flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI-Powered Smart Assistant
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </>
  );
}
