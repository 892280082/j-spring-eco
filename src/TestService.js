
//@Bean
class TestService {

	//@Value(config.email.user)
	user;

	//@Autowird
	userDao;

	say(msg){
		console.log(`${this.user}: ${msg}`)
		this.userDao.saveUser(msg);
	}


}

module.exports = {TestService}