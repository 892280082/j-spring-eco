import { Anntation, assemble, BeanDefine, Clazz, getBeanDefineByClass, MethodDefine } from "j-spring";
import path from "path";
import { 
    Controller, 
    Get,
    Json,
    ResponseBody,
    ParamterParamType, 
    PathVariable, 
    Post, 
    RequestMapping,
    RequestParam, 
    ExpressMiddleWare, 
    MappingParam,
    Param,
    SessionAttribute,
    ApiMiddleWare,
    MiddleWareParam,
    MiddleWare,
    Shuttle ,
    middleWareType
} from "./springWebAnnotation";
import {ExpressLoad,SpringWebParamInteceptor,SpringWebExceptionHandler} from './springWebExtends'
//参数处理器
export const paramInterceptor:SpringWebParamInteceptor<any>[] = [];

type paramContainer = {
    inteceptor:SpringWebParamInteceptor<any>|undefined,
    bean:any
}

type MethodRouterParm = {
    bean:any,
    bd:BeanDefine,
    md:MethodDefine
    exceptionHandler:()=>SpringWebExceptionHandler
}


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
        return req.query[name];
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
        return req.params[name];
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
        return v;
    }
    
}


paramInterceptor.push(new RequestParamParamInteceptor());
paramInterceptor.push(new PathVariableParamInteceptor());
paramInterceptor.push(new ParamInteceptor());
paramInterceptor.push(new SessionAttributeInteceptor());

class MethodRouter {

    hasShuttle:boolean;
    hasGet:boolean;
    hasPost:boolean;
    hasRequestMapping:boolean;

    invokeMethod:string;//get post use 

    sendType:string;//json html

    reqPath:string;//请求路径

    maxParamLength:number;//最大参数数量

    middleWareFunction:Function[];//中间件函数

    error(msg:string){
        throw new Error(`class:${this.option.bd.clazz} method:${this.option.md.name} router analysis error:${msg}`);
    }

    private resolveInokeMethod():string{
        if(this.hasRequestMapping)
            return 'use';
        if(this.hasGet && this.hasPost)
            return 'use';
        if(this.hasGet)
            return 'get';
        if(this.hasPost)
            return 'post';
        this.error('_resolveInokeMethod error')
        return '';
    }

    private resolveSendType():string {
        const {bd,md} = this.option;
        if(bd.hasAnnotation(Json) || md.hasAnnotation(ResponseBody))
            return 'json';
        return 'html';
    }
    
    private resolveReqPath():string {
        const {bd,md} = this.option;
        const ctrParam = bd.getAnnotation(Controller)?.params as MappingParam;
        const ctrPath = ctrParam.path;
        if(isEmpty(ctrPath)){
            this.error('resolveReqPath @Controller path not to be empty')
        }
        const ctrMiddleWare = (bd.getAnnotation(ApiMiddleWare)?.params as MiddleWareParam)?.middleWareClassList || [];

        const mp = (md.getAnnotation(Get) || md.getAnnotation(Post) || md.getAnnotation(RequestMapping))?.params as MappingParam
       
        const mdPath = mp.path || md.name;

        const methodMiddleWare =( md.getAnnotation(MiddleWare)?.params as MiddleWareParam)?.middleWareClassList || [];

        this.middleWareFunction = this.resolveMiddleWareFunction(ctrMiddleWare.concat(methodMiddleWare));

        return  path.join('/',ctrPath,mdPath).replace(/\\/g,`/`);
    }

    private resolvePamaterLength():number{
        let i =0;
        this.option.md.paramterDefineList.forEach(p => {
            i = Math.max(i,p.index);
        })
        return i+1;
    }

    private resolveMiddleWareFunction(oriMiddleWare:middleWareType[]):Function[]{
         const reuslt = oriMiddleWare.map(oriWare => {
            if(getBeanDefineByClass(oriWare as Clazz)){
                const bean = assemble(oriWare as Clazz);
                const invoke = (bean as ExpressMiddleWare).invoke;
                invoke.bind(bean);
                return invoke;

            }else{
                return oriWare as Function;
            }
        });
        return reuslt;
    }

