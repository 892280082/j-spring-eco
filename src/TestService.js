
//@Bean
class TestService {

	//@Value(config.email.user)
	user;

	//@Autowird
	userDao;

	//@Autowird(email)
	emailService;


	say(msg){
		console.log(`${this.user}: ${msg}`)
		this.userDao.saveUser(msg);
	}


}

module.exports = {TestService}