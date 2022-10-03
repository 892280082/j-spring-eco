
window.cleanSessioon = ()=>{
	$.post(`/sessionApi/cleanSessioon`).then(data => {
		location.reload();
	})
}

window.addSessioon = ()=>{

	const value = $("input[name='addInfoInput']").val();

	if(value){
		$.post(`/sessionApi/addSessionInfo?value=${value}`).then(data => {
			location.reload();
		})
	}

}

window.removeSession = (index)=>{
	$.post(`/sessionApi/removeSession?index=${index}`).then(data => {
		location.reload();
	})
}