import _ from "lodash";
import {
  getProjects,
  getProject,
  putLike,
  deleteLike
} from "../dao/project.mjs";
import { getComments } from "../dao/comment.mjs";
import { putComment } from "../dao/comment.mjs";
import { deleteComment } from "../dao/comment.mjs";
import { putVote } from "../dao/vote.mjs";
import { getVotesByUser } from "../dao/vote.mjs";

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
  },
  "/:id/comment/:commentid": {
    delete: async (req, res) => {
      const { id, commentid } = req.params;
      const { alias } = req.user;
      await deleteComment(commentid, alias);
      return res.send(await getComments(id)).status(200);
    }
  },
  "/:id/comment": {
    get: async (req, res) => {
      const { id } = req.params;
      const comments = await getComments(id);
      console.dir(comments);
      return res.send(comments).status(200);
    },
    put: async (req, res) => {
      const { id } = req.params;
      const { text } = req.body;
      const { alias } = req.user;
      await putComment(id, alias, text);      
      return res.send(await getComments(id)).status(200);
    }
  },
  "/:id/vote": {
    put: async (req, res) => {
      const { id } = req.params;
      const { alias } = req.user;
      await putVote(id, alias);      
      return res.send(await getVotesByUser(alias)).status(200);
    },
    delete: async (req, res) => {
      const { id } = req.params;
      const { alias } = req.user;
      await deleteVote(id, alias);      
      return res.send(await getVotesByUser(alias)).status(200);      
    }
  }
};
