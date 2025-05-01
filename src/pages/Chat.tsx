import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import Container from 'react-bootstrap/Container';

interface ChatMessage {
    nickname: string;
    message: string;
    createdAt: string;
}

export default function Chat() {
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get("roomId");
    const token = localStorage.getItem("accessToken");
    const [nickname, setNickname] = useState(localStorage.getItem("nickname") || "");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!token) {
            alert("로그인 하십시오.");
            window.location.href = "/login";
            return;
        }

        if (!roomId || !token) {
            alert("토론방이 존재하지 않습니다.");
            window.location.href = "/home";
            return;
        }

        const socket = new WebSocket(`ws://localhost:8080/ws/chat?roomId=${roomId}&token=${token}`);
        socketRef.current = socket;

        socket.onopen = () => {
        };

        socket.onmessage = (event) => {
            try {
                const receivedMessage = JSON.parse(event.data); // JSON 형식으로 처리
                appendLog(receivedMessage.nickname, receivedMessage.message, receivedMessage.createdAt);
            } catch (error) {
                appendLog(nickname, event.data, new Date().toISOString()); // JSON이 아닌 경우
            }
        };

        socket.onclose = (event) => {
            alert("연결 종료: " + event);
        };

        getMessages(roomId);

        return () => {
            socket.close();
        };
    }, [roomId, token]);

    const appendLog = (nickname: string, message: string, createdAt: string) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            {nickname, message, createdAt}
        ]);
    };

    const sendMessage = () => {
        if (!message.trim()) {
            alert("메시지를 입력해주세요!");
            return;
        }

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const messageData = {nickname, message};
            socketRef.current.send(JSON.stringify(messageData));
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
            <h2 className="fw-bold pt-5 pb-3 mb-4" style={{borderBottom: '1px solid #dbdbdb'}}>
                {roomId}번 토론방
            </h2>

            <div
                style={{
                    height: "500px",
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginBottom: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                }}
            >
                {messages.map((msg, idx) => {
                    const isMine = msg.nickname.trim() === nickname.trim();
                    console.log("isMine:", isMine, msg.nickname, nickname);

                    return (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                justifyContent: isMine ? "flex-start" : "flex-end"
                            }}
                        >
                            {isMine ? (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
                                        <img
                                            src={`profile1.jpeg`}
                                            alt="profile"
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                objectFit: "cover"
                                            }}
                                        />
                                        <div>
                                            <div style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: "4px" }}>
                                                {msg.nickname}
                                            </div>
                                            <div
                                                style={{
                                                    backgroundColor: isMine ? "#fff" : "#fff",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "15px",
                                                    padding: "10px 15px",
                                                    maxWidth: "280px",
                                                    wordBreak: "break-word"
                                                }}
                                            >
                                                {msg.message}
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: "gray", marginTop: "4px" }}>
                                                {formatTime(msg.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ) : (
                                <div style={{display: "flex", flexDirection: "row", gap: "8px"}}>
                                    <img
                                        src={`profile2.jpg`}
                                        alt="profile"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            objectFit: "cover"
                                        }}
                                    />
                                    <div>
                                        <div style={{fontSize: "0.85rem", fontWeight: "bold", marginBottom: "4px"}}>
                                            {msg.nickname}
                                        </div>
                                        <div
                                            style={{
                                                backgroundColor: "#fff",
                                                border: "1px solid #ccc",
                                                borderRadius: "15px",
                                                padding: "10px 15px",
                                                maxWidth: "280px",
                                                wordBreak: "break-word"
                                            }}
                                        >
                                            {msg.message} ㄹㄹㄹ
                                        </div>
                                        <div style={{fontSize: "0.75rem", color: "gray", marginTop: "4px"}}>
                                            {formatTime(msg.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ width: '5%' }}>메시지: </label> {/* 여기에 적당한 마진을 추가하여 레이블과 입력창을 구분 */}
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-control me-2 " // 버튼과의 간격을 주기 위해 right margin 추가
                    style={{ width: '90%' }}
                />
                <button onClick={sendMessage} className="btn btn-dark" style={{ width: '10%' }}>보내기</button>
            </div>
        </Container>
    );
}

const styles = {
    timestamp: {
        float: "right" as "right" | "left" | "none" | "inherit"
    }
};
