ko.csp = ko.csp || {};

ko.csp.Builder = function(){
	this._subscribable;
	this._basis;
	this.test;
};


// utils namespace
ko.csp._u = ko.csp._u || {};
ko.csp._u.isTruthy = function(v){return Boolean(v);};
ko.csp._u.isFn = function(v){return v instanceof Function;};
ko.csp._u.getTest = function(v){
	if(!v)
		return v;
	if(v._subscribable)
		return v._subscribable();
	if(v.test)
		return v.test();
	if(ko.isSubscribable(v))
		return v();
	if(ko.csp._u.isFn(v))
		return v();
	return v;
};
ko.csp._u.isBuilder = function(v){
	return v instanceof ko.csp.Builder;
}
ko.csp._u.isSubscribable = function(v){
	return ko.isSubscribable(v) || ko.csp._u.isBuilder(v);
}

ko.csp._u.getSubscribable = function(v){
	if(ko.isSubscribable(v))
		return v;
	if(ko.csp._u.isBuilder(v)){
		//console.log('returning builder')
		return v.compile();
	}
}




ko.csp.Builder.prototype.rule = function(){
	return new ko.csp.Builder();
}

// reads all arguments
ko.csp.Builder.prototype.and = function(){
	var utils = ko.csp._u;
	var koo = ko.observable();
	var isTruthy = utils.isTruthy;
	var isSubscribable = utils.isSubscribable;
	var getSubscribable = utils.getSubscribable;
	var args = arguments;
	var testFn;
	var isFirstCall = true;
	//debugger;
	testFn = function(bindingKey) {
		
		var vals = [];
		var val;
		var allTruthy = true;
		var iter =0;
		var len = args.length;
		var arg;

		// test every arg for truthyness
		for(;iter<len;iter++) {
			arg = args[iter];
			val = utils.getTest(arg);
			vals.push(val);
			if(!utils.isTruthy(val))
				allTruthy = false;

			// bindingkey hack to only bind once
			// if we can subscribe to this value lets do it
			if(isFirstCall && isSubscribable(arg)){
				getSubscribable(arg).when(isTruthy).subscribe(testFn);
			}
		}

		if(allTruthy){
			koo(vals)
		}

		if(isFirstCall)
			isFirstCall = false;
	};

	this.test = testFn;
	this._subscribable=koo;
	return this;
};

// reads all arguments
ko.csp.Builder.prototype.or = function(){
	var utils = ko.csp._u;
	var koo = ko.observable();
	var isTruthy = utils.isTruthy;
	var isSubscribable = utils.isSubscribable;
	var getSubscribable = utils.getSubscribable;
	var args = arguments;
	var testFn;
	var isFirstCall = true;
	//debugger;
	testFn = function() {
		
		var vals = [];
		var val;
		var someTruthy = false;
		var iter =0;
		var len = args.length;
		var arg;

		// test every arg for truthyness
		for(;iter<len;iter++) {
			arg = args[iter];
			//console.log('or arg',arg,isFirstCall, isSubscribable(arg), typeof arg);
			val = utils.getTest(arg);
			vals.push(val);
			if(utils.isTruthy(val))
				someTruthy = true;

			// if we can subscribe to this value lets do it
			if(isFirstCall && isSubscribable(arg)){
				// var subsc = getSubscribable(arg);
				// console.log('or firstcall',arg,subsc);
				// subsc.subscribe(function(v){ console.log('had or subs',v); });
				getSubscribable(arg).when(isTruthy).subscribe(testFn);
			}
		}

		//console.log('or sometruthy',false);
		if(someTruthy){
			koo(vals)
		}

		if(isFirstCall)
			isFirstCall = false;
	};

	this.test = testFn;
	this._subscribable=koo;
	return this;
};

ko.csp.Builder.prototype.isTruthy = function(val){
	var utils = ko.csp._u;
	var isTruthy = utils.isTruthy;
	var getTest = utils.getTest;
	var isSubscribable = utils.isSubscribable;
	var getSubscribable = utils.getSubscribable;
	var koo = ko.observable();

	this.test = function(){
		var v = getTest(val);
		if(isTruthy(v)) {
			koo(v);
		}
	};

	if(isSubscribable(val))
		getSubscribable(val).when(isTruthy).subscribe(koo);
	this._subscribable=koo;
	return this;
};

ko.csp.Builder.prototype.compile = function(fn) {
	if(fn)
		this._subscribable.subscribe(fn);
	if(this.test){
		// test and pub if needed 
		this.test();
	}
	return this._subscribable;
};

ko.csp.buildRule = function(builderFn) {
	var builder;

	if(ko.csp._u.isBuilder(builderFn)){
		builder = builderFn;
	} else {
		builder = new ko.csp.Builder();
		builderFn(builder);
	}
	return builder;
};
