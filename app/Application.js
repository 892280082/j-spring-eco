
//@Proxy(annotation=Service)
class TransactionManager {
	//beanDefine:定义和注解  bean:实例
	doProxy(beanDefine,bean){
		return {
			method(wrapBean,method,args){
				console.log(`TransactionManager: 拦截方法:${method} 参数替换:[${args} => 你好]`);
				return wrapBean.invoke(["你好 "])
			}
		}
	}
}


//@Service
//@BeanInit
class Service {

	//@Value(config.app.msg)
	appMsg;

	say(userMsg){
		return `${userMsg} ${this.appMsg} \n`;
	}

	//@NoProxy
	async appInit(beanDefine){
		console.log("bean初始化");
	}

}

//@SpringBoot
class Application {

	//@SpringFactory
	factory;

	//@Autowired
	service;
	
	main(){
		console.log(this.service.say("hello"))
	}
}

module.exports = {Application,Service,TransactionManager}