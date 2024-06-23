import { dataSource } from "../db/datasource";
import express from "express";
import * as dotenv from "dotenv";
import { route } from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

dataSource.initialize().then(() => {
  const app = express();
  // const corsOptions = {
  //   origin: "http://localhost:3000",
  //   'Access-Control-Allow-Credentials': 'true'
  // };
  app.use(express.json());
  app.use(cookieParser());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true"); // Ensure this is set to 'true'
    next();
  });
  // app.use(cors(corsOptions));
  route(app);
  return app.listen(2000 || process.env.PORT);
});
