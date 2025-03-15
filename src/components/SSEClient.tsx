import { useEffect, useState } from "react";

const SSEClient = () => {
  const [data, setData] = useState<string>("Waiting for messages...");

  useEffect(() => {
    const eventSource = new EventSource("/api/stream");

    eventSource.onmessage = (event) => {
      console.log("Received:", event.data);
      setData(event.data);
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      eventSource.close();
    };

    return () => {
      console.log("Closing SSE connection");
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h2>Server-Sent Events</h2>
      <p>{data}</p>
    </div>
  );
};

export default SSEClient;
