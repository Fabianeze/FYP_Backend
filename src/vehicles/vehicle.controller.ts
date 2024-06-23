import { Request, Response } from "express";
import { CreateVehicleDto } from "./dto/create-vehicle-dto";
import { VehicleService } from "./vehicle.service";
import { report } from "process";
import { hashPassword } from "../utils/hashPassword";
import HttpError from "../common/Error";
import { getTimeStamp } from "../utils/getTimeStamp";
import { DriverService } from "../drivers/driver.service";
const vehicleService = new VehicleService();
const driverService = new DriverService();

export class VehicleController {
  public create = async (req: Request, res: Response) => {
    try {
      const response = await vehicleService.create({
        ...req.body,
        status: "Active",
        createdAt: getTimeStamp(),
        updatedAt: getTimeStamp(),
      });
      res.send({ message: "Vehicle created successfuly" });
    } catch (e) {
      console.log("error for create vehicle", e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getVehicleInfo = async (req: Request, res: Response) => {
    try {
      const vehicle = req.params.id;
      const vehiclee = await vehicleService.findOne({
        where: { id: vehicle },
        relations: { driver: true },
      });
      if (vehiclee) {
        // const { password, ...rest } = driverr;
        res.send(vehiclee);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getAllVehicles = async (req: Request, res: Response) => {
    try {
      const vehicles = await vehicleService.findAll({
        relations: { driver: true },
      });
      return res.send(vehicles);
    } catch (err) {
      console.log("error for drivers", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public deleteVehicle = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const vehicle = await vehicleService.findOne({
        where: { id },
        relations: { driver: true },
      });
      if (vehicle && vehicle.driver) {
        const driverId = vehicle.driver.id;
        vehicle.driver.vehicle = null;
        vehicle.driver.vehicleId = null;
        await driverService.update({ where: { id: driverId } }, vehicle.driver);
      }

      const vehicles = await vehicleService.deleteOne({ id });
      res.send(vehicles);
    } catch (err) {
      console.log("error for drivers", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getVehicleCount = async (req: Request, res: Response) => {
    try {
      const vehicleActive = await vehicleService
        .findAll({
          where: { status: "Active" },
        })
        .then((result) => {
          return result.length;
        });
      const vehicleInActive = await vehicleService
        .findAll({
          where: { status: "Inactive" },
        })
        .then((result) => {
          return result.length;
        });
      const vehicleOutOfService = await vehicleService
        .findAll({
          where: { status: "Out of Service" },
        })
        .then((result) => {
          return result.length;
        });
      console.log(vehicleActive);
      res.send({
        active: vehicleActive,
        inactive: vehicleInActive,
        outofservice: vehicleOutOfService,
      });
    } catch (err) {
      console.log("error for drivers", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public updateVehicle = async (req: Request, res: Response) => {
    console.log("hey")
    try {
      const idd = req.params.id;
      const vehicle = await vehicleService.update(
        { where: { id: idd } },
        req.body
      );
      res.send({ message: "Updated successfully" });
    } catch (err) {
      console.log("error for drivers", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
