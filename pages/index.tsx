import UsernamePopup from "@/components/UsernamePopup";
import { getRandomInRange } from "@/helpers/getRandomInRange";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const handleCreateNewRoom = (value?: string) => {
    if (value && value.length >= 5) {
      router.push(`/room/${value}`);
    } else if (!value && value !== "") {
      const roomId = `${getRandomInRange(0, 9)}${getRandomInRange(
        0,
        9
      )}${getRandomInRange(0, 9)}${getRandomInRange(0, 9)}${getRandomInRange(
        0,
        9
      )}`;
      router.push(`/room/${roomId}`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <UsernamePopup />
      <div>
        <h1>Next.js Server-Sent Events (SSE)</h1>
        <h3>proof of concept</h3>
      </div>
      <input
        placeholder="room id"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <button
        onClick={() => {
          handleCreateNewRoom(inputValue);
        }}
      >
        connect to existing room
      </button>
      <button
        onClick={() => {
          handleCreateNewRoom();
        }}
      >
        create new room
      </button>
    </div>
  );
}
