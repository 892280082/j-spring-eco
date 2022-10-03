import {Clazz,BeanDefine,Anntation, MethodDefine,FieldDefine, ParamterDefine}  from './SpringType'

import { beanDefineList,assemble,beanFactoryInit,starterBeanList, assemblelazyAutowiredList, validateassemblelazyAutowiredListIsSuccess} from './SpringFactry'
import { isFunction } from './shared';
import { extendClazzBeanMap } from './SpringFactry'


//用于debug记录 注解启动顺序
//let index=0;
function printIndex(..._args:any){
    // console.log(++index);
    // console.log.apply(console,args)
}

//用于交换定义
class SwapBeanDefine {
    
    bd:BeanDefine;

    //上次扫描缓存,用于多注解套入一个字段

    _lastBeanDefine:BeanDefine | null;

    _lastCLazz:Clazz | null;

    _lastMethodDefine:MethodDefine | null;

    _lastFieldDefine:FieldDefine | null;

    _paramterDefineList:ParamterDefine[] = [];

    constructor(){
        this.reset();
    }
    
    reset(){
        this.bd = new BeanDefine(SwapBeanDefine);
        this._lastBeanDefine = null;
        this._lastCLazz = null;
        this._lastMethodDefine = null;
        this._lastFieldDefine = null;
    }

    copy(target:BeanDefine){
        //优先装入缓存的beanDefine中
        if( this._lastBeanDefine && this._lastCLazz &&  this._lastCLazz == target.clazz){
            this._lastBeanDefine.annotationList.push(target.annotationList[0])
            return this._lastBeanDefine;
        }else{
            //复制属性
            target.fieldList = this.bd.fieldList;
            target.methodList = this.bd.methodList;
            this.reset();
            //记录缓存
            this._lastBeanDefine = target;
            this._lastCLazz = target.clazz;
            return target;
        }
    }

    addMethod(methodDefine:MethodDefine){
        if(this._paramterDefineList.length > 0){
            methodDefine.paramterDefineList = this._paramterDefineList;
            this._paramterDefineList = [];
        }
        //优先装配到上一次的方法
        if(this._lastMethodDefine?.name == methodDefine.name){
            this._lastMethodDefine.annotationList.push(methodDefine.annotationList[0])
        }else{
            this.bd.methodList.push(methodDefine);
             //记录缓存
            this._lastMethodDefine = methodDefine;
        }
    }

    addField(fieldDefine:FieldDefine){
        //优先装配到上一次的字段
        if(this._lastFieldDefine?.name == fieldDefine.name){
            this._lastFieldDefine.annotationList.push(fieldDefine.annotationList[0])
        }else{
            this.bd.fieldList.push(fieldDefine);
             //记录缓存
            this._lastFieldDefine = fieldDefine;
        }
    
    }

    addPatamter(paramter:ParamterDefine){
        this._paramterDefineList.push(paramter);
    }

}

//交换实例
const swapBeanDefine = new SwapBeanDefine();

//触发注册组件事件
export function triggerClassAnnotation(clazz:Clazz,annotation:Anntation){
    printIndex('class-annotation',clazz,annotation)

    const bd = swapBeanDefine.copy(new BeanDefine(clazz,annotation));

    //添加到bd定义集合
    beanDefineList.add(bd);

    // //如果是Id定义，则添加映射
    // if(annotation.clazz == ComponentId){
    //     const id = (annotation.params as ComponentIdParam).id;
    //     if(idBeanDefineMap.has(id)){
    //         throw Error(`componentId '${id}' conflict!`)
    //     }
    //     idBeanDefineMap.set(id,bd);
    // }
    
}


export function triggerFieldAnnotation(name:string,annotation:Anntation){
    printIndex('field-annotation',annotation)
    swapBeanDefine.addField(new FieldDefine(name,[annotation]))
}

export function triggerMethodAnnotation(name:string,annotation:Anntation){
    printIndex('method-annotation',annotation)
    swapBeanDefine.addMethod(new MethodDefine(name,[annotation]))
}

export function triggerParamterAnnotation(name:string,index:number,annotation:Anntation){
    printIndex('paramter-annotation',annotation)
    swapBeanDefine.addPatamter(new ParamterDefine(name,index,[annotation]))
}


type BootApp = {main:Function}



function getBootAppBean (clazz:Clazz):BootApp{

    beanFactoryInit();

    const app = assemble(clazz);

    const bootApp = app as BootApp;

    if(!isFunction(bootApp.main)){
        throw Error(`not find main method from class ${clazz}`)
    }
    
    return app;
}


export async function invokeStarter():Promise<any>{
    const starterBeanArray = Array.from(starterBeanList);
    for (let index = 0; index < starterBeanArray.length; index++) {
        const element = starterBeanArray[index];
        await element.doStart(extendClazzBeanMap)
        //每次启动结束一个starter 都尝试装配一次
        assemblelazyAutowiredList();
    }
    //最后校验 装配是否成功
    validateassemblelazyAutowiredListIsSuccess();
}

export async function launchAsync(clazz:Clazz,args?:any[]):Promise<any> {
    const bootApp = getBootAppBean(clazz);
    await invokeStarter();
    return bootApp.main.apply(bootApp,args||[])
}


export function launch(clazz:Clazz,args?:any[]){
    const bootApp = getBootAppBean(clazz);

    if(starterBeanList.size > 0){
        throw Error(`found starter bean.please use asyncLaunch method!`)
    }

    validateassemblelazyAutowiredListIsSuccess();

    return bootApp.main.apply(bootApp,args||[])

}
