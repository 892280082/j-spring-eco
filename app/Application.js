
//代理@Service的bean，并且只针对@Test方法进行代理（可不添加，代理全部）
//@Proxy(bean=Service,method=Test)
class TransactionManager {
	//beanDefine:定义和注解  bean:实例
	doProxy(bean,beanDefine){
		return {
			/**
				wrapBean {
					bean;//bean的名称
					methodFn;//原始函数对象
					methodName;//方法名称
					beanDefine;//bean的定义
					args;//原始参数
					next():object 调用原始参数
					invoke([args]):object 调用指定参数
					getMethodDefine():Method? 获取方法的元注解 可能为空
					getMethodAnnotation():Annotation? 获取注解信息 可能为空
				}
			*/
			method(wrapBean,method,args){
				//替换参数映射
				const mapping = {"hello":" 你好","playing game":"打游戏"};
				
				//测试注解
				const convertArg = mapping[args[0]];
				console.log(`TransactionManager: 拦截方法:${method} 参数替换:[${args} => ${convertArg}]`);

				const result = wrapBean.invoke([convertArg])
				//代理异步方法
				if(result instanceof Promise){
					return result.then(data => {
						console.log(`result => data`);
						return new Promise(r => r(data))
					})
				}
				console.log(`result =>${result}`)
				return result;

			}
		}
	}
}




//@Service
class Service {

	name='dolala'

	//@Value(config.app.msg)
	appMsg;

	//@Test
	saySync(userMsg){
		return `${userMsg} ${this.appMsg} \n`;
	}

	//@Test
	async doAsync(doSomething){
		return `i am busy.i am ${doSomething} \n`
	}

	async beanInit(beanDefine){
			console.log("bean初始化");
	}

}

//@SpringBoot
class Application {

	//@Autowired
	springFactory;

	//@Autowired
	service;

	//@Autowired
	log;
	
	async main(){

		this.log.info("我启动了");

		this.log.info(`service name:${this.service.name} \n`)
		this.log.info(this.service.saySync("hello"))
		this.log.info(await this.service.doAsync("playing game"))
	}
}

module.exports = {Application,Service,TransactionManager}