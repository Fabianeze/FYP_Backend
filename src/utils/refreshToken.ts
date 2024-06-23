import * as jwt from "jsonwebtoken";

export const refreshToken = (payload: { id: string }) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Secret is not defined");
  }
  const signature = jwt.sign(payload, secret, { expiresIn: "15s" });
  return signature;
};
