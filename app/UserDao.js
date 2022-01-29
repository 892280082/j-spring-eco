
//@Repository
class UserDao {

	//@Value(config.mysql.host)
	host;

	port=80;

	saveUser(msg){

		console.log(`userDao:saveUser => 主机:${this.host} 保存信息:${msg}`)

	}


}

module.exports = {UserDao}