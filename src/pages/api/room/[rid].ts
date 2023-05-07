import { NextApiRequest, NextApiResponse } from "next";
import { addRoom, createRoom, getRoomById } from "@/lib/db";
import ChatRoom from "../../../models/room";


type ResponseData = {
  message: "SUCCESS" | "ERROR";
  room?: ChatRoom;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method == "POST") {
    const reqData = JSON.parse(req.body);
    const room = createRoom(reqData.name);
    await addRoom(room);

    res.status(200).send({ message: "SUCCESS", room });
    return;
  }

  const { rid } = req.query;
  const room = await getRoomById(rid as string);

  if (room) {
    res.status(200).send({ message: "SUCCESS", room });
    return;
  }

  res.status(404).send({ message: "ERROR" });
}
