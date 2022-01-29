
//@SprintBoot
class MainController {

	//@Value(config.msg)
	msg;

	//@Autowird
	testService;

	//@Autowird
	emailService;

	main(){

		this.testService.say(this.msg);

	}



}



module.exports = {MainController}
