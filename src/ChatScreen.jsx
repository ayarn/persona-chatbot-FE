import React, { useState, useEffect, useRef } from "react";
import ModijiLogo from "./assets/Modiji-logo.png";
import { FiSend } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";

const backgroundTexts = [
  "मेरे प्यारे भाईयो और बहनों 🙏",
  "सब चंगा सी 👌",
  "आत्मनिर्भर भारत 💪",
  "हर घर तिरंगा 🇮🇳",
  "आर्टिफिशियल इंटेलिजेंस 🤖",
  "सबका साथ सबका विकास 🤝",
  "देश नहीं झुकने दूंगा 🚩",
  "भारत माता की जय! 🙌",
  "वोकल फॉर लोकल 📣",
  "डिजिटल इंडिया 🌐",
];

const LOCAL_STORAGE_KEY = "mann_ki_baat_messages";

const ChatScreen = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);
  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage on mount
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [{ role: "system", content: "Welcome to Mann ki Baat with Modiji!" }];
  });
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Animate background text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % backgroundTexts.length);
      setAnimateKey((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    const trimmed = userInput.trim();
    if (!trimmed) return;

    const userMsgObj = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsgObj]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/message/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: trimmed }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data?.data?.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong." },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
      console.error("Error occurred while sending the message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message on Enter (without Shift)
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setMessages([
      { role: "system", content: "Welcome to Mann ki Baat with Modiji!" },
    ]);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-blue-50 overflow-hidden">
      {/* Falling Text Left */}
      <div className="absolute left-10 top-0 flex flex-col items-center pointer-events-none z-0">
        <span
          key={animateKey + "-left"}
          className="text-3xl font-bold text-blue-300 opacity-30 animate-fall"
        >
          {backgroundTexts[currentTextIndex]}
        </span>
      </div>

      {/* Falling Text Right */}
      <div className="absolute right-10 top-0 flex flex-col items-center pointer-events-none z-0">
        <span
          key={animateKey + "-right"}
          className="text-3xl font-bold text-blue-300 opacity-30 animate-fall"
        >
          {backgroundTexts[currentTextIndex]}
        </span>
      </div>

      {/* Main Chat Box */}
      <div className="relative w-full max-w-md min-h-[87vh] flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center gap-3 bg-blue-500 p-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img
              src={ModijiLogo}
              alt="Logo"
              className="w-full h-full object-cover rounded-full border-4"
            />
          </div>
          <h1 className="text-white text-2xl font-medium">
            Mann ki Baat ft.{" "}
            <span className="font-bold text-black bg-yellow-300 rounded-md px-2">
              Modiji
            </span>
          </h1>
        </div>

        {/* Chat Body */}
        <div
          className="flex flex-col gap-4 p-4 overflow-y-auto"
          style={{ height: "60vh" }}
          ref={chatBodyRef}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.role === "user"
                  ? "self-end bg-green-200"
                  : msg.role === "assistant"
                  ? "self-start bg-yellow-200"
                  : "self-start bg-gray-200"
              } rounded-2xl px-4 py-2 max-w-xs whitespace-pre-line`}
            >
              {msg.content}
            </div>
          ))}

          {isLoading && (
            <div className="self-start bg-yellow-200 rounded-2xl px-4 py-2">
              <span className="loading loading-dots loading-md"></span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 p-4 border-t">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Ask to Modiji..."
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
          <button
            className="bg-sky-500 hover:bg-blue-500 text-white rounded-full p-3"
            onClick={handleSendMessage}
          >
            <FiSend />
          </button>
        </div>

        <div className="flex justify-center items-center pb-2">
          <button
            className="flex justify-center items-center gap-1 text-rose-600 font-bold"
            onClick={handleClearChat}
          >
            Clear Chat
            <RiDeleteBin5Line />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
