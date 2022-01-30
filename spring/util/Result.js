class Result {

	value;
	error;

	constructor(value){
		this.value = value;
	}

	isPresent(){
		return this.value !== null;
	}

	//error:String => Result<Any>
	setError(error){
		this.error = error;
		return this;
	}

	//func:Function[A-B] => Result<B>
	map(func){
		return this.isPresent() ? Result.of(func(this.value)) : this;
	}

	filter(predictFn){
		if(this.isPresent()){
			return predictFn(this.value) ? this : Result.error(this.error+"|not pass predict");
		}
		return this;
	}


	flatmap(func){
		return this.isPresent() ? func(this.value) : this;
	}

	consumer(consumer,notPresentFn){
		if(this.isPresent()){
		  consumer(this.value) 
		}else{
		  notPresentFn && notPresentFn(this.error)
		}
		return this;
	}

	ifError(errorMsg){
	if(!this.isPresent())
	    this.error = errorMsg;
	  return this;
	}

	 getOrElseSupply(supply){

	  return this.isPresent() ? this.value : supply();
	  
	 }

	 getOrElseValue(tempValue){
	    return this.isPresent() ? this.value : tempValue;
	 } 

	 /**
		* 取值或者抛出异常
		* 
		*/
	 getOrTip(errorMsg){
		const error = errorMsg || this.error;
		if(this.isPresent()){
			return this.value;
		}else{

			wx.showModal({
				cancelColor: 'cancelColor',
				title:"出错了",
				content:error
			})

			throw error;
		}
	 }

	//value => Result;
	static of(value){
		if(value === null){
			return Result.error('value is null!')
		}
		if(value === undefined){
			return Result.error('value is undefiend!')
		}
		if(value instanceof Result){
			throw 'Result: should use flatmap instead of map'
		}
		return new Result(value)
	}

	// Supply => Result<Any>
	static tryCatch(supply){
		try{
			return Result.of(supply())
		}catch(e){
			return Result.error("Error:"+e);
		}
	}

	static error(e){
		if(e instanceof ReferenceError){
			return Result.error(e.message)
		}
		return new Result(null).setError(e)
	}

	static analysis({error,value}){
		return error ? Result.error(error) : Result.of(value);
	}

	getValue(){
		if(!this.isPresent())
			throw 'Result force get Error:please check value is exist!';
		return this.value;
	}

	log(){
		return this.consumer(console.log,console.log)
	}



}


module.exports = {Result}
