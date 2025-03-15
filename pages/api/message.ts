import { NextApiRequest, NextApiResponse } from "next";
import { handleMessage } from "./stream"; // Import the message handler

type MessageType = {
  username: string;
  message: string;
  roomId: string;
  unixTime: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { roomId, username, message, unixTime } = req.body;

  if (!roomId || !username || !message || !unixTime) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newMessage: MessageType = { username, message, roomId, unixTime };

  // Store and broadcast the message
  handleMessage(roomId, newMessage);

  return res.status(200).json({ message: "Message sent to room" });
}
