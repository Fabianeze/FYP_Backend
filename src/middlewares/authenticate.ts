import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import HttpError from "../common/Error";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new HttpError(500, "Internal server error");
  }
  const token = req.headers.authorization;
  const tokenn = token?.slice(7, token.length);

  if (!token) {
    res.status(401).json({ statusCode: 401, message: "No token provided" });
  }

  try {
    if (tokenn) {
      const decoded = jwt.verify(tokenn, secret);
      req.body.user = decoded;
      next();
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.log("Token expired");
      res
        .status(403)
        .json({ statusCode: 403, message: "Unauthorized! Expired token" });
    } else if (err instanceof HttpError) {
      res
        .status(err.statusCode)
        .json({ statusCode: err.statusCode, message: err.message });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res
        .status(401)
        .json({ statusCode: 401, message: "Unauthorized! Invalid token" })
        .redirect("/login");
    }
  }
};
