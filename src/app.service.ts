import { Injectable } from '@nestjs/common';
import { IUser, User } from './models/user.model';

@Injectable()
export class AppService {
  getHello(): Promise<string> {
    return new Promise<string>(async (resolve)=>{
      //const newuser: IUser = new User({
      //  name:"oswar",
      //  email:"oswar.cruz@unah.hn",
      //  pass:"SE2023"
      //})
      //newuser.save();
      resolve('Hello World!');
    })
  }
}
