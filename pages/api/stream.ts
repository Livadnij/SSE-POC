import { NextApiRequest, NextApiResponse } from "next";

type MessageType = {
  username: string;
  message: string;
  roomId: string;
  unixTime: number;
};

type Client = { res: NextApiResponse; roomId: string };

export let clients: Client[] = []; // Explicitly define client type
export let chatRooms: Record<string, MessageType[]> = {}; // Store messages per room

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { roomId } = req.query;
  if (!roomId || typeof roomId !== "string") {
    return res.status(400).json({ message: "Missing or invalid roomId" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  clients.push({ res, roomId });
  console.log(
    `New client connected to room ${roomId}. Total clients: ${clients.length}`
  );

  if (chatRooms[roomId]) {
    chatRooms[roomId].forEach((message) => {
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    });
  }

  req.on("close", () => {
    clients = clients.filter((client) => client.res !== res);
    res.end();
    console.log(
      `Client disconnected from room ${roomId}. Total clients: ${clients.length}`
    );
  });
}
