const {File} = require("../util/File")
const YAML = require('yamljs')

class SpringResource {

	data = {};

	constructor(assertDirPath){
		const loadData = data => {
			for(let p in data)
				this.data[p] = data[p];
		}

		const fileList = assertDirPath.map(f => new File(f));

		fileList.filter(f => f.getExtName() ==='.json').map(f => f.getObject()).forEach(loadData)

		fileList.filter(f => f.getExtName() ==='.yaml').map(f => YAML.load(f.fsPath)).forEach(loadData)
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