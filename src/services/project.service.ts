import { Request, Response } from "express";
import * as moment from "moment";
import mongoose from "mongoose";
import { checkShare } from "src/helpers/users.helper";
import { IProject, Project } from "src/models/project.model";
import { IShare, Share } from "src/models/shared-list.model";
import { IUser, User } from "src/models/user.model";

class ProjectService {

    public async newProject(req: Request, res: Response) {
        const project: IProject = new Project({
            ...req.body,
            title: req.body.title.toUpperCase(),
            created_at: new Date(),
            created_at_str: moment().format("DD-MM-yyyy LTS"),
            last_modified: new Date(),
            last_modified_str: moment().format("DD-MM-yyyy LTS")
        });
        project.save().then(() => {
            res.status(200).json({ successed: true })
        }).catch(() => {
            res.status(200).json({ successed: false })
        })
    };

    public async getProjectsByUser(req: Request, res: Response) {
        try {
            const type = req.query.type;
            const pub = (type === "PUBLIC") ? true : false;
            const filter = {
                "$and": [
                    { user: req.body.user._id },
                    type ? { public: pub } : {}
                ]
            }
            const projects: IProject[] = await Project.find(filter, { html: 0, js: 0, css: 0, user: 0, created_at: 0, last_modified: 0 }).sort({carpet:-1, last_modified:-1});
            res.status(200).json({ successed: true, projects: projects })
        } catch (error) {
            res.status(200).json({ successed: false, message: "Internal Server Error" })
        }
    }

    public async getProjectsByFather(req: Request, res: Response) {
        try {
            const ex = { html: 0, js: 0, css: 0, user: 0, created_at: 0 };
            const father = req.query.father.toString();
            const fdata:IProject|undefined = father!=="root"? await Project.findById(father, ex):undefined;
            const filter = { user: req.body.user._id, father: father? father: "root" }
            const projects: IProject[] = await Project.find(filter, ex).sort({carpet:-1, last_modified:-1});
            res.status(200).json({ successed: true, projects: projects, father: fdata })
        } catch (error) {
            res.status(200).json({ successed: false, message: "Internal Server Error" })
        }
    }

    public async getProjectById(req: Request, res: Response) {
        try {
            const pid: string = req.params.id.replace("\n", "");
            const uid = req.body.user._id;
            const sh = await Share.find({project: pid},{_id:0, project:0, created_at:0});

            const filter:any = { "$or": [{ user: uid }, { public: true }], _id: pid }

            const l = sh.filter(e=>{
                return e.shared_with.toString() === uid.toString()
            }).length > 0;

            const project: IProject = await Project.findOne(l? {_id: pid} : filter);
            res.status(200).json({ successed: project ? true : false, project: project, editable: project.user._id.toString() === uid.toString() });
        } catch (error) {
            res.status(200).json({ successed: false })
        }
    };

    public async updateProjectById(req: Request, res: Response) {
        try {
            await Project.findOneAndUpdate({ user: req.body.user._id, _id: req.params.id.replace("\n", "") },
                {
                    ...req.body,
                    title: req.body.title.toUpperCase(),
                    last_modified: new Date(),
                    last_modified_str: moment().format("DD-MM-yyyy LTS")
                }, { user: 0 }).then(() => {
                    res.status(200).json({ successed: true });
                }).catch(() => {
                    res.status(200).json({ successed: false })
                });
        } catch (error) {
            res.status(200).json({ successed: false })
        }
    };

    public async shareWith(req: Request, res: Response) {
        try {
            const body = req.body;
            const filter = {
                project: body.project,
                shared_with: body.id,
            };
            const check: boolean = await checkShare(filter);
            if (!check) {
                const newShare: IShare = new Share({ ...filter, created_at: new Date() });
                Project.findByIdAndUpdate(body.project, { shared: true });
                newShare.save().then(() => {
                    res.status(200).json({ successed: true, message: "El proyecto ha sido compartido!" });
                });
            } else {
                res.status(200).json({ successed: false, message: "Ya se ha compartido el proyecto con este usuario!" })
            };
        } catch (error) {
            res.status(200).json({ successed: false, message: "Ha ocurrido un error!" })
        }
    };

    public async deleteShare(req: Request, res: Response) {
        const body = {
            project: req.query.project,
            user: req.query.user
        };
        Share.deleteMany({
            project: body.project,
            shared_with: body.user
        }).then(() => {
            res.status(200).json({ successed: true })
        });
    };

    public async getShares(req: Request, res: Response) {
        const project_id = req.query.id;
        const id = new mongoose.Types.ObjectId(project_id.toString());
        const sh = await Share.aggregate([
            { "$match": { project: id } },
            {
                "$lookup": {
                    from: "users",
                    localField: "shared_with",
                    foreignField: "_id",
                    as: "users"
                }
            },
            {
                "$project": {
                    _id: 1,
                    project: 1,
                    users: {
                        _id: 1,
                        name: 1,
                        lastname: 1,
                        nickname: 1,
                        img: 1
                    }
                }
            }
        ]);
        const users: IUser[] = [];
        sh.map((v) => {
            if (v.users[0])
                users.push(v.users[0]);
        });
        res.status(200).json({ successed: true, list: users });
    };

    public async getShareByUser(req: Request, res: Response) {
        const sh = await Share.aggregate([
            { "$match": { shared_with: req.body.user._id } },
            {
                "$lookup": {
                    from: "projects",
                    localField: "project",
                    foreignField: "_id",
                    as: "projects"
                }
            },
            {
                "$project": {
                    projects: {
                        _id: 1, 
                        title: 1,
                        created_at_str: 1,
                        last_modified_str: 1,
                        user: 1,
                        carpet: 1,
                        public: 1,
                        last_modified: 1
                    }
                }
            }
        ]);
        const projects: IProject[] = [];
        for (let v of sh) {
            if (v.projects[0]) {
                const user = await User.findById(v.projects[0].user, { nickname: 1, img: 1 });
                projects.push({ ...v.projects[0], user: user });
            }
        }
        res.status(200).json({ successed: true, list: projects })
    }

};

export default ProjectService;
