const fs = require('fs')
const path = require('path')


class File {

	content="";
	encoding = 'utf-8'

	constructor(fsPath){
		this.fsPath = fsPath;
	}


	readFile(){
		this.content = fs.readFileSync(this.fsPath,this.encoding).toString()
		return this;
	}

	setContent(c){
		this.content = c;
		return this;
	}

	write(){
		const {encoding} = this;
		fs.writeFileSync(this.fsPath,this.content,{encoding})
	}

	append(data){
		fs.appendFileSync(this.fsPath, data, this.encoding);
	}

	appendFile(filePath){
		return this.setContent(this.content+new File(filePath).readFile().content+";");
	}

	preAppendFile(filePath){
		return this.setContent(new File(filePath).readFile().content+this.content+";");
	}

	setObject(object){
		this.setContent(JSON.stringify(object));
		return this;
	}


	map(fn){
		return this.setContent(fn(this.content))
	}

	replace(ori,tar){
		const reg = new RegExp(ori, 'g');
		this.content = this.content.replace(reg,tar);
		return this;
	}


	changeFileName(target){
		fs.renameSync(this.fsPath, path.join(path.dirname(this.fsPath),target));
	}


	getFileListRecurse(dir, filesList = []){
		dir = dir || this.fsPath;
	    const files = fs.readdirSync(dir);
	    files.forEach((item, index) => {
	        var fullPath = path.join(dir, item);
	        const stat = fs.statSync(fullPath);
	        if (stat.isDirectory()) {      
	            this.getFileListRecurse(path.join(dir, item), filesList);  //递归读取文件
	        } else {                
	            filesList.push(fullPath);                     
	        }        
	    });
	    return filesList;
	}

	contain(str){
		return this.content.indexOf(str) > -1;
	}

}





module.exports = {File}