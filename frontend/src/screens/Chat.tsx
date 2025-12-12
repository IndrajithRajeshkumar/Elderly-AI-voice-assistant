import React, { useRef, useState } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [muted, setMuted] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 🔊 Text-to-speech
  const speak = (text: string) => {
    if (muted) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };

  // 🎤 Voice Recognition (Web Speech API)
  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;

    rec.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setInput(text);
      setTimeout(sendMessage, 200);
    };

    rec.start();
  };

  // Send message
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      const reply = data.reply || "⚠️ No reply from server";

      const botMsg: Message = { sender: "bot", text: reply };
      setMessages((prev) => [...prev, botMsg]);

      speak(reply);
    } catch (e) {
      const err = { sender: "bot", text: "⚠️ Backend error." };
      setMessages((prev) => [...prev, err]);
    }

    textareaRef.current?.focus();
  };

  // Handle Enter / Shift+Enter
  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) return; // allow newline
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chat with Jarvis 🤖</h1>

        <button
          onClick={() => {
            setMuted(!muted);
            if (!muted) window.speechSynthesis.cancel();
          }}
          className={`px-3 py-1 rounded ${
            muted ? "bg-gray-300" : "bg-blue-600 text-white"
          }`}
        >
          {muted ? "Muted" : "Voice On"}
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-gray-100 p-6 rounded overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 my-2 rounded-xl max-w-xl ${
              m.sender === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white text-gray-800 shadow"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="mt-4 flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
          className="flex-1 p-3 border rounded-xl resize-none min-h-[60px]"
        />

        {/* 🎤 MIC BUTTON */}
        <button
          onClick={startVoiceInput}
          className="bg-gray-200 px-3 py-3 rounded-xl hover:bg-gray-300"
        >
          🎤
        </button>

        {/* SEND BUTTON */}
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;










