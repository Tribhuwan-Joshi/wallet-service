import AppError from "../utils/AppError";

const createUser = async (email) => {
  if (!email) throw new AppError("Email is required", 400);
  const user = dbService.createUser(email);
  return user;
};

const getUser = async (userId) => {
  if (!email) throw new AppError("Email is required", 400);
  const user = dbService.getUser(email);
  return user;
};

export default { createUser, getUser };
