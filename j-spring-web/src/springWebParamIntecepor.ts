import { Anntation,doForamtPlainValue, ReflectParam } from "j-spring";
import { 
    ParamterParamType, 
    PathVariable, 
    RequestParam, 
    Param,
    SessionAttribute,
} from "./springWebAnnotation";
import {SpringWebParamInteceptor} from './springWebExtends'

//参数处理器集合
export const paramInterceptor:SpringWebParamInteceptor<any>[] = [];


//query拦截器
class RequestParamParamInteceptor implements SpringWebParamInteceptor<any> {
    error(_bean: any): void {
    }
    success(_bean: any): void {
    }
    isSpringWebParamInteceptor(): boolean {
        return true;
    }
    getAnnotation(): Function {
        return RequestParam;
    }
    getBean(req: any,_res:any,pa: Anntation): Promise<any> | any{
        const {name} = pa.params as ParamterParamType;
        const resutlt =  req.query[name];
        if(!resutlt){
            throw `paramter ${name} must be exist`
        }
        return doForamtPlainValue(resutlt,(pa.params as ReflectParam).reflectType);
    }
}

//params拦截器
class PathVariableParamInteceptor implements SpringWebParamInteceptor<any> {
    error(_bean: any): void {
    }
    success(_bean: any): void {
    }
    isSpringWebParamInteceptor(): boolean {
        return true;
    }
    getAnnotation(): Function {
        return PathVariable;
    }
    getBean(req: any,_res:any, pa: Anntation): Promise<any> | any{
        const {name} = pa.params as ParamterParamType;
        const resutlt =  req.params[name];
        if(!resutlt){
            throw `paramter ${name} must be exist`
        }
        return doForamtPlainValue(resutlt,(pa.params as ReflectParam).reflectType);
    }
}

class ParamInteceptor implements SpringWebParamInteceptor<any> {
    error(_bean: any): void {
        throw new Error("Method not implemented.");
    }
    success(_bean: any): void {
        throw new Error("Method not implemented.");
    }
    isSpringWebParamInteceptor(): boolean {
        return true;
    }
    getAnnotation(): Function {
       return Param;
    }
    getBean(req: any,res:any, pa: Anntation) {
        const {name} = pa.params as ParamterParamType;
        switch(name){
            case 'req':return req;
            case 'res':return res;
            case 'session':return req.session;
            default:
                throw `no support name:${name}`
        }
    }
}

class SessionAttributeInteceptor implements SpringWebParamInteceptor<any> {
    error(_bean: any): void {
        throw new Error("Method not implemented.");
    }
    success(_bean: any): void {
        throw new Error("Method not implemented.");
    }
    isSpringWebParamInteceptor(): boolean {
        return true;
    }
    getAnnotation(): Function {
       return SessionAttribute;
    }
    getBean(req: any,_res:any, pa: Anntation) {
        if(!req.session){
            throw 'not find session module'
        }
        const apam = pa.params as ParamterParamType;
        const v = req.session[apam.name];
        if(v === void 0)
            throw `get session error!`
            
        return doForamtPlainValue(v,(pa.params as ReflectParam).reflectType);
    }
    
}


paramInterceptor.push(new RequestParamParamInteceptor());
paramInterceptor.push(new PathVariableParamInteceptor());
paramInterceptor.push(new ParamInteceptor());
paramInterceptor.push(new SessionAttributeInteceptor());