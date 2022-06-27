 
import express from "express";
import { postEdit, getEdit , logout, startGithubLogin, finishGithubLogin, getChangePassword, postChangePassword } from "../controllers/userController";
import {avatarUploade, protectorMiddleware, publicOnlyMiddleware, uploadFiles} from "../middlewares";

const userRouter = express.Router();


userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUploade.single("avatar"),postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start",publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware,finishGithubLogin);


export default userRouter;