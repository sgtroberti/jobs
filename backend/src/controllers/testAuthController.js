import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import Task from "../models/testTask.js";
import Project from "../models/testProject.js";

const testRouter = express.Router();

testRouter.use(authMiddleware);

testRouter.get("/", async (req, res) => {
  //TODO: try catch
  return res.send(await Project.find().populate(["user", "tasks"]));
});

testRouter.get("/:projectId", async (req, res) => {
  //TODO: try catch
  return res.send(
    await Project.findById(req.params.projectId).populate(["user", "tasks"])
  );
});

testRouter.post("/", async (req, res) => {
  try {
    const { title, description, tasks } = req.body;

    const newProject = await Project.create({
      title,
      description,
      user: req.userId,
    });

    await Promise.all(
      tasks.map(async (task) => {
        const projectTask = new Task({ ...task, project: newProject._id });
        await projectTask.save();
        newProject.tasks.push(projectTask);
      })
    );

    await newProject.save();

    return res.send({ newProject });
  } catch (error) {
    return res.status(400).send({ error: "Can't create, try again " + error });
  }
});

testRouter.put("/:projectId", async (req, res) => {
  try {
    const { title, description, tasks } = req.body;

    const newProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        title,
        description,
      },
      { new: true }
    );

    newProject.tasks = [];
    await Task.remove({ project: newProject._id });

    await Promise.all(
      tasks.map(async (task) => {
        const projectTask = new Task({ ...task, project: newProject._id });
        await projectTask.save();
        newProject.tasks.push(projectTask);
      })
    );

    await newProject.save();

    return res.send({ newProject });
  } catch (error) {
    return res.status(400).send({ error: "Can't create, try again " + error });
  }
});

testRouter.delete("/:projectId", async (req, res) => {
  //TODO: try catch
  res.send(await Project.findByIdAndDelete(req.params.projectId));
});

export default testRouter;
