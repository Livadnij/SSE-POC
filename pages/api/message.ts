import { NextApiRequest, NextApiResponse } from "next";
import { clients, chatRooms } from "./stream";

type MessageType = {
  username: string;
  message: string;
  roomId: string;
  unixTime: number;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, roomId, message, unixTime }: MessageType = req.body;
  if (!username || !roomId || !message || !unixTime) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const newMessage: MessageType = { username, message, roomId, unixTime };

  if (!chatRooms[roomId]) chatRooms[roomId] = [];
  chatRooms[roomId].push(newMessage);

  clients.forEach((client) => {
    if (client.roomId === roomId) {
      client.res.write(`data: ${JSON.stringify(newMessage)}\n\n`);
    }
  });

  res.status(200).json({ message: "Message sent successfully" });
}
