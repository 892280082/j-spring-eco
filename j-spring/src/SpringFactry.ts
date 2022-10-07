import {Anntation, BeanDefine, Clazz, FieldDefine, ReflectParam}  from './SpringType'
import { Autowired,AutowiredParam,Value, ValueParam } from './SpringAnnotation'
import { geFormatValue, hasConfig } from './SpringResource'
import { isFunction } from './shared';
import { isSpringFactoryBean,loadFactoryBean, SpringFactoryBean } from './SpringFactoryBean'

//对象缓存
const beanDefineMap = new Map<BeanDefine,any>()

//后置处理器集合
const beanPostProcessorList = new Set<BeanPostProcessor>();

//装配中的类 防止循环引用
const assembleingClass = new Set<Clazz>();

//额外绑定的class，防止类信息被treeshake掉
const bindBeanClazzList = new Set<Clazz>();

//实例化的启动的bean
export const starterBeanList = new Set<SpringStarter>();

//绑定的beanProcessor class
const bindBeanProcessorClazzList = new Set<new()=>BeanPostProcessor>();

//bean定义集合
export const beanDefineList = new Set<BeanDefine>([]);

//id映射
export const idBeanDefineMap = new Map<string,BeanDefine>()

type LazyAutowired = {
    clazz?:Clazz;
    type?:(bean:any)=>boolean;
    force:boolean
    bd:BeanDefine
    fieldBd:FieldDefine
    state:number //0 为装配 1默认值 2已经装配
}

//追加的的class和bean的映射
export const extendClazzBeanMap = new Map<Clazz,any>();

let lazyAutowiredList:LazyAutowired[] = [];

//bean的生命周期函数
export interface SpringBean {
    // [SpringEnum.__isPringBean__]:true
     //当属性装配完毕
     onAttrMounted():void;
}

export type SpringStarterClazz = new()=>SpringStarter;

export  interface SpringStarter {
    isSpringStater():boolean;
    //启动
    doStart(clazzMap:Map<Clazz,any>):Promise<any>;
}


//bean的后置处理器 用来做AOP
export interface BeanPostProcessor  {

    //获取序号
    getSort():number;

    //属性装配之前
    postProcessBeforeInitialization(bean:any,beanDefine:BeanDefine):Object

    //属性装配之后
    postProcessAfterInitialization(bean:any,beanDefine:BeanDefine):Object

}

function isSpringStarter(starter:SpringStarter):boolean {
    return starter && isFunction(starter.doStart) && isFunction(starter.isSpringStater) && starter?.isSpringStater();
}

function isBeanPostProcessorClass(clazz:Clazz):boolean{
    const post = new clazz() as BeanPostProcessor
    return isFunction(post.getSort) && isFunction(post.postProcessAfterInitialization) && isFunction(post.postProcessBeforeInitialization);
}

//根据类获取定义
export const getBeanDefineByClass = function(clazz:Clazz):BeanDefine|undefined{
    return Array.from(beanDefineList).find(b => b.clazz == clazz);
}

//替换类
export function replaceClazz<T,E extends T>(clazz:new()=>T,target:new()=>E):number{

    const fieldDefineList:FieldDefine[] = Array.from(beanDefineList).map(bd => bd.fieldList).reduce((s,v)=> s.concat(v),[]);
    const allFieldAnnotation:Anntation[] = fieldDefineList.map(f => f.annotationList).reduce((s,v)=> s.concat(v) ,[]);

    const matchAnnotation = allFieldAnnotation.filter(a => a.clazz === Autowired).filter(a => (a.params as AutowiredParam<any>).clazz == clazz)

    if(matchAnnotation.length == 0)
        throw Error(`[ReplaceClazzError] not match class ${clazz}`)

    matchAnnotation.forEach(a => (a.params as AutowiredParam<any>).clazz = target)

    return matchAnnotation.length;
    
}

//根据bean获取定义
export const getBeanDefineByBean = function(bean:any):BeanDefine|null{
    
    let bd:BeanDefine|null = null;

    beanDefineMap.forEach((mapBd,mapBean) => {

        if(mapBean === bean)
            bd = mapBd;

    })

    return bd;
}

