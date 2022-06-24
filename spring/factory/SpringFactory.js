const {SpringResource} = require("../resource/SpringResource")
const {sacnnerArgs} = require("../scaner/scaner")
const {addProxyMethod} = require('../util/SpringProxy')
const {setLogSingleton,getLogSingleton,fastLog} = require("../log/SpringLog")

//单例模式：缓存自身实例 
let facotryInstance = null;

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

		// //1.代理原对象方法
		// proxyBeanList.filter(v => typeof v.proxyBean.doProxy === 'function').forEach(({proxyBean,proxyBeanDefine}) => {

		// 	fastLog('ProxyEnhance=>doEnhance','trace',`动态代理增强:${proxyBeanDefine.name} => ${beanDefine.name}`)

		// 	const proxyInfo = proxyBean.doProxy(bean,beanDefine)

		// 	bean = addProxyMethod(bean,beanDefine,proxyInfo,proxyBean,proxyBeanDefine);

		// });


		//2.增强原对象
		// proxyBeanList.filter(v => typeof v.proxyBean.doEnhance === 'function').forEach(({proxyBean,proxyBeanDefine}) =>{

		// 	bean = proxyBean.doEnhance(bean,beanDefine)
			
		// })

		return bean;
	}


}


class SpringFactory {

	/**
		rootPath:"",
		srcList:[],
		tempJsName:"runtemp.js",
		configPaths:"resource",
		inputArgs:[],
	*/
	args;

	//SpringResource
	resource;

	//类型引用管理
	classReferences;

	//bean定义集合
	beanDefineList;

	//bean缓存 默认全部是单例
	beanCache= new BeanCache();

	//代理提升
	proxyEnhance = new ProxyEnhance();

	log;//log instance

	constructor(args,classReferences){
		this.args = args;
		const {configPaths,srcList,SpringLog} = args;
		this.resource = new SpringResource(configPaths);
		const springLog = new SpringLog(this,
			this.resource.getOr("Spring-ioc.log.state","off"),
			this.resource.getOr("Spring-ioc.log.level","debug"));

		//set log instance  
		setLogSingleton(springLog);
		this.log = getLogSingleton("SpringFactory")

		this.log.trace("日志创建成功")
		this.log.trace("启动参数")
		this.log.trace(JSON.stringify(args,null,2))
		this.log.trace("系统配置")
		this.log.trace(JSON.stringify(this.resource.data,null,2))
		
		this.classReferences = classReferences;
		const allClassList = Object.keys(classReferences);
		this.log.trace(`引用类检索信息:${allClassList.length}个`)
		this.log.trace(JSON.stringify(allClassList,null,2))

	
		this.log.trace("扫描并解析依赖文件")
		this.beanDefineList = sacnnerArgs(args)
	}


	/**
	根据beanDefine的name获取bean
	*/
	getBean(beanDefineName){
		return this.beanCache.get(beanDefineName)
	}

	/**
	传入bean获取bean的define	
	*/
	getBeanDefineByBean(bean){
		return this.beanCache.getBeanDefineByBean(bean);
	}


	/**
		根据类名获取bean的定义信息
		String => BeanDefine
		throw 'no beanDefine name {}'
	*/
	getBeanDefineByName(name){
		return this.beanDefineList.find(v => v.name === name);
	}

	/**
	   获取具有指定注解的定义
		String => [BeanDefine]
	*/
	getBeanDefineByAnnotation(annotationName){
		return this.beanDefineList.filter(beanDefine =>  beanDefine.hasAnnotation(annotationName))
	}

	/**
	   根据annotationName获取bean的集合
		String => [bean]
	*/
	async getBeanByAnnotation(annotationName){
		const defineList = this.getBeanDefineByAnnotation(annotationName);
		const outs = [];
		for(let i=0;i<defineList.length;i++){
			const define = defineList[i];
			const bean = await this.assembleBeanByBeanDefine(define);
			outs[i] = bean;
		}
		return outs;
	}

