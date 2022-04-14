
const AllLevel = {
	trace:0,
	debug:1,
	info:2,
	warn:3,
	error:4
}


class SpringLog {

	state;//off on
	level;//trace debug info

	constructor(state,level){
		this.state = state;
		this.level = level;
	}

	_log(className,type,msg){
		if(AllLevel[type] >= AllLevel[this.level] )
			console.log(`${className}-${type}:${msg}`)
	}

	trace(warpBean,msg){
		this._log(warpBean.className,"trace",msg)
	}

	debug(warpBean,msg){
		this._log(warpBean.className,"debug",msg)
	}

	info(warpBean,msg){
		this._log(warpBean.className,"info",msg)
	}

	warn(warpBean,msg){
		this._log(warpBean.className,"warn",msg)
	}

	error(warpBean,msg){
		this._log(warpBean.className,"error",msg)
	}
}


class LogBeanWrap {

	springLog;

	className;

	beanDefine;

	constructor(springLog,className,beanDefine){
		this.springLog = springLog;
		this.className = className;
		this.beanDefine = beanDefine;
	}

	trace(msg){
		this.springLog.trace(this,msg)
	}


	debug(msg){
		this.springLog.debug(this,msg)
	}

	info(msg){
		this.springLog.info(this,msg)
	}

	warn(msg){
		this.springLog.warn(this,msg)
	}

	error(msg){
		this.springLog.error(this,msg)
	}

}


let logSingleton = null;

const setLogSingleton = log => {
	logSingleton = log;
}

const getLogSingleton = (className,beanDefine) => {

	return new LogBeanWrap(logSingleton,className,beanDefine);
}

const fastLog = (className,type,msg) => {
	if(logSingleton){
		getLogSingleton(className,null)[type](msg);
	}
}

module.exports = {SpringLog,setLogSingleton,getLogSingleton,fastLog}