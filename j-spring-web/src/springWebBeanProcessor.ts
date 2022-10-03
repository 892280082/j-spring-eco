import { Autowired, BeanDefine, BeanPostProcessor, Component } from "j-spring";
import { Controller } from "./springWebAnnotation";
import {ControllerBeanConfiguration,paramInterceptor} from './springWebRouterDelegate'
import { ExpressLoad,isExpressConfiguration,SpringWebExceptionHandler,isSpringWebExceptionHandler} from './springWebExtends'
import { SpringWebExceptionHandlerConfigration } from './springWebConfiguration'
import {isSpringWebParamInteceptor} from './springWebExtends'

//解析的bean集合
const configureBeanList = new Set<ExpressLoad>();

//运行结束时清空
export const loadConfiguration = (app:any)=>{
    configureBeanList.forEach(config => config.load(app));
    configureBeanList.clear();
}




/**
 * 用于设置express的配置
 * 
 */
@Component()
export class ExpressAppEnhanceBeanProcessor implements BeanPostProcessor {

    getSort(): number {
        return 99;
    }

    postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine): Object {
        return bean;
    }


    postProcessAfterInitialization(bean: any, _beanDefine: BeanDefine): Object {

        if(isExpressConfiguration(bean)){
            configureBeanList.add(bean);
        }

        return bean;
        
    }

}





/**
 * 用于设置express的路由
 */
 @Component()
export class ControllerBeanProcessor implements BeanPostProcessor {


    @Autowired({type:isSpringWebExceptionHandler,force:false})
    exceptionHanlder:SpringWebExceptionHandler = new SpringWebExceptionHandlerConfigration();

    getSort(): number {
        return 100;
    }

    postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine): Object {
        return bean;
    }


    postProcessAfterInitialization(bean: any, beanDefine: BeanDefine): Object{

        if(beanDefine.hasAnnotation(Controller)){
                configureBeanList.add(new ControllerBeanConfiguration(bean,beanDefine,()=>this.exceptionHanlder))
        }

        return bean;
        
    }

}

/**
 * 用于设置express router中参数的处理器
*/
@Component()
export class SpringParamterBeanPostProcessor implements BeanPostProcessor {
    getSort(): number {
        return 100;
    }
    postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine): Object {
        return bean;
    }
    postProcessAfterInitialization(bean: any, _beanDefine: BeanDefine): Object {
        if(isSpringWebParamInteceptor(bean)){
            paramInterceptor.push(bean);
        }
        return bean;
    }
}

