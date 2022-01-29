
//@SpringBoot
class MainController {

	//@Value(config.msg)
	msg;

	//@Autowired
	testService;

	//@SpringFactory
	factory;

	main(){

		this.testService.say(this.msg);

	}



}



module.exports = {MainController}
