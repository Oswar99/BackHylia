import { Project } from "src/models/project.model";

class ProjectHelper{

    public async deleteProjectsReferences(id: string){
        const lpe = await Project.find({father:id});
        if(lpe.length === 0){
            return true;
        }else{
            await Project.deleteMany({father:id});
            for(let project of lpe){
                return await this.deleteProjectsReferences(project.id);
            };
        };
    };
};

export default ProjectHelper;
