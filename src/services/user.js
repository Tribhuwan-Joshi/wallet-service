import AppError from "../utils/AppError.js";
import * as dbService from "../services/db.js";
const createUser = async (email) => {
  if (!email) throw new AppError("Email is required", 400);
  const user = dbService.createUser(email);
  return user;
};

const getUser = async (id) => {
  if (!id) throw new AppError("Id is required", 400);
  const user = dbService.getUser(id);
  return user;
};

const getAllUsers = async () => {
  const { rows } = await dbService.query(
    "SELECT id, email, created_at FROM users",
  );

  return rows;
};

export { createUser, getUser, getAllUsers };
