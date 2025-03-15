import { NextApiRequest, NextApiResponse } from "next";

type MessageType = {
  username: string;
  message: string;
  roomId: string;
  unixTime: number;
};

type Client = { res: NextApiResponse; roomId: string };

export const clientsByRoom: Record<string, Client[]> = {}; // Clients per room
export const chatRooms: Record<string, MessageType[]> = {}; // Store messages per room

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

  // Store client in the room
  if (!clientsByRoom[roomId]) {
    clientsByRoom[roomId] = [];
  }
  clientsByRoom[roomId].push({ res, roomId });

  console.log(
    `New client connected to room ${roomId}. Total clients: ${clientsByRoom[roomId].length}`
  );

  // Send previous messages in the room to the new client
  if (chatRooms[roomId]) {
    chatRooms[roomId].forEach((message) => {
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    });
  }

  // Handle disconnection
  req.on("close", () => {
    clientsByRoom[roomId] = clientsByRoom[roomId].filter(
      (client) => client.res !== res
    );
    res.end();
    console.log(
      `Client disconnected from room ${roomId}. Total clients: ${clientsByRoom[roomId].length}`
    );
  });
}

// This function can be used to broadcast messages to all clients in a specific room
export const sendMessageToRoom = (roomId: string, message: MessageType) => {
  if (clientsByRoom[roomId]) {
    clientsByRoom[roomId].forEach((client) => {
      client.res.write(`data: ${JSON.stringify(message)}\n\n`);
    });
  }
};

// This function could be used in an API route to handle incoming messages
export const handleMessage = (roomId: string, message: MessageType) => {
  // Store message in chatRooms
  if (!chatRooms[roomId]) {
    chatRooms[roomId] = [];
  }
  chatRooms[roomId].push(message);

  // Broadcast the message to all connected clients
  sendMessageToRoom(roomId, message);
};
