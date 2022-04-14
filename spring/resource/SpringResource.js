const {File} = require("../util/File")

class SpringResource {

	data = {};

	constructor(assertDirPath){

		const resourceFile = new File(assertDirPath);

		if(resourceFile.isDir()){

			new File(assertDirPath).getFileList().map(f => new File(f))
			.filter(f => f.getExtName() ==='.json')
			.forEach(f => {

				this.data[f.getFileName(true)] = f.getObject()

			})

		}

	}

	/**
		根据key路径获取值 
		例如config.json 
		{
			"msg":"hello world!",
			"email":{
				"user":"892280082@qq.com"
			}
		}
		call getValue("config.email.user") => 892280082@qq.com
	*/
	getValue(key){
		try{
			const value =  key.split(".").reduce((s,v) => {
				return s[v];
			},{...this.data})
			if(value === undefined){
				throw `field inject config error:${key}`
			}
			return value;
		}catch(e){
			throw `field inject config error:${key}`
		}
	}

	getOr(key,defaultValue){
		try{
			return this.getValue(key);
		}catch(e){
			return defaultValue;
		}
	}

}


module.exports = {SpringResource}