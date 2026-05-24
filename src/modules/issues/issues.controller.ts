import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import type { JwtPayload } from "jsonwebtoken";
import { issueService } from "./issues.service";
import type { IIssueQuery } from "./issues.interface";

const createIssue = async (req: Request, res: Response) => {
    try{
        const user = req.user as JwtPayload
        const result = await issueService.createIssueIntoDB(req.body, user.id)

        sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Issue created successfully",
        data: result.rows[0],
        });
    }catch(error){
        sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Issue creation failed",
          error: error
        });
    }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const query = req.query as unknown as IIssueQuery;
    const result = await issueService.getAllIssuesFromDB(query);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrived successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Issues not found",
      error: error,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.getSingleIssueFromDB(id as string);

    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue Not Found",
        data: null,
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrived successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Issue not found",
      error: error,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    const reporter_role = user.role;
    const id = req.params.id;
    const body = req.body;
    const result = await issueService.updateIssueIntoDB(
      Number(id),
      body,
      reporter_role,
      user.id,
    );

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Issue update failed",
      error,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const issue = await issueService.getSingleIssueFromDB(id as string);

    const user = req.user as JwtPayload;

    if (!issue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue Not Found",
      });
    }

    if (user.role === "maintainer") {
      const result = await issueService.deleteIssueFromDB(id as string);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Issue deleted successfully",
      });
    } else {
      sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Don't have permission to delete",
      });
    }
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Don't have permission to delete"
    });
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue
};