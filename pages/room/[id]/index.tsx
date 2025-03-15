"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { unixConvertation } from "@/helpers/unixConvertation";

type ChatProps = {
  username: string;
  roomId: string;
  message: string;
  unixTime: number;
};

const RoomPage: FC = () => {
  const [chat, setChat] = useState<ChatProps[]>([]);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const eventSource = new EventSource(`/api/stream?roomId=${id}`);

      eventSource.onmessage = (event) => {
        console.log(event.data);
        setChat((prev) => [...prev, JSON.parse(event.data)]);
      };

      eventSource.onerror = (err) => {
        console.error("SSE Error:", err);
        eventSource.close();
      };

      handleSendMessage(`joined chat`);

      return () => {
        console.log("Closing SSE connection");
        eventSource.close();
      };
    } else {
      console.log("Room ID not available yet.");
    }
  }, [id]);

  async function handleSendMessage(newMessage: string) {
    const unixTime = Date.now();

    const data = {
      username,
      roomId: id,
      message: newMessage,
      unixTime,
    };

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h1> Room № {id}</h1>
      <ul
        style={{
          height: "100%",
          border: "solid 1px black",
          padding: "20px",
          overflow: "auto",
          listStyleType: "none",
        }}
      >
        {chat?.map((el, index) => (
          <li key={index}>
            {`${el.username} - ${el.message} - ${unixConvertation(
              el.unixTime
            )}`}
          </li>
        ))}
      </ul>

      <textarea
        style={{ width: "100%" }}
        placeholder="message"
        rows={3}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={() => {
            handleSendMessage(message);
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default RoomPage;
