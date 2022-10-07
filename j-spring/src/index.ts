import { launch,invokeStarter,launchAsync } from './SpringContext'
import { loadResourceConfig } from './SpringResource'
import { Clazz } from './SpringType'
import {  
    cleanBeanCache, 
    replaceClazz,
    addExtBeanClazz,
    getBean,
    SpringStarterClazz,
    beanFactoryInit,
    getBeanFromContainer 
} from './SpringFactry'
import { 
    classAnnotationGenerator,
    fieldAnnotationGenerator,
    methodAnnotationGenerator,
    paramterAnnotationGenerator
} from './SpringAnnotation'


export * from './shared'
export * from './SpringAnnotation'
export * from './SpringContext'
export * from './SpringType'
export { 
    SpringBean,
    BeanPostProcessor,
    getBeanDefineByClass,
    getBeanDefineByBean,
    SpringContainer,
    replaceClazz,
    getBean,
    SpringStarter,
    assemble,
    cleanBeanCache } from './SpringFactry'
export { loadResourceConfig } from './SpringResource'
export {SpringFactoryBean,isSpringFactoryBean } from './SpringFactoryBean'

class SpringPanel {
    
    classAnnotationGenerator=classAnnotationGenerator;
    fieldAnnotationGenerator=fieldAnnotationGenerator;
    methodAnnotationGenerator=methodAnnotationGenerator;
    paramterAnnotationGenerator=paramterAnnotationGenerator;


    loadConfig(data:any){
        loadResourceConfig(data);
        return this;
    }

    launch(clazz:Clazz,args?:any[]){
        return launch(clazz,args)
    }

    launchAsync(clazz:Clazz,args?:any[]):Promise<any>{
        return launchAsync(clazz,args);
    }

    replaceClass<T,E extends T>(clazz:new()=>T,target:new()=>E):SpringPanel{
        replaceClazz(clazz,target)
        return  this;
    }

    clear(){
        cleanBeanCache()
        return this;
    }

    starter(...clazzList:SpringStarterClazz[]){
        return this.bindList(clazzList);
    }

    starterList(clazzList:SpringStarterClazz[]){
        return this.bindList(clazzList);
    }

    bindList(clazzList:Clazz[]){
        clazzList.forEach(addExtBeanClazz)
        return this;
    }

    bindModule(module:(Clazz[])[]){
        module.forEach(this.bindList)
        return this;
    }

    bind(...clazzList:Clazz[]){
        return this.bindList(clazzList);
    }

    getBean<T>(clazz:new()=>T):T{
        return getBean(clazz);
    }

    getBeanFromContainer<T>(clazz:new()=>T):T|undefined{
        return getBeanFromContainer(clazz);
    }

    invokeStarter():Promise<any>{
        beanFactoryInit();
        return invokeStarter();
    }
}

export const spring = new SpringPanel();