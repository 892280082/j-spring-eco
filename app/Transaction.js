const {SpringProxy} = require('../spring')

/**
	类似于后置处理类 排序在第10 （从1开始正序）
	对拥有@Repository注解的bean进行功能提升
*/

//@Proxy(sort=10,annotation=Repository)
class Transaction {

	doProxy(beanDefine,bean){

		/**
			这里用的我自己写的代理类，原生的不太好用
			这里beanDefine可以拿到注解的方法和字段 
			可以增加更多的操作 
			例如只代理增加了@Transactional注解的方法
		*/

		return new SpringProxy(bean,{


			method(obj,method,args){
				console.log("方法拦截开始----------");

				//obj[method].apply(obj,args)

				args[0] = `${args[0]} world!`

				SpringProxy.invoke(obj,method,args)

				console.log("方法拦截结束----------");
			}

		});

	}


}

module.exports = {Transaction}