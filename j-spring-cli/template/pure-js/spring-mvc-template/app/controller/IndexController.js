
/**
	首页
*/

//@Controller(/)
class IndexController {

	log;

	//@Value(j-spring-mvc.port)
	port;

	//@Autowired
	apiTestService;

	/**
		路由：/
		参数：req,res,session,$session 均可以自动注入
			 $session 代表的是包裹的session，提供的额外的api
	*/

	//@Get(/)
	async index(req,res,session,$session){

		//如果不存在 则创建
		$session.getOr('$sessionList',[])

		const requestPrefix = `http://localhost:${this.port}`;

		const {apiTestData} = this.apiTestService;

		//页面el会自动从session中取之，优先级低于用户传值

		return ['index',{msg:'hello world!',requestPrefix,apiTestData}]
	}

}

/**
	springmvc-全局异常捕获
	默认就是这么处理的，可以删除。
*/
//@Bean(jSpringMvcExceptionHander)
class JSpringMvcExceptionHander {

	log;

	error_404 = (req,res)=>{
			res.status(404).send('404 PATH NOT FIND')
	}

	error_500 = (req,res,{error}) => {
			res.status(500).json({error});
	}

}


/**
	扩展express
*/

//@SpringMvcAppExtend
class SpringMvcAppExtendBean1 {

	log;

	async loadApp(app){
		 this.log.method('loadApp').debug("可以使用@SpringMvcAppExtend扩展express,可以存在多个！");
	}

}


module.exports = { IndexController,JSpringMvcExceptionHander,SpringMvcAppExtendBean1}
