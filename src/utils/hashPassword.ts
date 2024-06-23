import * as bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const hashPassword = async (data: string) => {
  const saltRounds = process.env.SALT_ROUNDS;
  if (!saltRounds) {
    throw new Error("Internal Server Error");
  }

  const salt = bcrypt.genSaltSync(+saltRounds);

  const hash = bcrypt.hashSync(data, salt);
  return hash;
};
