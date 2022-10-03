import { isFunction } from "./shared";

export interface  SpringFactoryBean<T> {

    isSpringFactoryBean():boolean;

    getBean():T;

}

export function isSpringFactoryBean(bean:SpringFactoryBean<any>){
    return bean && isFunction(bean.getBean) && isFunction(bean.isSpringFactoryBean) && bean.isSpringFactoryBean();
}

export function loadFactoryBean(bean:any,fieldName:string,factoryBean:SpringFactoryBean<any>):void{


    Object.defineProperty(bean,fieldName,{
        get() {
            return factoryBean.getBean();
        }
    })


}