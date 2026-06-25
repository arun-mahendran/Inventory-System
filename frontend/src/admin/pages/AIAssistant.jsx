import { useState } from "react";

import MainLayout from "../components/MainLayout";

import api from "../../api/axios";

import { FiSend } from "react-icons/fi";

function AIAssistant() {

    const [question, setQuestion] =
        useState("");

    const [messages, setMessages] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const askAI = async () => {

        if (!question.trim()) return;

        const userMessage = {
            role: "user",
            text: question
        };

        setMessages(prev => [
            ...prev,
            userMessage
        ]);

        setLoading(true);

        try {

            const response =
                await api.post(
                    "/ai/ask",
                    {
                        question
                    }
                );

            setMessages(prev => [

                ...prev,

                {
                    role: "assistant",
                    text:
                        response.data.answer
                }

            ]);

        }

        catch (error) {

            setMessages(prev => [

                ...prev,

                {
                    role: "assistant",
                    text:
                        "Unable to connect to AI Assistant."
                }

            ]);

        }

        setQuestion("");

        setLoading(false);

    };

    return (

        <MainLayout>

            <div
                style={{
                    maxWidth: "1000px",
                    margin: "0 auto"
                }}
            >

                <h1>
                    🤖 AI Delivery Intelligence Assistant
                </h1>

                <div
                    style={{
                        background: "white",

                        borderRadius: "20px",

                        padding: "20px",

                        marginTop: "30px",

                        minHeight: "500px",

                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.08)"
                    }}
                >

                    <div
                        style={{
                            height: "400px",

                            overflowY: "auto",

                            display: "flex",

                            flexDirection: "column",

                            gap: "15px"
                        }}
                    >

                        {

                            messages.map(

                                (message, index) => (

                                    <div

                                        key={index}

                                        style={{

                                            alignSelf:
                                                message.role === "user"
                                                    ? "flex-end"
                                                    : "flex-start",

                                            background:
                                                message.role === "user"
                                                    ? "#2563eb"
                                                    : "#f1f5f9",

                                            color:
                                                message.role === "user"
                                                    ? "white"
                                                    : "#0f172a",

                                            padding: "14px 18px",

                                            borderRadius: "18px",

                                            maxWidth: "45%",

                                            wordBreak: "break-word",

                                            lineHeight: "1.6",

                                            fontSize: "15px",

                                            boxShadow:
                                                "0 4px 12px rgba(0,0,0,0.06)"
                                        }}
                                    >

                                        {message.text}

                                    </div>

                                )

                            )

                        }

                        {
                            loading && (

                                <div
                                    style={{
                                        background: "#f1f5f9",
                                        padding: "12px 18px",
                                        borderRadius: "16px",
                                        width: "fit-content",
                                        color: "#64748b",
                                        fontStyle: "italic"
                                    }}
                                >
                                    🤖 AI is thinking...
                                </div>

                            )
                        }

                    </div>

                    <div
                        style={{
                            display: "flex",

                            gap: "10px",

                            marginTop: "25px"
                        }}
                    >

                        <input

                            type="text"

                            value={question}

                            onChange={(e) =>
                                setQuestion(
                                    e.target.value
                                )
                            }

                            placeholder=
                                "Ask something about deliveries..."

                            style={{
                                flex: 1,

                                padding: "15px",

                                borderRadius: "14px",

                                border:
                                    "2px solid #e2e8f0"
                            }}
                        />

                        <button

                            onClick={askAI}

                            style={{
                                background: "#2563eb",

                                color: "white",

                                border: "none",

                                width: "60px",

                                borderRadius: "14px",

                                cursor: "pointer"
                            }}
                        >

                            <FiSend size={22} />

                        </button>

                    </div>

                </div>

            </div>

        </MainLayout>

    );

}

export default AIAssistant;