import express from "express";
import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
const usersRouter = express.Router();

usersRouter.route('/register').post(requireBody(["username", "password"]), async (req, res) => {
  const newUser = await createUser(req.body.username, req.body.password);
  const token = createToken({ id: newUser.id });
  res.status(201).send(token);
});

usersRouter.route('/login').post(requireBody(["username", "password"]), async (req, res) => {
  const user = await getUserByUsernameAndPassword(req.body.username, req.body.password);
  if (!user) return res.status(401).send("Invalid email or password.");
  const token = createToken({ id: user.id });
  res.send(token);
});

export default usersRouter;