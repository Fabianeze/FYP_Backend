import { Request, Response } from "express";
import { TripService } from "./trip.service";
import { report } from "process";
import { hashPassword } from "../utils/hashPassword";
import HttpError from "../common/Error";
import { generateId } from "../utils/generateId";
import { GuestService } from "../guests/guest.service";
import { DriverService } from "../drivers/driver.service";
import { request } from "http";
const tripService = new TripService();
const guestService = new GuestService();
const driverService = new DriverService();
export class TripController {
  public create = async (req: Request, res: Response) => {
    try {
      const guestt = req.body.user;
      const val = generateId();
      const guest = await guestService.findOne({ where: { id: guestt.id } });
      const driver = await driverService.findOne({
        where: { id: req.body.driverId },
        relations: { vehicle: true },
      });
      console.log(guest);
      const response = await tripService.create({
        tripId: "TRI-" + val,
        status: "Pending",
        guest: guest,
        startTime: "",
        endTime: "",
        driver: driver,
        vehicle: driver?.vehicle,
        type: req.body.type,
        from: req.body.from,
        to: req.body.to,
      });
      res.send({ message: "Trip created successfuly" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getTrip = async (req: Request, res: Response) => {
    try {
      const trip = req.params.id;
      const tripp = await tripService.findOne({
        where: { id: trip },
      });
      if (tripp) {
        res.send(tripp);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getTrips = async (req: Request, res: Response) => {
    try {
      const tripp = await tripService.findAll({
        relations: { vehicle: true, guest: true, driver: true },
      });
      if (tripp) {
        res.send(tripp);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getAllTripsForGuest = async (req: Request, res: Response) => {
    try {
      const id = req.body.user.id;
      console.log(id);
      const guest = await guestService.findOne({
        where: { id },
        relations: { trips: { vehicle: true, driver: true } },
      });
      console.log(guest);
      res.send(guest?.trips);
    } catch (err) {
      console.log("error for maintenance", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  public getAllNewTripsForDriver = async (req: Request, res: Response) => {
    try {
      const id = req.body.user.id;
      console.log(id);

      // Assuming 'pending' is the status you want to filter for
      const driver = await driverService.findOne({
        where: { id },
        relations: { trips: { vehicle: true, driver: true, guest: true } },
      });

      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      // Filter trips to get only pending ones
      const pendingTrips = driver.trips.filter(
        (trip) => trip.status === "Pending"
      );

      console.log("Pending trips:", pendingTrips);
      res.send(pendingTrips);
    } catch (err) {
      console.log("Error fetching trips for driver:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  public getAllTripsForDriver = async (req: Request, res: Response) => {
    try {
      const id = req.body.user.id;
      console.log(id);

      // Assuming 'pending' is the status you want to filter for
      const driver = await driverService.findOne({
        where: { id },
        relations: { trips: { vehicle: true, driver: true, guest: true } },
      });

      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      // Filter trips to get only pending ones
      const historyTrips = driver.trips.filter(
        (trip) => trip.status !== "Pending"
      );

      console.log("Pending trips:", historyTrips);
      res.send(historyTrips);
    } catch (err) {
      console.log("Error fetching trips for driver:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  public updateTrip = async (req: Request, res: Response) => {
    try {
      const idd = req.params.id;
      const trip = await tripService.update({ where: { id: idd } }, req.body);
      res.send({ message: "Updated successfully" });
    } catch (err) {
      console.log("error for drivers", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
