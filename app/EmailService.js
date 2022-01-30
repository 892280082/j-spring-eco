
//@Bean(email)
class EmailService {

	//@Value(config.email.user)
	user;

	//@Autowired
	//这就有问题了
	userDao;

	send(msg){
		console.log(`emailService:send => 发邮件:${msg}`)
	}

}



module.exports = {EmailService}