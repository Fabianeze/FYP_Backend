import { Request, Response } from "express";
import { GuestService } from "./guest.service";
import { report } from "process";
import { hashPassword } from "../utils/hashPassword";
import HttpError from "../common/Error";
import { generateId } from "../utils/generateId";
import { getTimeStamp } from "../utils/getTimeStamp";
const guestService = new GuestService();

export class GuestController {
  public create = async (req: Request, res: Response) => {
    try {
      const val = generateId();
      const response = await guestService.create({
        guestId: "GUE-" + val,
        name: req.body.name,
        email: req.body.email,
        password: await hashPassword(req.body.password),
        createdAt: getTimeStamp(),
        updatedAt: getTimeStamp(),
        trips: [],
      });
      res.send({ message: "Guest created successfuly" });
    } catch (e) {
      console.log("Error for create guest", e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getGuestProfile = async (req: Request, res: Response) => {
    try {
      const guest = req.body.user;
      const guestt = await guestService.findOne({
        where: { id: guest.id },
      });
      if (guestt) {
        const { password, ...rest } = guestt;
        res.send(rest);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getGuestTrips = async (req: Request, res: Response) => {
    try {
      const guest = req.body.user;
      const guestt = await guestService.findOne({
        where: { id: guest.id },
        relations: { trips: true },
      });
      res.send(guestt?.trips);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
