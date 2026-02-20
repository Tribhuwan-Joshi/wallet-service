import userService from "../services/user"

const getUser = async(req,res,next)=>{
    const id = req.params.id;
    try {
        const user = userService.getUser(id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

const createUser = async(req,res,next)=>{
    const {email} = req.body;
    try {
        const user = userService.createUser(email);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export default {getUser,createUser};