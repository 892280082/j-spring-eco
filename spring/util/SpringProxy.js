

class InvokeBean {
	bean;
	method;
	args;
	constructor(bean,method,args){
		this.bean = bean;
		this.method =method;
		this.args = args;
	}
	invoke(args){
		return SpringProxy.invoke(this.bean,this.method,args);
	}
}

class SpringProxy {

	//BeanDefine 信息
	beanDefine;

	//原生bean
	bean;

	//代理信息
	proxyInfo;

	constructor(beanDefine,bean,proxyInfo){
		this.beanDefine = beanDefine;
		this.bean = bean;
		this.proxyInfo = proxyInfo;

		if(this.proxyInfo.method)
			this.addProxyMethod();
	}

	addProxyMethod(){
		const structor = this.bean.constructor;
		if(!structor)
			throw `the bean no constructor:${this.bean}`

		//复制除了函数的所有属性
		for(let p in this.bean){
			if(typeof this.bean[p] !== 'function')
				this[p] = this.bean[p];
		}

		//替换方法
 		Object.getOwnPropertyNames(structor.prototype)
 			.filter(p => p !== "constructor" && typeof structor.prototype[p] === 'function' )
 			.forEach(p => {

				const args = Array.prototype.slice.apply(arguments);

				//该方法上存在@NoProxy注解，则不进行代理
 				const methodDefine = this.beanDefine.getMethod(p);
 				if(methodDefine && methodDefine.hasAnnotation("NoProxy")){
 					this[p] = function(){ 
 						return this.bean[p].apply(this.bean,args);
 					}
 					return;
 				}

 				this[p] = function(){
 					return this.proxyInfo.method(new InvokeBean(this.bean,p,args),p,args);
 				}.bind(this)
 			})
	}

	static invoke(obj,method,args){
		return obj[method].apply(obj,args);
	}

} 


module.exports = {SpringProxy}
