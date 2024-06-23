import * as jwt from "jsonwebtoken";

export const token = (payload: { id: string }) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Secret is not defined");
  }
  const signature = jwt.sign(payload, secret, { expiresIn: "60m" });
  return signature;
};
