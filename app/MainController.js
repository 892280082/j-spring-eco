
//@SpringBoot
class MainController {

	//@Value(config.msg)
	msg;

	//@Autowird
	testService;

	//@Autowird(email)
	emailService;

	main(){

		this.testService.say(this.msg);

	}



}



module.exports = {MainController}
