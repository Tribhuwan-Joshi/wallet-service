import AppError from "../utils/AppError.js";
import userRepo from "../repositories/user.js"
import { getClient } from "./db.js";
const createUser = async (email) => {
  if (!email) throw new AppError("Email is required", 400);
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const result = await userRepo.createUserWithWallet(
      client,
      email
    );

    await client.query("COMMIT");

    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getUser = async (id) => {
  if (!id) throw new AppError("Id is required", 400);
  const user = await userRepo.findUserById(id);
  return user;
};

const getAllUsers = async () => {
  return userRepo.getAllUsers();
}

export { createUser, getUser, getAllUsers };
