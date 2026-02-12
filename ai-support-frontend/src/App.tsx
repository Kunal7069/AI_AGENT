import { useState, useEffect, useRef } from "react";

const randomThinkingWords = [
  "Thinking...",
  "Searching...",
  "Analyzing...",
  "Checking records...",
  "Processing request...",
];

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [thinkingText, setThinkingText] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Rotate loader words
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      const random =
        randomThinkingWords[
          Math.floor(Math.random() * randomThinkingWords.length)
        ];
      setThinkingText(random);
    }, 800);

    return () => clearInterval(interval);
  }, [loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://ai-agent-1-jwdw.onrender.com/api/chat/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            conversationId: "1",
            userId: "1",
          }),
        },
      );

      if (!response.body) {
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let aiText = "";

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        aiText += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: aiText,
          };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>AI Support Assistant</div>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageWrapper,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                backgroundColor: msg.role === "user" ? "#4f46e5" : "#f1f5f9",
                color: msg.role === "user" ? "white" : "#111",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && <div style={styles.loader}>{thinkingText}</div>}

        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.button} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: "16px",
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#4f46e5",
    color: "white",
    borderRadius: "8px 8px 8px 8px",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  messageWrapper: {
    display: "flex",
  },
  messageBubble: {
    padding: "10px 14px",
    borderRadius: "18px",
    maxWidth: "70%",
    fontSize: "14px",
    lineHeight: "1.4",
  },
  loader: {
    fontStyle: "italic",
    opacity: 0.6,
    paddingLeft: "5px",
  },
  inputContainer: {
    display: "flex",
    padding: "15px",
    borderTop: "1px solid #ddd",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  button: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "white",
    cursor: "pointer",
  },
};

export default App;
