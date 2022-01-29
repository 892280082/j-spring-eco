
//@Repository
class UserDao {

	//@Value(config.mysql.host)
	host;

	saveUser(msg){

		console.log(`主机:${this.host} 保存信息:${msg}`)

	}


}

module.exports = {UserDao}