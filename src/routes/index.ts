import { Application } from "express";
import { DriverController } from "../drivers/driver.controller";
import AuthService from "../auth/auth.service";
import * as jwt from "jsonwebtoken";
import { token } from "../utils/token";
import HttpError from "../common/Error";
import { refreshToken } from "../utils/refreshToken";
import { authenticate } from "../middlewares/authenticate";
import multer from "multer";
import path from "path";
import { ManagerController } from "../managers/manager.controller";
import { VehicleController } from "../vehicles/vehicle.controller";
import { TripController } from "../trips/trip.controller";
import { GuestController } from "../guests/guest.controller";
import { MaintenanceController } from "../maintenances/maintenance.controller";
const driver = new DriverController();
const vehicle = new VehicleController();
const trip = new TripController();
const guest = new GuestController();
const maintenace = new MaintenanceController();
// const maintenance= ne
const auth = new AuthService();
const manager = new ManagerController();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
class Routes {
  public router(app: Application) {
    app.post("/login", auth.login);
    app.post("/drivers", upload.single("profilePhoto"), driver.create);
    app.post("/managers", upload.single("profilePhoto"), manager.create);
    app.post("/vehicles", vehicle.create);
    app.post("/maintenances", authenticate, maintenace.create);
    app.post("/guests", guest.create);
    app.post("/trips", authenticate, trip.create);
    app.get("/vehicles", vehicle.getAllVehicles);
    app.get("/maintenances", maintenace.getAllMaintenances);
    app.get("/trips", trip.getTrips);
    app.get("/drivers", driver.getAllDrivers);
    app.get("/manager/profile", authenticate, manager.getManagerProfile);
    app.get("/driver/profile", authenticate, driver.getDriverProfile);
    app.get("/drivers/count", authenticate, driver.getDriverCount);
    app.get("/vehicles/count", authenticate, vehicle.getVehicleCount);
    app.get(
      "/maintenances/count",
      authenticate,
      maintenace.getMaintenancesCount
    );
    app.get(
      "/maintenances/driver",
      authenticate,
      maintenace.getAllMaintenancesForUser
    );
    app.get("/trips/guest", authenticate, trip.getAllTripsForGuest);
    app.get("/trips/driver/new", authenticate, trip.getAllNewTripsForDriver);
    app.get("/trips/driver/history", authenticate, trip.getAllTripsForDriver);
    app.get("/drivers/available", authenticate, driver.getAvailableDrivers);
    app.get("/vehicles/:id", authenticate, vehicle.getVehicleInfo);
    app.get("/vehicles");
    app.get("/drivers/:id", authenticate, driver.getDriverInfo);
    app.get("/maintenances/:id", authenticate, maintenace.getMaintenanceInfo);
    app.get("/drivers/:id", authenticate, maintenace.getMaintenanceInfo);
    app.put("/drivers/:id", authenticate, driver.updateDriver);
    app.put("/vehicles/:id", authenticate, vehicle.updateVehicle);
    app.put("/maintenances/:id", authenticate, maintenace.updateMaintenance);
    app.put("/trips/:id", authenticate, trip.updateTrip);
    app.delete("/vehicles/:id", authenticate, vehicle.deleteVehicle);
    app.delete("/drivers/:id", authenticate, driver.deleteDriver);
    // app.post("/driver/login", auth.loginDriver);
    app.get("/refreshtoken", (req, res) => {
      try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new HttpError(500, "Internal Server Error");
        }
        const refreshToken = req.cookies["refreshToken"];

        const decoded = jwt.verify(refreshToken, secret) as { id: string };

        const newAcesstoken = token({ id: decoded.id });

        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .send({ accessToken: newAcesstoken });
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          console.log("Token expired");
          res
            .status(403)
            .json({ statusCode: 403, message: "Unauthorized! Expired token" });
        }
      }
    });
  }
}

export const route = new Routes().router;
