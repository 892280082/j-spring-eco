

class SpringLog {

	AllLevel = {
		trace:0,
		debug:1,
		info:2,
		warn:3,
		error:4
	};


	state;//off on
	level;//trace debug info

	springFactory;//autowired

	constructor(factory,state,level){
		this.state = state;
		this.level = level;
		this.springFactory =factory;
	}

	_formatParam(param){
		return param;
	}


	log(info){
		const {AllLevel} = this;
		const {warpBean,debugType,param} = info;
		const {className,beanDefine} = warpBean;
		if(AllLevel[debugType] >= AllLevel[this.level] ){
			console.log.apply(console,[`[${debugType}]${className}:`,...this._formatParam(param)])
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

	_delegateMethod(debugType,param){
		this.springLog.log({warpBean:this,param,debugType})
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