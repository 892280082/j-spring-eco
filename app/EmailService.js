
//@Bean(email)
class EmailService {

	//@Value(config.email.user)
	user;

	//@Autowird
	userDao;

	send(msg){
		console.log(`用户<${this.user}>发邮件:${msg}`)
	}

}

module.exports = {EmailService}