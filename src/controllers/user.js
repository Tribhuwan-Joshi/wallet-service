import userService from "../services/user";
import AppError from "../utils/AppError";
import { createUserSchema } from "../validators/user.schema";

const getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = userService.getUser(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const parseRes = createUserSchema.safeParse(req.body);
    if (!parseRes.success) {
      throw new AppError("Provide valid email address", 400);
    }
    const { email } = parseRes.data;
    const user = userService.createUser(email);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export default { getUser, createUser };