//spring上下文
export abstract class SpringContainer {
    getBeanDefineMap(){
        return beanDefineMap;
    }
    getBeanPostProcessor(){
        return getSoredBeanPostProcessorList()
    }
} 

//检测是否装配结束
function isAssembleComplete(){
    return assembleingClass.size === 0;
}

//根据类型装配
export function assemblelazyAutowiredList(){

    //获取需要装配的类
    const needAutowiredList = lazyAutowiredList.filter(a => a.state < 2);

    // 将beanMap（Component注解装配）中的按需装配给type
    // 将extendBean（SpringStarter手动装配的）按需装配给clazz 和 type
    if(needAutowiredList.length > 0){

        const allBeans = Array.from(beanDefineMap.values());

        const extAllBeans = Array.from(extendClazzBeanMap.values());

        lazyAutowiredList.forEach(at => {
    
            const {bd,force,type,clazz,fieldBd} = at;
    
            //被装配的bean
            const selfBean = beanDefineMap.get(bd);
    
            let findBean:any;

            if(type){

                findBean = allBeans.concat(extAllBeans).map(bean => {
                    if(isSpringFactoryBean(bean)){
                        return (bean as SpringFactoryBean<any>).getBean();
                    }
                    return bean;
                }).filter(b => !!b).find(type);

            }else if(clazz){
                if(extendClazzBeanMap.has(clazz)){
                    findBean = extendClazzBeanMap.get(clazz);
                }
            }else{
                throw 'clazz type must set one!'
            }

            if(findBean){

                //如果匹配的bean是一个函数 则调用反射机制
                if(isFunction(findBean)){
                    Object.defineProperty(selfBean,fieldBd.name,{
                        get() {
                            return findBean();
                        }
                    })
                }else{
                //普通对象则直接注入
                    Reflect.set(selfBean,fieldBd.name,findBean);
                }
    
                //装配成功
                at.state = 2;
    
            }else {
    
                if(!force && selfBean[fieldBd.name] !== void 0){
                    //非强制状态 并且拥有默认值
                    at.state = 1;
                }
            }
    
        })

    }






}

//如果未装配成功 则打印错误信息 退出程序 用于装配末尾执行
export function validateassemblelazyAutowiredListIsSuccess(){
    const needAutowiredList = lazyAutowiredList.filter(a => a.state === 0);
    if(needAutowiredList.length > 0){
     
        const infos = needAutowiredList.reduce((s,at) => {
           return s + `class ${at.bd.clazz} field:${at.fieldBd.name} autowired by type error.not match.`
        },'')

        throw(infos)
    }
}

//调用springBean的生命周期方法
function invokeSpringBeanMethod(){
    const allBeans = Array.from(beanDefineMap.values())
    allBeans.forEach(bean => (bean as SpringBean).onAttrMounted?.())
}

//装配指定class
export const assemble = function (clazz:Clazz){

    const bd = getBeanDefineByClass(clazz)

    if(!bd){
        throw Error(`can not find class ${clazz},maybe you forgot to add @Component()!`)
    }

    const app = assembleBeanDefine(bd);

    //整体装配结束后
    if(isAssembleComplete()){
        assemblelazyAutowiredList();
        invokeSpringBeanMethod();
    }

    return app;
}


//获取排序好的后指处理器
function getSoredBeanPostProcessorList():BeanPostProcessor[]{
    return Array.from(beanPostProcessorList).sort((v1,v2) => v1.getSort()-v2.getSort());
}

