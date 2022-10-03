
window.testAll = ()=>{

	$(".testbtn").click();

}

window.doApiTest = (index,type,expectStatus)=>{

	const url = $(`#apiInput${index}`).val();

	const resultSpan = status => $(`#apiResult${index}`).text(  status == expectStatus ? 'SUCCESS':'FALSE' );
	const remarkSpan = t => $(`#apiRemark${index}`).text(`服务器返回:${t}`);


	$.ajax({
		type,
		url,
		cache:false,
		dataType:'json',
		error:(e)=>{

			const {status,responseJSON} = e;

			resultSpan(status);

			remarkSpan(`${status} => ${ responseJSON ? responseJSON.error : ''}`)

		},
		success:data => {


			resultSpan(200);
			remarkSpan(data)
		}

	})
}