    async getInvokeParams(req:any,res:any):Promise<paramContainer[]>{
        const {md} = this.option;
        const params:paramContainer[] = [];

        //填充所有参数
        for(let i=0;i<this.maxParamLength;i++)
            params.push({bean:undefined,inteceptor:undefined});

        //每个字段匹配第一个可以处理的注解
        for (let pdi = 0; pdi < md.paramterDefineList.length; pdi++) {
            const paramterDefine = md.paramterDefineList[pdi];
            for (let ai = 0; ai < paramterDefine.annotationList.length; ai++) {
                const an:Anntation =  paramterDefine.annotationList[ai];
                const pi = paramInterceptor.find(pi => pi.getAnnotation() === an.clazz)
                if(pi){
                    let bean;
                    try{
                        const tempBean =  pi.getBean(req,res,an);
                        bean = tempBean instanceof Promise ? await tempBean : tempBean;
                    }catch(e){
                        //如果获取异常 则执行销毁
                        params.forEach(p => p.inteceptor?.error(p.bean));
                        throw e;
                    }
                    params[paramterDefine.index] = {bean,inteceptor:pi};
                }
            }
        }

        return params;

    }

    constructor(public option:MethodRouterParm){
        const {md,bd} = option;
        this.hasShuttle = bd.hasAnnotation(Shuttle); 
        this.hasGet = md.hasAnnotation(Get);
        this.hasPost = md.hasAnnotation(Post);
        this.hasRequestMapping = md.hasAnnotation(RequestMapping);
        this.invokeMethod = this.resolveInokeMethod();
        this.sendType = this.resolveSendType();
        this.reqPath = this.resolveReqPath();
        this.maxParamLength = this.resolvePamaterLength();
    }

    loadNormalApi(app:any){
        const {md,bean,exceptionHandler} = this.option;
        const { invokeMethod,sendType,reqPath,middleWareFunction } =this;

        //代理的函数
        const proxyFunction = async (req:any,res:any) => {

            let params:paramContainer[] = [];//参数
            let result:any;//业务计算结果

            //统一错误处理
            const wrapHandler = (code:number,e:unknown) => {
                params.forEach(p => p.inteceptor?.error(p.bean));
                exceptionHandler().hanlder(req,res,{code,error:e as string,sendType})
            }

            //1.处理参数反射阶段
            try{
                params = await this.getInvokeParams(req,res);
            }catch(e){
               return wrapHandler(400,e);
            }
            
            try{

                //2.业务处理阶段
                const paramBeans = params.map(p => p.bean);
                result = await bean[md.name].apply(bean,paramBeans);

                //3.渲染阶段
                switch(sendType){
                    case 'json':
                         res.json(result);
                        break;
                    case 'html':
                        if(Array.isArray(result)){
                            res.render(result[0],result[1]||{})
                        }else{
                            wrapHandler(500,'sendType:html only support array');
                        }
                        break;
                    default:
                        wrapHandler(500,`sendType error:${sendType}`);
                }

                params.forEach(p => p.inteceptor?.success(p.bean));

            }catch(e){
                wrapHandler(500,e);
            }

        }

        //执行的方法
        const appMethod = app[invokeMethod];

        appMethod.apply(app,[reqPath,...middleWareFunction,proxyFunction])
    }

    /**
     * 只支持post请求，将body中的参数
     * 
     */
    loadShuttleApi(app:any){

        const {md,bean,exceptionHandler} = this.option;
        const {reqPath,middleWareFunction } =this;

        const proxyFunction =async (req:any,res:any) => {
            if(req.body === void 0){
                throw 'please use body-parse middleWare or add BodyParseConfiguration'
            }
            const {args} = req.body;
            try{
                const result = await bean[md.name].apply(bean,[...args,{req,res}]);
                res.json(result);
            }catch(e){
                exceptionHandler().hanlder(req,res,{code:500,sendType:'POST',error:`[SHUTTILE] ${e}`})
            }
        }

        app.post(reqPath,[...middleWareFunction,proxyFunction])

    }

    loadExpressApp(app:any){

        if(this.hasShuttle){
            this.loadShuttleApi(app);
        }else{
            this.loadNormalApi(app);
        }
        
    }

}

const isEmpty = (str:string) => typeof str === 'string' && str === '';

function hasTargetAnnotation(md:MethodDefine){
    return md.hasAnnotation(Get) || md.hasAnnotation(Post) || md.hasAnnotation(RequestMapping);
}

//controller配置
export class ControllerBeanConfiguration implements ExpressLoad {

    methodRouter:MethodRouter[] = [];
    

    constructor(public bean:any,public bd:BeanDefine,public exceptionHandler:()=>SpringWebExceptionHandler){

        bd.methodList.filter(hasTargetAnnotation).forEach(md => {

            this.methodRouter.push(new MethodRouter({bean,bd,md,exceptionHandler}))

        })

    }

    //加载express app
    load(_app: any): void {
        //注册所有路由
        this.methodRouter.forEach(m => m.loadExpressApp(_app))
        //注册错误处理路由
        _app.use((err:any,req:any,res:any,next:Function) => {

            this.exceptionHandler().hanlder(req,res,{code:req.statusCode || 500,sendType:'get',error:err},next)

        })
    }
}
