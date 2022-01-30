

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

	//原生bean
	bean;

	//代理信息
	proxyInfo;

	constructor(bean,proxyInfo){
		this.bean = bean;
		this.proxyInfo = proxyInfo;

		if(this.proxyInfo.method)
			this.addProxyMethod();
	}

	addProxyMethod(){
		const structor = this.bean.constructor;
		if(!structor)
			throw `the bean no constructor:${this.bean}`

 		Object.getOwnPropertyNames(structor.prototype)
 			.filter(p => p !== "constructor" && typeof structor.prototype[p] === 'function' )
 			.forEach(p => {
 				this[p] = function(){
 					const args = Array.prototype.slice.apply(arguments);
 					return this.proxyInfo.method(new InvokeBean(this.bean,p,args),p,args);
 				}.bind(this)
 			})
	}

	static invoke(obj,method,args){
		return obj[method].apply(obj,args);
	}

} 


module.exports = {SpringProxy}
