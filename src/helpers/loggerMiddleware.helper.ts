import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import TokenHelper from './token.helper';
import fileUpload from 'express-fileupload';

const TkHelper = new TokenHelper();

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      //fileUpload();
      const vtk = await TkHelper.verifyToken(req.headers.authorization.split(" ")[1])
      if (vtk.status) {
        req.body = {
          ...req.body,
          user: vtk.user
        }
        next();
      } else {
        res.sendStatus(403);
      }
    } catch (error) {
      res.sendStatus(403);
    }
  }
}
