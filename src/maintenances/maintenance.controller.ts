import { Request, Response } from "express";
import { report } from "process";
import { hashPassword } from "../utils/hashPassword";
import HttpError from "../common/Error";
import { MaintenanceService } from "./maintenance.service";
import { DriverService } from "../drivers/driver.service";
import { getTimeStamp } from "../utils/getTimeStamp";
import { generateId } from "../utils/generateId";
import { VehicleService } from "../vehicles/vehicle.service";
import { getDate } from "../utils/getDate";
const maintenanceService = new MaintenanceService();
const driverService = new DriverService();
const vehicleService = new VehicleService();

export class MaintenanceController {
  public create = async (req: Request, res: Response) => {
    try {
      const id = req.body.user.id;
      const driver = await driverService.findOne({
        where: { id },
        relations: { vehicle: true },
      });
      if (driver?.vehicle === null) {
        res.status(404).json({ message: "You have not been assigned a car" });
      } else {
        const response = await maintenanceService.create({
          maintenanceId: "MAI-" + generateId(),
          description: req.body.description,
          driver: driver,
          status: "Pending",
          vehicle: driver?.vehicle,
          createdAt: getDate(),
          updatedAt: getDate(),
        });
        res.send({ message: "Maintenace created successfuly" });
      }
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getMaintenanceInfo = async (req: Request, res: Response) => {
    try {
      const maintenance = req.params.id;
      const maintenancee = await maintenanceService.findOne({
        where: { id: maintenance },
        relations: { vehicle: true },
      });
      if (maintenancee) {
        res.send(maintenancee);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getAllMaintenances = async (req: Request, res: Response) => {
    try {
      const maintenance = await maintenanceService.findAll({
        relations: { vehicle: true, driver: true },
      });
      res.send(maintenance);
    } catch (err) {
      console.log("error for maintenance", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  public getMaintenancesCount = async (req: Request, res: Response) => {
    try {
      const id = req.body.user.id;
      const maintenances = await maintenanceService.findAll({
        where: { driverId: id },
      });
      const pendingCount = maintenances.filter((maintenance) => {
        return maintenance.status === "Pending";
      }).length;
      const rejectedCount = maintenances.filter((maintenance) => {
        return maintenance.status === "Rejected";
      }).length;
      const approvedCount = maintenances.filter((maintenance) => {
        return maintenance.status === "Approved";
      }).length;
      res.send({ pendingCount, rejectedCount, approvedCount });
    } catch (err) {
      console.log("error for maintenance", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  public getAllMaintenancesForUser = async (req: Request, res: Response) => {
    try {
      const id = req.body.user.id;
      console.log(id);
      const maintenance = await driverService.findOne({
        where: { id },
        relations: { maintenances: { vehicle: true } },
      });
      console.log(maintenance);
      res.send(maintenance?.maintenances);
    } catch (err) {
      console.log("error for maintenance", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  public deleteMaintenance = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const drivers = await driverService.deleteOne({ id });
      res.send(drivers);
    } catch (err) {
      console.log("error for drivers", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  public updateMaintenance = async (req: Request, res: Response) => {
    try {
      const idd = req.params.id;
      if (req.body.status === "Approved") {
        const maintenace = await maintenanceService.findOne({
          where: { id: idd },
        });
        console.log(maintenace);
        const vehicleId = maintenace?.vehicleId;
        console.log("vehicle", vehicleId);
        vehicleService.update(
          { where: { id: vehicleId } },
          { status: "Out of Service" }
        );
        const maintenance = await maintenanceService.update(
          { where: { id: idd } },
          { ...req.body, updatedAt: getDate() }
        );
        res.send({ message: "Updated successfully" });
      } else {
        const maintenance = await maintenanceService.update(
          { where: { id: idd } },
          { ...req.body, updatedAt: getDate() }
        );
        res.send({ message: "Updated successfully" });
      }
    } catch (err) {
      console.log("error for drivers", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
