import { Request, Response } from "express";
import { IPersonImage, PersonImage } from "../models/profilepic.model";
import * as fs from "fs";

export class FileService {

    public async getImage(req: Request, res: Response) {
        const name = req.params.id;
        res.writeHead(200, { 'content-type': "image/jpeg" });
        const raw = fs.createReadStream(`./src/imgs/users/${name}`);
        raw.pipe(res);
        raw.on('error', function (err) {
            //res.status(200).json({ successed: false })
        });
    };

    public async postImage(req: Request, res: Response) {
        const body = req.body;
        const filename = `img-${new Date().getTime()}.jpeg`;

        fs.writeFile(`./src/imgs/users/${filename}`, body.file.replace("data:image/jpeg;base64,", ""), "base64", async (err: any) => {

            if (err) {
                console.log(err);
            } else {
                const imgFile: IPersonImage = new PersonImage({
                    name: filename,
                    type: "image/jpeg",
                    route: `./src/imgs/users/${filename}`,
                    user: body.user._id,
                    created_at: new Date()
                });
                imgFile.save().then(() => {
                    res.status(200).send({ successed: true, name: filename });
                }).catch(() => {
                    console.log("Files.service: Ha ocurrido un error al intentar subir un archivo(PersonImageService/Helpers)");
                    res.status(200).send({ successed: false, message: "File upload" });
                });
            }
        });
    };
};
