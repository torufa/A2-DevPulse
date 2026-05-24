import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middlewares/auth";

const issuesRouter = Router()

const roles = {
    contributor: "contributor",
    maintainer: "maintainer"
} as const;

issuesRouter.post("/", auth(roles.contributor, roles.maintainer), issuesController.createIssue);
issuesRouter.get("/", issuesController.getAllIssues);
issuesRouter.get("/:id", issuesController.getSingleIssue);
issuesRouter.patch("/:id", auth(roles.contributor, roles.maintainer), issuesController.updateIssue);

export default issuesRouter;