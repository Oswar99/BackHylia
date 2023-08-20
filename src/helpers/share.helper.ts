import { IProject, Project } from "src/models/project.model";
import { IShare, Share } from "src/models/shared-list.model";
import { IUser } from "src/models/user.model";

class shareHelper{
    public async shareWithUser(user: string, projects: IProject[]){
        for(let project of projects){
            const filter = {project: project._id, shared_with: user};
            const newShare: IShare = new Share({...filter, created_at: new Date()});
            newShare.save().catch((reason)=>{
                console.log(reason.message);
            });
            if(project.carpet){
                const sons: IProject[] = await Project.find({father: project._id});
                return await this.shareWithUser(user, sons);
            }else{
                return true;
            };
        };
    };
};

export default shareHelper;