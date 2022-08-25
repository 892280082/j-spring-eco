const {setLogSingleton,getLogSingleton,fastLog} = require("../log/SpringLog")
const {addProxyMethod} = require('../util/SpringProxy')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
	检测是否出现了循环引用错误
	因为都是单例模式，所以一个bean只会实例一次 如果重复出现 就会报错
*/
const juageRecurseInject = injectPaths => {
	const length = injectPaths.length;
	if(injectPaths.length >= 3){
		if(injectPaths[length-1] === injectPaths[length-3])
			throw `出现了循环引用:${injectPaths[length-1]} <=> ${injectPaths[length-2]}`
	}
}

//缓存bean
class BeanCache {

	cache=[];

	push(beanDefine,bean){
		this.cache.push({beanDefine,bean})
	}


	exist(beanName){
		return this.cache.find(v => v.beanDefine.name === beanName);
	}

	get(beanName){
		const oldCache = this.exist(beanName);
		if(!oldCache)
			throw `no cache bean that name ${beanName}`
		return oldCache.bean;
	}

	getBeanByAnnotation(annotation){
		return this.cache.filter(d => d.beanDefine.hasAnnotation(annotation)).map(d => d.bean)
	}

	getBeanDefineByBean(bean){

		const oldCache = this.cache.find(d => d.bean === bean);
		return oldCache ? oldCache.beanDefine : null;
	}

}

class ProxyEnhance {

	datas = [];

	getBeanList(annotationList){
		return annotationList.map(annotation => {
			return this.datas.filter(d => d.annotation === annotation);
		}).reduce((s,v)=>{
			return [...s,...v]
		},[]);
	}

	//处理的注解 增强的bean
	push(annotation,proxyBean,proxyBeanDefine){
		this.datas.push({proxyBean,annotation,proxyBeanDefine})
	}

	async doEnhance(beanDefine,bean){

		//拿到需要提升bean的所有的注解
		const annotationList = beanDefine.annotation.map(a => a.name);

		//获取能处理直接注解的代理类
		const proxyBeanList = this.getBeanList(annotationList);


		//1.代理原对象方法
		const doProxyBeanList = proxyBeanList.filter(v => typeof v.proxyBean.doProxy === 'function');

		for(let i =0;i<doProxyBeanList.length;i++){

			const {proxyBean,proxyBeanDefine} = doProxyBeanList[i];

			fastLog('ProxyEnhance=>doEnhance','trace',`方法增强:${proxyBeanDefine.name} => ${beanDefine.name}`)

			const proxyInfo = await proxyBean.doProxy(bean,beanDefine)

			bean = addProxyMethod(bean,beanDefine,proxyInfo,proxyBean,proxyBeanDefine);

		}

	  //2.增强原对象
		const doEnhanceBeanList = proxyBeanList.filter(v => typeof v.proxyBean.doEnhance === 'function')
		for(let i =0;i<doEnhanceBeanList.length;i++){

			const {proxyBean} = doEnhanceBeanList[i];

			fastLog('ProxyEnhance=>doEnhance','trace',`bean提升: ${beanDefine.name}`)

			bean = await proxyBean.doEnhance(bean,beanDefine)

		}


		return bean;
	}


}


module.exports = {
  capitalizeFirstLetter,
  juageRecurseInject,
  BeanCache,
  ProxyEnhance
}
