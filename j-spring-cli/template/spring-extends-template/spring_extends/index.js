const path = require("path")
const {TemplateBean} = require("./bean/TemplateBean")

//包加载器
const TemplateBeanScaner =  (packageName='spring-extends-template')=> {
	return [
			{
				packageName,
				srcList:[path.join(__dirname,"./bean")]
			}
		]
};

module.exports = {
	TemplateBeanScaner,
	TemplateBean
}
