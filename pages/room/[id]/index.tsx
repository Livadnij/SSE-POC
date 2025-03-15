"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { unixConvertation } from "@/helpers/unixConvertation";
import { useUser } from "@/context/UserContext";

type ChatProps = {
  username: string;
  roomId: string;
  message: string;
  unixTime: number;
};

const RoomPage: FC = () => {
  const [chat, setChat] = useState<ChatProps[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const { username } = useUser();

  useEffect(() => {
    if (!username) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [username, router]);

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
      // Handle the case where id is not available (e.g., initial render).
      // You can choose to do nothing or set up a default behavior.
      console.log("Room ID not available yet.");
    }
  }, [id, username]);

  if (loading || !id) return <div>Loading...</div>;

  const handleSendMessage = async (newMessage: string) => {
    const unixTime = Date.now();

    const data = {
      username,
      roomId: id,
      message: newMessage,
      unixTime,
    };

    console.log(data);

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
  };

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
      <button
        onClick={() => {
          handleSendMessage(message);
        }}
      >
        Send
      </button>
    </div>
  );
};

export default RoomPage;
