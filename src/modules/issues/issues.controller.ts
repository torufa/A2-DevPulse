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
          message: "Something went wrong",
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
      statusCode: 500,
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getSingleIssue = async (req: Request,res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.getSingleIssueFromDB(id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrived successfully",
      data: result,
    });
  }catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Issue not found',
      error: error,
    });
  }
}

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
};