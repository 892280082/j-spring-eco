
//@Bean
class TestService {

	//@Value(config.email.user)
	user;

	//@Autowired
	userDao;

	//@Autowired(email)
	emailService;

	//@SpringFactory
	factory;

	say(msg){

		/**
			这里的userDao实际时一个代理类，通过Transaction进行了功能提升。
			当然也可以获取到它的原始注解。
		*/
		console.log("userDao",this.userDao)
		console.log("userDao 的元数据",this.factory.getBeanDefineByBean(this.userDao))


		console.log(`TestService => i am user ${this.user}`)

		//这里的userDao是代理后的bean,这里的方法会进行拦截
		this.userDao.saveUser(msg);

		this.emailService.send(msg);
	}


}

module.exports = {TestService}