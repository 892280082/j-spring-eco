import {triggerClassAnnotation,triggerFieldAnnotation,triggerMethodAnnotation,triggerParamterAnnotation} from './SpringContext'
import { Clazz,Anntation, AnnoParam,ReflectParam } from './SpringType';
import "reflect-metadata"




/**
 * 注解生成器
 * annoName:string 注解名称 方便调试
 * param：AnnoParam 注解携带的参数
 * ref？：Function 引用参数 用于索引
 */
export function classAnnotationGenerator(annoName:string,param?:AnnoParam,ref?:Function):Function{
    return function temp<T extends Clazz>(constructor:T) {

        triggerClassAnnotation(constructor,new Anntation(annoName,ref?ref:temp,param));
    
        return constructor;
    
    } 
}

export function fieldAnnotationGenerator(annoName:string,param:AnnoParam,ref?:Function):Function{
    return function temp(_target:any,key:string){
        (param as ReflectParam).reflectType = Reflect.getMetadata("design:type",_target,key);
        triggerFieldAnnotation(key,new Anntation(annoName,ref?ref:temp,param))
    }
}


export function methodAnnotationGenerator(annoName:string,param:AnnoParam,ref?:Function):Function{
    return function temp(_target: any, name: string, _descriptor: PropertyDescriptor){
        (param as ReflectParam).reflectType = Reflect.getMetadata("design:returntype", _target, name);
        triggerMethodAnnotation(name,new Anntation(annoName,ref?ref:temp,param));
    }
}

export function paramterAnnotationGenerator(annoName:string,paramterName:string,param:AnnoParam,ref?:Function):Function{
    return function temp(_target: Object, _methodName: string, index: number){
        (param as ReflectParam).reflectType =  Reflect.getMetadata("design:paramtypes",_target,_methodName)[index];
        triggerParamterAnnotation(paramterName,index,new Anntation(annoName,ref?ref:temp,param));
    }
}


/**内置注解 */

//Autowired： 装配参数
export type AutowiredParam<T> = {
    clazz?:new()=>T,
    force?:boolean,
    type?:(bean:any)=>boolean
}

export type ValueParam = {
    path:string,
    force?:boolean
}

export const Component = ()=>classAnnotationGenerator('j-spring.Component',{},Component);

function setForceDefaultValue(param:{force?:boolean}){
    if(param.force === void 0)
        param.force = true;
}

export const Autowired = <T>(param?:AutowiredParam<T>) => {
    param = param  ||{};
    setForceDefaultValue(param);
    return fieldAnnotationGenerator('j-spring.Autowired',param,Autowired);
}

export const Value = (param:ValueParam) => {
    setForceDefaultValue(param);
    return fieldAnnotationGenerator('j-spring.Value',param,Value);
}

export const Method = ()=>methodAnnotationGenerator('j-spring.Method',{},Method);

export const Paramter = (name:string) => paramterAnnotationGenerator('j-spring.Paramter',name,{},Paramter);
