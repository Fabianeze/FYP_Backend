import HttpError from "../common/Error";
import { DriverService } from "../drivers/driver.service";
import * as bcrypt from "bcrypt";
import { refreshToken } from "../utils/refreshToken";
import { token } from "../utils/token";
import { Response, Request } from "express";
import { ManagerService } from "../managers/manager.service";
import { GuestService } from "../guests/guest.service";

const driverService = new DriverService();
const managerService = new ManagerService();
const guestService = new GuestService();

class AuthService {
  public validateDriver = async (email: string, password: string) => {
    const user = await driverService.findOne({ where: { email } });
    if (user) {
      if (!bcrypt.compareSync(password, user.password)) {
        throw new HttpError(400, "Password does not match");
      }
      return user;
    } else {
      throw new HttpError(404, "User does not exist");
    }
  };

  public validateManager = async (email: string, password: string) => {
    const user = await managerService.findOne({ where: { email: email } });
    if (user) {
      if (!bcrypt.compareSync(password, user.password)) {
        throw new HttpError(400, "Password does not match");
      }
      return user;
    } else {
      throw new HttpError(404, "User does not exist");
    }
  };

  public validateGuest = async (email: string, password: string) => {
    const user = await guestService.findOne({ where: { email } });
    if (user) {
      if (!bcrypt.compareSync(password, user.password)) {
        throw new HttpError(400, "Password does not match");
      }
      return user;
    } else {
      throw new HttpError(404, "User does not exist");
    }
  };

  public loginDriver = async (req: Request, res: Response) => {
    try {
      const user = await this.validateDriver(req.body.email, req.body.password);
      if (user) {
        const { password, ...rest } = user;
        const payload = { id: user.id };
        const tokenn = token(payload);
        const refreshTokenn = refreshToken(payload);
        res

          .cookie("refreshToken", refreshTokenn, {
            httpOnly: true,
            sameSite: "strict",
          })
          .send({ accessToken: tokenn });
      }
    } catch (err) {
      if (err instanceof HttpError) {
        res
          .status(err.statusCode)
          .json({ statusCode: err.statusCode, message: err.message });
      }
    }
  };

  public loginManager = async (req: Request, res: Response) => {
    try {
      const user = await this.validateManager(
        req.body.email,
        req.body.password
      );
      if (user) {
        const { password, ...rest } = user;
        const payload = { id: user.id };
        const tokenn = token(payload);
        const refreshTokenn = refreshToken(payload);
        res

          .cookie("refreshToken", refreshTokenn, {
            httpOnly: true,
            sameSite: "strict",
          })
          .send({ accessToken: tokenn });
      }
    } catch (err) {
      if (err instanceof HttpError) {
        res
          .status(err.statusCode)
          .json({ statusCode: err.statusCode, message: err.message });
      }
    }
  };
  public loginGuest = async (req: Request, res: Response) => {
    try {
      const user = await this.validateGuest(req.body.email, req.body.password);
      if (user) {
        const { password, ...rest } = user;
        const payload = { id: user.id };
        const tokenn = token(payload);
        const refreshTokenn = refreshToken(payload);
        res

          .cookie("refreshToken", refreshTokenn, {
            httpOnly: true,
            sameSite: "strict",
          })
          .send({ accessToken: tokenn });
      }
    } catch (err) {
      if (err instanceof HttpError) {
        res
          .status(err.statusCode)
          .json({ statusCode: err.statusCode, message: err.message });
      }
    }
  };

  public login = async (req: Request, res: Response) => {
    if (req.body.account === "Driver") {
      this.loginDriver(req, res);
    } else if (req.body.account === "Fleet Manager") {
      this.loginManager(req, res);
    } else {
      this.loginGuest(req, res);
    }
  };
}

export default AuthService;
