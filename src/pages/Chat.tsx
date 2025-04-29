import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

interface ChatMessage {
    nickname: string;
    message: string;
    createdAt: string;
}

export default function Chat() {
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get("roomId");
    const token = localStorage.getItem("token");
    const [nickname, setNickname] = useState(localStorage.getItem("nickname") || "");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const socketRef = useRef<WebSocket | null>(null);
    const chatLogRef = useRef<HTMLDivElement>(null);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!roomId || !token) {
            alert("토큰 또는 방 정보가 없습니다!");
            return;
        }

        const socket = new WebSocket(`ws://localhost:8080/ws/chat?roomId=${roomId}&token=${token}`);
        socketRef.current = socket;
        console.log("socket readetState: "+socket.readyState);
        socket.onopen = () => {
            appendLog(`${roomId} 입장 완료`);
        };

        socket.onmessage = (event) => {
            console.log("Received message:", event.data);
            appendLog(event.data);
        };

        socket.onclose = (event) => {
            alert("연결 종료: " + event);
        };

        getMessages(roomId);

        return () => {
            socket.close();
        };
    }, [roomId, token]);

    const appendLog = (text: string) => {
        if (chatLogRef.current) {
            chatLogRef.current.innerHTML += `<div>${text}</div>`;
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    };

    const sendMessage = () => {
        if (!message.trim()) {
            alert("메시지를 입력해주세요!");
            return;
        }

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ message }));
            setMessage(""); // 메시지 전송 후 입력창 비우기
        } else {
            console.error("WebSocket 연결이 열려 있지 않습니다.");
            alert("WebSocket 연결 실패");
        }
    };

    const getMessages = async (discussionId: string) => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/chat/history?discussionId=${discussionId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            } else {
                console.error("히스토리 로드 실패");
            }
        } catch (err) {
            console.error("에러 발생:", err);
        }
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString();
    };

    return (
        <Container>
            <h2 className="fw-bold pt-5 pb-3 mb-4" style={{ borderBottom: '1px solid #dbdbdb' }}>
                {roomId}번 토론방
            </h2>

            <div className="mb-3">
                <label>닉네임: </label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => {
                        setNickname(e.target.value);
                        localStorage.setItem("nickname", e.target.value);
                    }}
                    className="form-control mb-2"
                />
                <label>메시지: </label>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-control"
                />
                <button onClick={sendMessage} className="btn btn-primary mt-2">보내기</button>
            </div>

            <hr />

            <div
                ref={chatBoxRef}
                style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}
            >
                {messages.map((msg, idx) => (
                    <div key={idx} className="message-container">
                        <span className="nickname fw-bold">{msg.nickname}: </span>
                        <span className="message">{msg.message}</span>
                        <span className="timestamp text-muted"> ({formatTime(msg.createdAt)})</span>
                    </div>
                ))}
            </div>

            <div
                id="chat-log"
                ref={chatLogRef}
                style={{ border: "1px solid #ccc", height: "300px", overflow: "auto", padding: "10px" }}
            />
        </Container>
    );
}
