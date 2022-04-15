
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

	_formatParam(param){
		return param.map(msg => {
			if(typeof msg ==='string')
				return msg;
			if(typeof msg === 'object'){
				return JSON.stringify(msg,null,2)
			}
			return msg;
		})
	}


	log(info){
		const {warpBean,method,param} = info;
		const {className,beanDefine} = warpBean;
		if(AllLevel[method] >= AllLevel[this.level] ){
			console.log.apply(console,[`${className}[${method}]:`,...this._formatParam(param)])
		}
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

	_delegateMethod(methodName,param){
		this.springLog.log({warpBean:this,param,method:methodName})
	}

	trace(...param){
		this._delegateMethod("trace",param)
	}


	debug(...param){
		this._delegateMethod("debug",param)
	}

	info(...param){
		this._delegateMethod("info",param)
	}

	warn(...param){
		this._delegateMethod("warn",param)
	}

	error(...param){
		this._delegateMethod("error",param)
	}

	method(methodName){
		return new LogBeanWrap(this.springLog,`${this.className}=>${methodName}`,this.beanDefine)
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