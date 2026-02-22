import * as userService from "../services/user.js";
import AppError from "../utils/AppError.js";
import { createUserSchema } from "../validators/user.schema.js";

const getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userService.getUser(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// just for your demo bhaskar, getallusers is not for prod
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}

const createUser = async (req, res, next) => {
  try {
    const parseRes = createUserSchema.safeParse(req.body);
    if (!parseRes.success) {
      throw new AppError("Provide valid email address", 400);
    }
    const { email } = parseRes.data;
    const user = await userService.createUser(email);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
export { getUser, createUser, getAllUsers };
