import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  error?: any;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    if(!data.success){
        return res.status(data.statusCode).json({
          success: data.success,
          message: data.message,
          error: data.error,
        });
    }
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
    })
}

export default sendResponse;
