import { useState } from "react";

import ReactMarkdown from "react-markdown";

import MainLayout from "../components/MainLayout";

import api from "../../api/axios";

import {
  FiSend,
  FiPlus,
  FiTrash2,
  FiPaperclip,
  FiMic,
  FiBarChart2,
  FiClock,
  FiAward,
  FiPieChart,
  FiArrowRight,
} from "react-icons/fi";

import { BsRobot } from "react-icons/bs";

const SUGGESTIONS = [
  {
    key: "summary",
    text: "Show today's delivery summary",
    icon: FiBarChart2,
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
  {
    key: "delayed",
    text: "Find delayed parcels",
    icon: FiClock,
    iconBg: "#FFEDD5",
    iconColor: "#EA580C",
  },
  {
    key: "agents",
    text: "Top performing agents",
    icon: FiAward,
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    key: "insights",
    text: "Analytics insights",
    icon: FiPieChart,
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
  },
];

function AIAssistant() {
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async (overrideText) => {
    const currentQuestion = (overrideText ?? question).trim();

    if (!currentQuestion || loading) return;

    const userMessage = {
      role: "user",
      text: currentQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Clear textarea immediately
    setQuestion("");

    setLoading(true);

    try {
      const response = await api.post("/ai/ask", {
        question: currentQuestion,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.data.answer,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to connect to AI Assistant.",
        },
      ]);
    }

    setLoading(false);
  };

  const askAI = () => sendMessage();

  const handleSuggestionClick = (text) => {
    sendMessage(text);
  };

  const handleNewChat = () => {
    setMessages([]);
    setQuestion("");
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const hasMessages = messages.length > 0;

  return (
    <MainLayout>
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.headerRow}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIconBox}>
              <BsRobot size={20} color="#2563EB" />
            </div>
            <div>
              <h1 style={styles.title}>AI Delivery Intelligence Assistant</h1>
              <p style={styles.subtitle}>
                Ask questions about deliveries, customers, parcels, agents
                and business insights.
              </p>
              <div style={styles.titleUnderline} />
            </div>
          </div>

          <div style={styles.headerActions}>
            <button
              onClick={handleNewChat}
              style={styles.headerButton}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              <FiPlus size={15} />
              New Chat
            </button>

            <button
              onClick={handleClearChat}
              style={styles.headerButton}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              <FiTrash2 size={15} />
              Clear Chat
            </button>

            <div style={styles.statusPill}>
              <span style={styles.statusDot} />
              AI Status: Online
            </div>
          </div>
        </div>

        {/* Chat card */}
        <div style={styles.chatCard}>
          <div style={styles.chatBody}>
            {!hasMessages ? (
              <div style={styles.emptyWrap}>
                <div style={styles.robotCircleOuter}>
                  <div style={styles.robotCircleInner}>
                    <BsRobot size={40} color="white" />
                  </div>
                  <div style={styles.chatBubbleBadge}>
                    <span style={styles.chatBubbleDot} />
                    <span style={styles.chatBubbleDot} />
                    <span style={styles.chatBubbleDot} />
                  </div>
                </div>

                <h2 style={styles.emptyTitle}>How can I help today?</h2>
                <p style={styles.emptySubtitle}>
                  Ask me anything or try one of the suggestions below.
                </p>

                <div style={styles.suggestionsGrid}>
                  {SUGGESTIONS.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.key}
                        onClick={() => handleSuggestionClick(s.text)}
                        style={styles.suggestionCard}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#CBD5E1";
                          e.currentTarget.style.boxShadow =
                            "0 10px 25px rgba(15, 23, 42, 0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#EEF2F6";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(15, 23, 42, 0.03)";
                        }}
                      >
                        <div
                          style={{
                            ...styles.suggestionIconBox,
                            background: s.iconBg,
                          }}
                        >
                          <Icon size={17} color={s.iconColor} />
                        </div>

                        <div style={styles.suggestionBottomRow}>
                          <span style={styles.suggestionText}>{s.text}</span>
                          <FiArrowRight size={14} color="#2563EB" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={styles.messagesList}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.messageBubble,
                      alignSelf:
                        message.role === "user" ? "flex-end" : "flex-start",
                      background:
                        message.role === "user" ? "#2563EB" : "#F1F5F9",
                      color: message.role === "user" ? "white" : "#0F172A",
                    }}
                  >
                    <ReactMarkdown>
                      {message.text}
                    </ReactMarkdown>
                  </div>
                ))}

                {loading && (
                  <div style={styles.thinkingBubble}>🤖 AI is thinking...</div>
                )}
              </div>
            )}
          </div>

          <div style={styles.dateDividerRow}>
            <div style={styles.dateDividerLine} />
            <span style={styles.dateDividerLabel}>Today</span>
            <div style={styles.dateDividerLine} />
          </div>

          <div style={styles.inputRow}>
            <button style={styles.attachButton} type="button">
              <FiPaperclip size={15} color="#94A3B8" />
            </button>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                // Send message when Enter is pressed
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  askAI();
                }
                // Shift + Enter automatically creates new line
              }}
              placeholder="Ask anything about your logistics operations..."
              rows={1}
              style={styles.textarea}
            />

            <button style={styles.micButton} type="button">
              <FiMic size={15} color="#64748B" />
            </button>

            <button
              onClick={askAI}
              style={{
                ...styles.sendButton,
                opacity: question.trim() ? 1 : 0.6,
                cursor: question.trim() ? "pointer" : "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const styles = {
  page: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    maxWidth: "1160px",
    margin: "0 auto",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    flexWrap: "nowrap",
    gap: "16px",
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    minWidth: 0,
  },
  headerIconBox: {
    width: "44px",
    height: "44px",
    borderRadius: "13px",
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: "21px",
    fontWeight: 700,
    color: "#0F172A",
    letterSpacing: "-0.02em",
    whiteSpace: "nowrap",
  },
  subtitle: {
    margin: "4px 0 0",
    color: "#64748B",
    fontSize: "13px",
    maxWidth: "460px",
    lineHeight: 1.4,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  titleUnderline: {
    width: "32px",
    height: "3px",
    borderRadius: "2px",
    background: "#2563EB",
    marginTop: "7px",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "nowrap",
    flexShrink: 0,
  },
  headerButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid #E2E8F0",
    background: "white",
    borderRadius: "9px",
    padding: "8px 13px",
    fontSize: "12.5px",
    fontWeight: 600,
    color: "#334155",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background 0.15s ease",
  },
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "1px solid #BBF7D0",
    background: "#F0FDF4",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "12.5px",
    fontWeight: 600,
    color: "#16A34A",
    whiteSpace: "nowrap",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22C55E",
    display: "inline-block",
  },
  chatCard: {
    background: "white",
    borderRadius: "20px",
    border: "1px solid #EEF2F6",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  },
  chatBody: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    paddingRight: "6px",
  },
  emptyWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "8px 10px",
    minHeight: 0,
  },
  robotCircleOuter: {
    position: "relative",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle at 50% 45%, #EFF6FF 0%, #DBEAFE 70%, #EFF6FF 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "14px",
    flexShrink: 0,
  },
  robotCircleInner: {
    width: "76px",
    height: "76px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 28px rgba(37, 99, 235, 0.3)",
  },
  chatBubbleBadge: {
    position: "absolute",
    top: "8px",
    right: "2px",
    background: "#2563EB",
    borderRadius: "12px 12px 12px 3px",
    padding: "6px 9px",
    display: "flex",
    gap: "3px",
    boxShadow: "0 8px 18px rgba(37, 99, 235, 0.3)",
  },
  chatBubbleDot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "white",
    display: "inline-block",
    opacity: 0.9,
  },
  emptyTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#0F172A",
  },
  emptySubtitle: {
    margin: "6px 0 18px",
    color: "#64748B",
    fontSize: "13px",
  },
  suggestionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(140px, 1fr))",
    gap: "12px",
    width: "100%",
    maxWidth: "860px",
  },
  suggestionCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "12px",
    textAlign: "left",
    border: "1px solid #EEF2F6",
    background: "white",
    borderRadius: "14px",
    padding: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    fontFamily: "inherit",
    minHeight: "88px",
  },
  suggestionIconBox: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionBottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "8px",
  },
  suggestionText: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#0F172A",
    lineHeight: 1.3,
  },
  messagesList: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  messageBubble: {
    padding: "14px 18px",
    borderRadius: "18px",
    maxWidth: "60%",
    wordBreak: "break-word",
    lineHeight: "1.6",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  thinkingBubble: {
    alignSelf: "flex-start",
    background: "#F1F5F9",
    padding: "12px 18px",
    borderRadius: "16px",
    width: "fit-content",
    color: "#64748B",
    fontStyle: "italic",
    fontSize: "14px",
  },
  dateDividerRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    margin: "12px 0",
    flexShrink: 0,
  },
  dateDividerLine: {
    flex: 1,
    height: "1px",
    background: "#EEF2F6",
  },
  dateDividerLabel: {
    fontSize: "12.5px",
    fontWeight: 600,
    color: "#94A3B8",
    background: "#F8FAFC",
    padding: "6px 14px",
    borderRadius: "999px",
    whiteSpace: "nowrap",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "6px 8px 6px 14px",
    background: "white",
    flexShrink: 0,
  },
  attachButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
    padding: "5px",
  },
  textarea: {
    flex: 1,
    border: "none",
    outline: "none",
    resize: "none",
    fontSize: "14px",
    fontFamily: "inherit",
    minHeight: "20px",
    maxHeight: "120px",
    overflowY: "auto",
    padding: "8px 0",
    background: "transparent",
    color: "#0F172A",
  },
  micButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#F1F5F9",
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
  },
  sendButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "#2563EB",
    color: "white",
    border: "none",
    flexShrink: 0,
    transition: "background 0.15s ease",
  },
};

export default AIAssistant;