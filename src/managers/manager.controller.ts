import { Request, Response } from "express";
import { CreateDriverDto } from "./dto/create-manager-dto";
import { ManagerService } from "./manager.service";
import { report } from "process";
import { hashPassword } from "../utils/hashPassword";
import HttpError from "../common/Error";
import { generateId } from "../utils/generateId";
const managerService = new ManagerService();

export class ManagerController {
  public create = async (req: Request, res: Response) => {
    try {
      const existingManager = await managerService.findOne({
        where: { email: req.body.email },
      });
      if (existingManager) {
        res
          .status(403)
          .json({ message: "Manager with this email already exists" });
      } else {
        const response = await managerService.create({
          managerId: "MAN-" + generateId(),
          email: req.body.email,
          password: await hashPassword(req.body.password),
          phoneNo: req.body.phoneNo,
          status: "Active",
          name: req.body.name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        res.send({ message: "Manager created successfuly" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getManagerProfile = async (req: Request, res: Response) => {
    try {
      const manager = req.body.user;
      const managerr = await managerService.findOne({
        where: { id: manager.id },
      });
      if (managerr) {
        const { password, ...rest } = managerr;
        res.send(rest);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