	/**
		根据beanDefine组装bean
	*/
	async assembleBeanByBeanDefine(beanDefine,injectPath=[]) {

		this.log.trace(`装配bean:${beanDefine.name},依赖路劲:${injectPath}`)



		if(this.beanCache.exist(beanDefine.name)){
			return this.beanCache.get(beanDefine.name);
		}


		injectPath.push(beanDefine.name)

		//检测是否出现了 循环引用
		juageRecurseInject(injectPath);

		const {valueInject,beanInject,springFactory,springResource,logInject} = this.args.annotation;

		let bean = new this.classReferences[beanDefine.className]

		for(let i=0;i<beanDefine.fields.length;i++){

			const field = beanDefine.fields[i];

			//字段注入配置文件
			if(field.hasAnnotation(valueInject)){
				const {value,force='true'} = field.getAnnotation(valueInject).param;
				try{
					bean[field.name] = this.resource.getValue(value)
					this.log.trace(`注入配置文件:value:${value},force:${force} => ${bean[field.name]}`)
				}catch(e){
					//如果不存在默认配置 则抛出异常
					if(force === 'true'){
						throw e;
					}
				}
			}

			//字段装配bean
			if(field.hasAnnotation(beanInject)){
				//@Autowired(beanName) beanName默认使用 否则使用字段首字母大写
				const injectAnnotation = field.getAnnotation(beanInject);
				const {value,force='true'} = injectAnnotation.param;
				const injectFieldName = value || capitalizeFirstLetter(field.name);
				const subBeanDefine = this.getBeanDefineByName(injectFieldName);

				this.log.trace(`解析注解:${injectAnnotation.name},注入组件:${injectFieldName},强制:${force},`)



				//注入日志代理
				// if(injectFieldName === logInject){
				// 	bean[field.name] = getLogSingleton(beanDefine.className,beanDefine);
				// 	continue;
				// }

				//注入工厂
				if(injectFieldName === springFactory){
					bean[field.name] = this;
					continue;
				}

				//注入资源类
				if(injectFieldName === springResource){
					bean[field.name] = this.resource;
					continue;
				}

				//不存在Bean定义 并且是强制装配 则报错
				if(!subBeanDefine && force === 'true'){
					throw `bean定义获取失败 类名:${beanDefine.className} 字段:${field.name} 注解:${beanInject} `
				}

				if(subBeanDefine){
					const subBean = await this.assembleBeanByBeanDefine(subBeanDefine,injectPath)
					bean[field.name] = subBean
				}
			}



		}

		//如果该bean存在log字段，并且没有初始值 赋予日志对象
		if(Object.keys(bean).indexOf(logInject) > -1 && typeof bean[logInject] === 'undefined'){
			bean[logInject] = getLogSingleton(beanDefine.className,beanDefine);
		}


		//对bean进行增强提升
 		bean = await this.proxyEnhance.doEnhance(beanDefine,bean);

		//放入缓存
		this.beanCache.push(beanDefine,bean);

		if(bean['beanInit'] && typeof bean['beanInit'] === 'function'){
			await bean.beanInit(beanDefine);
		}

		return bean;
	}

	async loadProxy(){

		const {proxy} = this.args.annotation;

		//获取代理类 并根据从小到大排序
		const beanDefineList = this.getBeanDefineByAnnotation(proxy).sort( (b1,b2) => {
			return (b1.getAnnotation(proxy).param.sort || 100) - (b2.getAnnotation(proxy).param.sort || 100)
		})

		this.log.trace(`代理类总数量:${beanDefineList.length}`)

		for(let i=0;i<beanDefineList.length;i++){

			const beanDefine = beanDefineList[i];

			const targetAnnotation = beanDefine.getAnnotation(proxy).param["bean"]

			if(!targetAnnotation){
				throw `proxy annotation must have bean param`
			}

			const proxyBean = await this.assembleBeanByBeanDefine(beanDefine)

			// if(!proxyBean['doProxy']){
			// 	throw 'the proxyBean must implements doProxy method!'
			// }

			this.proxyEnhance.push(targetAnnotation,proxyBean,beanDefine)


		}

	}

	//1.启动
	async boot(){

		try {

			const {pattern} = this.args;

			const {appBoot} = this.args.annotation;

			const beanDefineList = this.getBeanDefineByAnnotation(appBoot);

			if(beanDefineList.length == 0){
				throw 'error: not find @SpringBoot bean'
			}

			if(beanDefineList.length > 1){
				throw 'error: found more than one @SpringBoot bean'
			}

			//装配结束 放入实例
			facotryInstance = this;

			this.log.trace('实例化代理类')

			//优先实例化代理类
			await this.loadProxy();


			//开始装配
			const bean = await this.assembleBeanByBeanDefine(beanDefineList[0])


			this.log.trace('---------------------容器初始化结束-----------------')

			//启动自动启动注解
			// await this.doBeanInit();1

			const realArgs = pattern === 'shell' ? process.argv.slice(2) : this.args.inputArgs;

			bean.main(realArgs);

			//await this.log.beanInit();

		}catch(e){

			console.log('启动失败',e);

		}

	}


	static getInstance(){
		return facotryInstance;
	}

}

module.exports = {SpringFactory}