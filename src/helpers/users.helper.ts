import { IShare, Share } from "src/models/shared-list.model";

export async function checkShare(filter:{project:string, shared_with:string}){
    const check:IShare = await Share.findOne(filter, {_id:1});
    return check? true:false;
}