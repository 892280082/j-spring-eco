
const readLine =  title => {
	const readlineUtil = require('readline').createInterface({
	  input: process.stdin,
	  output: process.stdout
	})
	return new Promise((resolve,reject) => {
		readlineUtil.question(`${title}\n`, value => {
		  readlineUtil.close()
		  resolve(value)
		})
	});
}

const readNumber = async (title,min,max) => {
	const numberStr = await readLine(title)
	const number = Number(numberStr);
	if(number < min || number > max)
		throw 'option error!'
	return number
}

module.exports = {
	readLine,
	readNumber
}