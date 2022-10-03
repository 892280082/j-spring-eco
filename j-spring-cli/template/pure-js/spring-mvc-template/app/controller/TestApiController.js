const path = require('path')

/**
	测试接口传参的api
**/

//@Controller(apiTest)
class TestApiController {

	//@Autowired
	apiTestService;

	//@Get
	//@Json
	async queryParamTest(a,b){
		return this.apiTestService.doVerify(100,{a,b})
	}

	//@Get
	//@Json
	async test500ErrorHander(){
		return a+b;
	}


	//@Get
	//@Json
	//@Null(b)
	async queryParamTest2(a,b){
		return this.apiTestService.doVerify(107,{a,b})
	}


	//@Get(/resfulParamTest/:a/:b)
	//@Json
	async resfulParamTest(a,b){
		return this.apiTestService.doVerify(110,{a,b})
	}

	//@Get(/sendParam/:a)
	//@Json
	async sendParam(a,b){
		return this.apiTestService.doVerify(110,{a,b})
	}

	//@Get
	//@Json
	//@Aggregation(stu)
	async aggregation(stu){
		return this.apiTestService.doVerify(120,stu)
	}


	//临时重定向
	//@Get
	async testRedirect(res){
		return 'redirect:/apiTest/beTestRedirect'
	}

	//被重定向
	//@Get
	//@Json
	async beTestRedirect(res){
		return '我被临时重定向了'
	}


	//永久重定向
	//@Get
	async testLocation(res){
		return 'location:/apiTest/beTestLocation'
	}

	//被永久重定向
	//@Get
	//@Json
	async beTestLocation(res){
		return '我被永久重定向了哦'
	}


	//@Post
	//@Json
	async testPostRequest(a,b){
		return this.apiTestService.doVerify(150,{a,b})
	}


	//@Get
	async downFile($util){

		await $util.sendFile(path.join(__dirname,'spring-framework.png'))
	}


}

module.exports = {TestApiController}
