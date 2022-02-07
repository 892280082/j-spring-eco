
//处理标注@Service注解的bean，只拦截标注有@Test注解的方法
//@Proxy(annotation=Service)
class TransactionManager {
	//beanDefine:定义和注解  bean:实例
	doProxy(beanDefine,bean){
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

				//获取方法上的注解
				const TestAnnotation = wrapBean.getMethodAnnotation("Test");
				if(TestAnnotation){
					console.log(`TransactionManager: 拦截方法:${method} 参数替换:[${args} => 你好]`);
					return wrapBean.invoke(["你好 "])
				}else{
					return wrapBean.next();
				}

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
	say(userMsg){
		return `${userMsg} ${this.appMsg} \n`;
	}

	//@NoProxy
	async beanInit(beanDefine){
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
		console.log(`service name:${this.service.name} \n`)
		console.log(this.service.say("hello"))
	}
}

module.exports = {Application,Service,TransactionManager}