
/**
	作用就是将用户输入的英文参数转成中文
	代理@Service的bean，并且只针对@Test方法进行代理 如不添加method属性，则代表代理全部方法！
*/
//@Proxy(bean=Service,method=Test)
class TransactionManager {


	log;

	//方法代理
	//beanDefine:定义和注解  bean:实例
	doProxy(bean,beanDefine){

		const log = this.log.method("doProxy")

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

				log.info(`TransactionManager: 拦截方法:${method} 参数替换:[${args} => ${convertArg}]`);

				//返回结果
				const result = wrapBean.invoke([convertArg])

				/**
					这里需要注意的时 如果原方法 返回的时Promise,则返回结果也应是Promise
					if(result instanceof Promise){
						return result.then(data => {
					 		return new Promise(r => r(  doSomething(data) ))
					 	})
					}
				*/


				log.info(result)

				return result;
			}
		}
	}

	//对象提升
	doEnhance(bean,beanDefine){

		const log = this.log.method("doEnhance")

		//1.添加一个额外的方法
		bean.toFly = ()=>{
			log.info(`fly to the moon!`)
		}

		return bean;
	}

}



//@Service
class Service {

	name='dolala'

	//@Value(config.app.msg)
	appMsg;

	log;

	//@Test
	saySync(userMsg){
		return `${userMsg} ${this.appMsg} \n`;
	}

	//@Test
	async doAsync(doSomething){
		return `i am busy.i am ${doSomething} \n`
	}

	async beanInit(beanDefine){
		this.log.method("beanInit").info("bean初始化");
	}

}

//@SpringBoot
class Application {

	//@Autowired
	springFactory;

	//@Autowired
	service;

	log;

	async main(){

		this.log.info("我启动了",{msg:"提醒"});

		const log = this.log.method("main")


		log.info(`service name:${this.service.name} \n`)
		log.info(this.service.saySync("hello"))
		log.info(await this.service.doAsync("playing game"))

		//额外添加的方法
		this.service.toFly()
	}
}



module.exports = {Application,Service,TransactionManager}
