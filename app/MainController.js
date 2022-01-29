
//@SpringBoot
class MainController {

	//@Value(config.msg)
	msg;

	//@Autowird
	testService;

	main(){

		this.testService.say(this.msg);

	}



}



module.exports = {MainController}
