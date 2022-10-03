//@Bean
class TemplateBean {

	//@Value(TemplateBean.msg)
	msg;

	say(){
		console.log(this.msg)
	}

}

module.exports = {TemplateBean}