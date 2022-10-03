import {Anntation} from "j-spring";

export const isFunction = (val:unknown) :val is Function => typeof val === 'function';

export interface ExpressLoad {
    load(app:any):void;
}

//express App 配置
export interface ExpressConfiguration extends ExpressLoad {
    load(app: any):void;
    isExpressConfiguration():boolean;
}

export function isExpressConfiguration(bean:any){
    const ec = bean as ExpressConfiguration;
    return isFunction(ec.load) && isFunction(ec.isExpressConfiguration) && ec.isExpressConfiguration();
}


//参数拦截操作操作
export interface SpringWebParamInteceptor<T> {

    isSpringWebParamInteceptor():boolean;

    //获取注解
    getAnnotation():Function;

    //导出bean
    getBean(req:any,res:any,paramterAnnotation:Anntation):Promise<T> | T;

    //业务执行出错  如何销毁bean
    error(bean:T):void;

    //业务执行成功
    success(bean:T):void;
}

export function isSpringWebParamInteceptor(bean:any){
    const t = bean as SpringWebParamInteceptor<any>;
    return t && isFunction(t.getAnnotation) && 
            isFunction(t.getBean) && 
            isFunction(t.success) &&
            isFunction(t.error) && 
            isFunction(t.isSpringWebParamInteceptor) 
            && t.isSpringWebParamInteceptor();
}

//错误信息
export type errorInfo = {
    code:number,
    error:string,
    sendType:string
}

//SpringWeb 异常处理
export interface SpringWebExceptionHandler {

    isSpringWebExceptionHandler():boolean;

    //异常处理
    hanlder(req:any,res:any,errorInfo:errorInfo,next?:Function):void;

}

export function isSpringWebExceptionHandler(bean:any):boolean{
    const t= bean as SpringWebExceptionHandler;
    return t && isFunction(t.hanlder) && isFunction(t.isSpringWebExceptionHandler) && t.isSpringWebExceptionHandler();
}