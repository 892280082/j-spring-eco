
//@Bean
class ApiTestService {


	apiTestData = [
		{
			index:100,
			title:'url传值测试:测试controller中query取值是否正确',
			api:'/apiTest/queryParamTest?a=1&b=2',
			type:'get',
			status:200,
			verify:({a,b})=>{
				return a=== '1' && b ==='2'
			}
		},
		{
			index:105,
			title:'url传值测试:测试缺省传参b，后台是否返回错误状态码和开发模式下的提示信息',
			api:'/apiTest/queryParamTest?a=1',
			type:'get',
			status:400,
			verify:({a,b})=>{
				return a=== '1' && b ==='2'
			}
		},
		{
			index:1051,
			title:'500错误处理',
			api:'/apiTest/test500ErrorHander',
			type:'get',
			status:500,
			verify:({a,b})=>{
				return a=== '1' && b ==='2'
			}
		},
		{
			index:1052,
			title:'404错误处理',
			api:'/apiTest/test404ErrorHander',
			type:'get',
			status:404,
			verify:()=>{
			}
		},
		{
			index:107,
			title:'url传值测试:测试允许缺省传参b',
			api:'/apiTest/queryParamTest2?a=1',
			type:'get',
			status:200,
			verify:({a,b})=>{
				return a=== '1' && b === undefined;
			}
		},
		{
			index:110,
			title:'resful传值测试',
			api:'/apiTest/resfulParamTest/hellow/aabbcc',
			type:'get',
			status:200,
			verify:({a,b})=>{
				return a=== 'hellow' && b ==='aabbcc'
			}
		},
		{
			index:115,
			title:'混合传值测试',
			api:'/apiTest/sendParam/hellow?b=aabbcc',
			type:'get',
			status:200,
			verify:({a,b})=>{
				return a=== 'hellow' && b ==='aabbcc'
			}
		},
		{
			index:120,
			title:'聚合传参',
			api:'/apiTest/aggregation?stu.name=zhangsan&stu.age=12&stu.info.school=68zhong&stu.info.class=9-1',
			type:'get',
			status:200,
			verify:(pojo)=>{
				return pojo.name  === 'zhangsan' && pojo.age === '12' && pojo.info.school === '68zhong' && pojo.info.class === '9-1'
				? '数据校验正确':'数据校验失败'
			}
		},
		{
			index:130,
			title:'redirect临时重定向',
			api:'/apiTest/testRedirect',
			type:'get',
			status:200
		},
		{
			index:140,
			title:'location永久重定向',
			api:'/apiTest/testLocation',
			type:'get',
			status:200
		},
		{
			index:150,
			title:'post请求',
			api:'/apiTest/testPostRequest?a=hellow&b=aabbcc',
			type:'post',
			status:200,
			verify:({a,b})=>{
				return a=== 'hellow' && b ==='aabbcc'
			}
		}
	]

	//测试接口得到的结果是否正确
	doVerify(index,data){
		return this.apiTestData.find(d => d.index === +index).verify(data) ? 'SUCCESS':'FAIL';
	}

}

module.exports = {ApiTestService}