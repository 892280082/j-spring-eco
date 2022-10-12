import {spring} from 'j-spring'


export type middleWareType =  ( (req:any,res:any,next:()=>void) => void ) | (new()=>ExpressMiddleWare);

export type MiddleWareParam = {
    middleWareClassList:middleWareType[]
}

export type MappingParam = {
    path:string
}


export const Controller = (path:string) => spring.classAnnotationGenerator('j-spring.Controller',{path},Controller);

export const Shuttle = () => spring.classAnnotationGenerator('j-spring.Shuttle',{},Shuttle)

export const ApiMiddleWare = (middleWareClassList:middleWareType[]) => spring.classAnnotationGenerator('j-spring.ApiMiddleWare',{middleWareClassList},ApiMiddleWare);

//类 发送json控制器
export const Json = ()=> spring.classAnnotationGenerator('j-spring.Json',{},Json);

//方法控制器 get请求

export const Get = (path?:string) => spring.methodAnnotationGenerator('j-spring.Get',{path},Get);

export const ResponseBody = () => spring.methodAnnotationGenerator('j-spring.ResponseBody',{},ResponseBody);

//方法控制器 Post请求

export const Post = (path?:string) => spring.methodAnnotationGenerator('j-spring.Post',{path},Post);

//方法控制器 RequestMapping

export const RequestMapping = (path?:string) => spring.methodAnnotationGenerator('j-spring.RequestMapping',{path},RequestMapping);

export const Render = (path:string) => spring.methodAnnotationGenerator('j-spring.Render',{path},Render);

export const MiddleWare = (middleWareClassList:middleWareType[])  => spring.methodAnnotationGenerator('j-spring.middleWareClassList',{middleWareClassList},MiddleWare);

export type ParamterParamType = {
    name:string,
    type:Function
}

//express中间件
export interface ExpressMiddleWare {
    isExpressMidldleWare():boolean;
    invoke(req:any,res:any,next:Function):void
}



//字段
export const PathVariable = (name:string) => spring.paramterAnnotationGenerator('j-spring.PathVariable',name,{name},PathVariable);
//字段
export const RequestParam = (name:string) => spring.paramterAnnotationGenerator('j-spring.RequestParam',name,{name},RequestParam);

export const RequestBody = (name:string) => spring.paramterAnnotationGenerator('j-spring.RequestBody',name,{},RequestBody);

//获取session
export const SessionAttribute = (name:string) => spring.paramterAnnotationGenerator('j-spring.SessionAttribute',name,{name},SessionAttribute);

export const Param = (name:string) => spring.paramterAnnotationGenerator('j-spring.SessionAttribute',name,{name},Param);

