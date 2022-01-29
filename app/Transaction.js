
//@Proxy(sort=10,annotation=Repository)
class Transaction {

	doProxy(beanDefine,bean){

		bean.addMsg = "hahahahahah，我是额外的";
		console.log("增强bean",bean);

		return bean;
	}


}

module.exports = {Transaction}