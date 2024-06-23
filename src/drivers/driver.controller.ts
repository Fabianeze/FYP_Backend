import { Request, Response } from "express";
import { CreateDriverDto } from "./dto/create-driver-dto";
import { DriverService } from "./driver.service";
import { report } from "process";
import { hashPassword } from "../utils/hashPassword";
import HttpError from "../common/Error";
import { Driver } from "./entities/driver.entity";
import { VehicleService } from "../vehicles/vehicle.service";
import { getTimeStamp } from "../utils/getTimeStamp";
import { generateId } from "../utils/generateId";

const driverService = new DriverService();
const vehicleService = new VehicleService();

export class DriverController {
  public create = async (req: Request, res: Response) => {
    try {
      const existingDriver = await driverService.findOne({
        where: { email: req.body.email },
      });
      if (existingDriver) {
        res
          .status(403)
          .json({ message: "Driver with this email already exists" });
      } else {
        const vehicle = await vehicleService.findOne({
          where: { id: req.body.vehicleId },
        });
        const response = await driverService.create({
          driverId: "DRI-" + generateId(),
          name: req.body.name,
          profilePhoto:
            req.protocol +
            "://" +
            req.get("host") +
            "/uploads/" +
            req.file?.filename,
          email: req.body.email,
          vehicle: vehicle ? vehicle : null,
          password: await hashPassword("1234"),
          createdAt: getTimeStamp(),
          updatedAt: getTimeStamp(),
          phoneNo: req.body.phoneNo,
          status: "Active",
        });
        res.send({ message: "Driver created successfuly" });
      }
    } catch (e) {
      console.log("For create", e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getDriverProfile = async (req: Request, res: Response) => {
    try {
      const driver = req.body.user;
      const driverr = await driverService.findOne({ where: { id: driver.id } });
      if (driverr) {
        const { password, ...rest } = driverr;
        res.send(rest);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  public getDriverInfo = async (req: Request, res: Response) => {
    try {
      const driver = req.params.id;
      const driverr = await driverService.findOne({
        where: { id: driver },
        relations: { vehicle: true },
      });
      if (driverr) {
        const { password, ...rest } = driverr;
        res.send(rest);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getAllDrivers = async (req: Request, res: Response) => {
    try {
      const drivers = await driverService.findAll({});
      res.send(drivers);
    } catch (err) {
      console.log("error for drivers", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  public deleteDriver = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const drivers = await driverService.deleteOne({ id });
      res.send(drivers);
    } catch (err) {
      console.log("error for drivers", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  public updateDriver = async (req: Request, res: Response) => {
    try {
      const idd = req.params.id;
      const vehicle = await vehicleService.findOne({
        where: { id: req.body.vehicleId },
      });
      const { vehicleId, id, ...rest } = req.body;
      rest.vehicle = vehicle;
      const drivers = await driverService.update({ where: { id: idd } }, rest);
      res.send({ message: "Updated successfully" });
    } catch (err) {
      console.log("error for drivers", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  public getDriverCount = async (req: Request, res: Response) => {
    try {
      const vehicleActive = await driverService
        .findAll({
          where: { status: "Active" },
        })
        .then((result) => {
          return result.length;
        });
      const vehicleInActive = await driverService
        .findAll({
          where: { status: "Inactive" },
        })
        .then((result) => {
          return result.length;
        });
      console.log(vehicleActive);
      res.send({ active: vehicleActive, inactive: vehicleInActive });
    } catch (err) {
      console.log("error for drivers", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  public getAvailableDrivers = async (req: Request, res: Response) => {
    try {
      const drivers = await driverService.findAll({
        relations: { trips: true },
      });
      const availableDrivers = drivers.filter((driver) => {
        if (driver.trips.length === 0) {
          // Driver has no trips, consider available
          return true;
        }

        // Log the status of each trip for the driver
        const allTripsNotOngoing = driver.trips.every((trip) => {
          console.log(
            `Driver ${driver.id}, Trip ${trip.id}, Status: ${trip.status}`
          );
          return trip.status !== "On Going";
        });

        return allTripsNotOngoing;
      });
      console.log("drive", availableDrivers);

      if (availableDrivers) {
        res.send(availableDrivers);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
