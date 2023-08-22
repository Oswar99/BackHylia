import { Request, Response } from "express";
import * as moment from "moment";
import mongoose from "mongoose";
import ProjectHelper from "src/helpers/project.helper";
import shareHelper from "src/helpers/share.helper";
import { checkShare } from "src/helpers/users.helper";
import { IProject, Project } from "src/models/project.model";
import { IProjectLog, ProjectLog } from "src/models/project_log.model";
import { IShare, Share } from "src/models/shared-list.model";
import { IUser, User } from "src/models/user.model";

class ProjectService extends ProjectHelper {

    public async newProject(req: Request, res: Response) {
        try {
            const father = req.body.father;
            const sh: shareHelper = new shareHelper();

            const pj: IProject | null = (father !== 'root')? await Project.findById(father):null;

            const body = {
                ...req.body,
                title: req.body.title.toUpperCase(),
                created_at: new Date(),
                created_at_str: moment().format("DD-MM-yyyy LTS"),
                last_modified: new Date(),
                last_modified_str: moment().format("DD-MM-yyyy LTS")
            }

            const project: IProject = new Project(body);

            const plog: IProjectLog = new ProjectLog({
                ...body,
                created_by: req.body.user,
                project: project._id
            });

            if (pj && pj.user._id.toString() !== req.body.user._id.toString()) {
                await sh.shareWithUser(pj.user._id, [project._id])
            };

            await plog.save();

            project.save().then(() => {
                res.status(200).json({ successed: true })
            }).catch(() => {
                res.status(200).json({ successed: false });
            })

        } catch (error) {
            console.log(error.message)
            res.status(200).json({ successed: false });

        }
    };

    public async getProjectsByUser(req: Request, res: Response) {
        try {
            const type = req.query.type;
            const pub = (type === "PUBLIC") ? true : false;
            const filter = {
                "$and": [
                    { user: req.body.user._id },
                    { carpet: false },
                    type ? { public: pub } : {}
                ]
            }
            const projects: IProject[] = await Project.find(filter, { html: 0, js: 0, css: 0, user: 0, created_at: 0, last_modified: 0 }).sort({ carpet: -1, last_modified: -1 });
            res.status(200).json({ successed: true, projects: projects })
        } catch (error) {
            res.status(200).json({ successed: false, message: "Internal Server Error" })
        }
    }

    public async getProjectsByFather(req: Request, res: Response) {
        try {
            const ex = { html: 0, js: 0, css: 0, user: 0, created_at: 0 };
            const father = req.query.father.toString().replace('undefined', 'root');
            const user = req.body.user;

            const projects_shared: IProject[] = [];

            const shares = await Share.aggregate([
                {
                    "$lookup": {
                        from: "projects",
                        localField: "project",
                        foreignField: "_id",
                        as: "projects"
                    }
                },
                { "$match": { shared_with: user._id } },
                {
                    "$project": {
                        projects: ex
                    }
                }
            ]);

            for (let share of shares) {
                if (share.projects[0]) {
                    projects_shared.push(share.projects[0])
                };
            };

            const psf = projects_shared.filter(ps => { return projects_shared.filter(e => { return e._id.toString() === ps.father.toString() }).length === 0 });

            const fverication = projects_shared.filter(f => { return f._id.toString() === father }).length > 0;
            const ffilter = fverication ? { _id: father } : { "$or": [{ user: user._id }, { public: true }], _id: father }

            const fdatatemp: IProject | undefined = father !== "root" ? await Project.findOne(ffilter, ex) : undefined;
            const fdata = fdatatemp ? fdatatemp : undefined;
            const fathertemp = fdatatemp ? fdatatemp._id : "root";

            const pfi = (fathertemp !== "root") ? {
                father: fathertemp,
                "$or": [
                    { user: user._id },
                    { _id: projects_shared },
                    { public: true }
                ]
            } : {
                father: fathertemp,
                user: user._id,
            };

            const projects: IProject[] = await Project.find(pfi, ex).sort({ carpet: -1, created_at: -1 });

            res.status(200).json({ successed: true, projects: projects, father: fdata, shareds: psf });
        } catch (error) {
            res.status(200).json({ successed: false, message: "Internal Server Error" })
        }
    }

    public async getProjectById(req: Request, res: Response) {
        try {
            const pid: string = req.params.id.replace("\n", "");
            const uid = req.body.user._id;
            const sh = await Share.find({ project: pid }, { _id: 0, project: 0, created_at: 0 });

            const filter: any = { "$or": [{ user: uid }, { public: true }], _id: pid }

            const l = sh.filter(e => {
                return e.shared_with.toString() === uid.toString()
            }).length > 0;

            const project: IProject = await Project.findOne(l ? { _id: pid } : filter);
            res.status(200).json({ successed: project ? true : false, project: project, editable: project.user._id.toString() === uid.toString() });
        } catch (error) {
            res.status(200).json({ successed: false })
        }
    };

    public async updateProjectById(req: Request, res: Response) {
        try {
            const pid: string = req.params.id.replace("\n", "");
            const uid = req.body.user._id;

            const sh = await Share.find({ project: pid }, { _id: 0, project: 0, created_at: 0 });

            const l = sh.filter(e => {
                return e.shared_with.toString() === uid.toString()
            }).length > 0;

            const body = {
                ...req.body.data,
                title: req.body.data.title.toUpperCase(),
                last_modified: new Date(),
                last_modified_str: moment().format("DD-MM-yyyy LTS")
            }
            const pu = await Project.findOneAndUpdate(l ? { _id: pid } : { user: uid, _id: pid }, body, { user: 0 });

            if (pu) {
                const plog: IProjectLog = new ProjectLog({
                    ...body,
                    created_at: new Date(),
                    created_at_str: moment().format("DD-MM-yyyy LTS"),
                    created_by: req.body.user,
                    project: pu._id
                });
                await plog.save();
                res.status(200).json({ successed: true });
            } else {
                res.status(200).json({ successed: false, message: "No tiene permisos para modificar este recurso." })
            };

        } catch (error) {
            console.log(error.message)
            res.status(200).json({ successed: false })
        }
    };

    public async shareWith(req: Request, res: Response) {
        try {
            const body = req.body;
            const sh: shareHelper = new shareHelper();
            const project = await Project.findById(body.project);
            const r = await sh.shareWithUser(body.id, [project]);

            res.status(200).json({ successed: r, message: "El proyecto ha sido compartido!" });

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
            { "$match": { shared_with: req.body.user._id, carpet: false } },
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
    };

    public async deleteProject(req: Request, res: Response) {
        const id: string = req.params.id;

        const pe = await Project.findOneAndDelete({ _id: id, user: req.body.user._id });
        if (pe) {
            await super.deleteProjectsReferences(id);
            await Share.deleteMany({ project: id });
            await ProjectLog.deleteMany({ project: id });
            res.status(200).json({ successed: true, message: "El proyecto ha sido eliminado!" });
        } else {
            res.status(200).json({ successed: false, message: "No tiene permisos para eliminar este recurso." });
        };
    };

};

export default ProjectService;
