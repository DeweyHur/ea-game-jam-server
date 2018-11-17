import _ from "lodash";
import { resError } from "./util.mjs";
import {
  getProjects,
  getProject,
  putLike,
  deleteLike
} from "../dao/project.mjs";

export const routes = {
  "": {
    get: async (req, res) => {
      const projects = await getProjects();
      console.dir(projects);
      return res.send(projects).status(200);
    }
  },
  "/:id": {
    get: async (req, res) => {
      const { id } = req.params;
      const project = await getProject(id);
      console.dir(project);
      return res.send(project).status(200);
    }
  },
  "/:id/like": {
    put: async (req, res) => {
      const { id } = req.params;
      const { alias } = req.user;
      const result = await putLike(id, alias);
      console.dir(result.result);

      const project = await getProject(id);
      console.dir(project);
      return res.send(project).status(200);
    },
    delete: async (req, res) => {
      const { id } = req.params;
      const { alias } = req.user;
      const result = await deleteLike(id, alias);
      console.dir(result.result);

      const project = await getProject(id);
      console.dir(project);
      return res.send(project).status(200);
    }
  }
};