//装配指定beanDefine
function assembleBeanDefine(bd:BeanDefine):any{

    if(beanDefineMap.has(bd))
        return beanDefineMap.get(bd);

        //防止循环引用 加入装配记录
    if(assembleingClass.has(bd.clazz))
        throw Error(`clazz ${bd.clazz} already assemble`)

    assembleingClass.add(bd.clazz);

    //实例化对象 只支持无参构造器
    let bean = new bd.clazz();

    //获取后置处理器
    const beanPostProcessor = getSoredBeanPostProcessorList()

    //bean处理器处理装配前操作
    beanPostProcessor.forEach(post => bean = post.postProcessBeforeInitialization(bean,bd))

    //字段属性装配和注入
    bd.fieldList.forEach(fieldBd => {
      
        const fieldName = fieldBd.name;
        fieldBd.annotationList.forEach(anno => {

            //处理装配 依据class类型
            if(anno.clazz === Autowired){
                const param = anno.params as AutowiredParam<Clazz>;
                const {force,type} = param;
                let {clazz} = param;
                let subApp;
                
                //处理装配 依据id
                // if(id){
                //     const targetBd = idBeanDefineMap.get(id);
                //     if(!targetBd){
                //         throw Error(`[ID_NOT_FIND_ERROR] @Component()Id('${id}') not find!`)
                //     }
                //     if(clazz !== targetBd.clazz){
                //         throw Error(`[CLAZZ_MATCH_ERROR] id '${id}' class must be ${clazz}` )
                //     }
                //     subApp = assembleBeanDefine(targetBd)
                // }

                //依据类型推断进行装配
                if(type){
                    lazyAutowiredList.push({
                        type,
                        force:!!force,
                        bd,
                        fieldBd,
                        state:0
                    })
                    return;
                }
                
                clazz = clazz || (param as ReflectParam).reflectType;

                if(clazz){
                    const subBeanDefine = getBeanDefineByClass(clazz)
                    if(subBeanDefine){
                        subApp = assembleBeanDefine(subBeanDefine);
                    }else{
                        lazyAutowiredList.push({
                            clazz,
                            force:!!force,
                            bd,
                            fieldBd,
                            state:0
                        })
                        return;
                    }
                   
                }

                if(subApp){
                    //如果是工厂bean
                    if(isSpringFactoryBean(subApp)){
                        //使用工厂导入
                        loadFactoryBean(bean,fieldName,subApp)
                    }else{ //普通bean
                        // const subApp = assemble(param.clazz);
                        if(!Reflect.set(bean,fieldName,subApp)){
                            throw Error(`[REFLECT_PROPERTY_SET_ERROR]:class:${clazz} field:${fieldName}`)
                        }
                    }
                }
  
            }

            //处理属性注入
            if(anno.clazz === Value){
                const param = anno.params as ValueParam;

                //如果不是强制赋值 并且没有配置参数
                if(!param.force && !hasConfig(param.path)){
                    
                    if(bean[fieldName] === void 0){
                        throw Error(`class:${bd.clazz} field:${fieldName} must be set initial value!`)
                    }

                }else if(!Reflect.set(bean,fieldName,geFormatValue(param.path,param.type))){
                    throw Error('annotation Value error')
                }
            }
        })
    });

    //bean处理器处理装配后操作
    beanPostProcessor.forEach(post => bean = post.postProcessAfterInitialization(bean,bd))

    if(isSpringStarter(bean)){
        starterBeanList.add(bean);
    }

    //删除引用
    assembleingClass.delete(bd.clazz);

    beanDefineMap.set(bd,bean);

    return bean;
}

//清空工厂的引用 主要测试使用
export const cleanBeanCache = ()=>{

    beanDefineMap.clear();

    starterBeanList.clear();

    lazyAutowiredList = [];

}

//绑定额外的class
export const addExtBeanClazz = (clazz:Clazz)=>{

    if(isBeanPostProcessorClass(clazz)){
        bindBeanProcessorClazzList.add(clazz)
    }else{
        bindBeanClazzList.add(clazz);
    }
  
}



//实例化所有额外的class
const instanceExtClazz = ()=>{
    Array.from(bindBeanClazzList).map(assemble);
}

//实例化后置处理器
const instanceBeanPostProcessor = ()=>{
    Array.from(bindBeanProcessorClazzList).map(assemble).forEach(b => beanPostProcessorList.add(b))
}

//装配bean
export function getBean<T>(clazz:new()=>T):T{
    beanFactoryInit();
    const b = assemble(clazz);
    validateassemblelazyAutowiredListIsSuccess();
    return b;
}

export function getBeanWithCache<T>(clazz:new()=>T):T|undefined{
    const bd = getBeanDefineByClass(clazz);
    if(bd){
        return beanDefineMap.get(bd);
    }else{
        return extendClazzBeanMap.get(clazz);
    }
}

export const beanFactoryInit = ()=>{

    //1.首先实例化后置处理器
    instanceBeanPostProcessor();

    //2.实例化额外绑定的类
    instanceExtClazz();

}