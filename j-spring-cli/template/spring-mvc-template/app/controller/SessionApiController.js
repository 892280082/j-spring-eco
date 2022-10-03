const SESSION_LIST = '$sessionList';

/**

	处理session操作的 api

	@Controller
	class SessionApi
	等同于
	@Controller(sessionApi)
	class SessionApi

*/



//@Controller(sessionApi)
class SessionApiController {


	log;


	/**
		拦截整个controller的请求，通过true 拒绝false。
		其它操作例如重定向 请使用res操作。
	*/

	//@Filter(/sessionApi)
	async filterNoSessionRequest(req,res){

		this.log.method('filterNoSessionRequest').info('=> 拦截了/sessionApi请求');

		const state = Array.isArray(req.session[SESSION_LIST]) ;

		if(state){
			req.session['$FilterUrl'] = req.url;
		}

		return state;
	}



	/**
		路由: /sessionApi/addSessionInfo?value=?
		$sessionList 带有$开头的参数会尝试从session中获取,不存在则报错.
	*/

	//@Post
	//@Json
	async addSessionInfo(value,$sessionList){
		$sessionList.push(value)
		return "SUCCESS";
	}

	/**
		销毁session "$sessionList"
	*/

	//@Post
	//@Json
	async cleanSessioon($session){
		$session.destory(SESSION_LIST)
		return "SUCCESS"
	}

	/**
		删除指定下标
	*/

	//@Post
	//@Json
	async removeSession($sessionList,index){
		$sessionList.splice(index,1);
		return "SUCCESS"
	}


}

module.exports = {SessionApiController}