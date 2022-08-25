//@Service
class Service {

	//@Value(config.app.user)
	user;

	log;

	//@Test
	say(msg){
		return `${this.user}: ${msg} \n`;
	}

	//bean 装配结束后的 回调函数
	async beanInit(beanDefine){
		this.log.method("beanInit").info(" Service 初始化");
	}

}



/**
	动态代理 代理@Service类的@Test方法
*/
//@Proxy(bean=Service,method=Test)
class ServiceProxy {

	log;

	//方法代理
	//beanDefine:定义和注解  bean:实例
	doProxy(bean,beanDefine){

		const log = this.log.method("doProxy")

		return {

			method(wrapBean,method,args){

				//测试注解
				const convertArg = args.map(s => s.toUpperCase())

				log.info(`拦截方法:${method} 参数替换:${args} => ${convertArg}`);

				//返回结果,如果代理方法是异步函数 则必须返回Promise
				return  wrapBean.invoke(convertArg)

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

//指定Bean的名称
//@Bean(alibaba.sms.sendService)
class AlibabaSmsService {

  log;

  async send(){
    this.log.method('send').info('send msg')
  }

}



module.exports = {Service,ServiceProxy,AlibabaSmsService}
