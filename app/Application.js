
//@SpringBoot
class Application {

	//@Autowired
	springFactory;

	//@Autowired
	service;

  //注入指定名称的Bean
	//@Autowired(alibaba.sms.sendService)
	smsService;

	log;

	async main(){

		const log = this.log.method('main');

	  log.info("程序启动");

		//1.测试动态代理
		const msg = this.service.say('hello world!');

		log.info(msg);

		//2.测试Bean增强
		this.service.toFly();

	}
}



module.exports = {Application}
