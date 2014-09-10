ko.csp = ko.csp || {};

// utils namespace
ko.csp._u = ko.csp._u || {};
ko.csp._u.isTruthy = function(v){return Boolean(v);};
ko.csp._u.isFn = function(v){return v instanceof Function;};
ko.csp._u.getTest = function(v){
	if(!v)
		return v;
	if(v.test)
		return v.test();
	if(ko.isSubscribable(v))
		return v();
	if(ko.csp._u.isFn(v))
		return v();
	return v;
};


ko.csp.Builder = function(){
	this._subscribable;
	this._basis;
	this.test;
};

ko.csp.Builder.prototype._buildFn = function(subscribable,fn){
	var koo = ko.observable();

	this.test = function() {
		if(fn(subscribable())) 
			koo(v);
	};

	subscribable.when(fn).subscribe(koo);
	this._subscribable=koo;
	return this;
};

// reads all arguments
ko.csp.Builder.prototype.and = function(){
	var utils = ko.csp._u;
	var koo = ko.observable();
	var isTruthy = utils.isTruthy;
	var isSubscribable = ko.isSubscribable;
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
				arg.when(isTruthy).subscribe(testFn);
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
	var isSubscribable = ko.isSubscribable;
	var args = arguments;
	var testFn;
	var isFirstCall = true;
	//debugger;
	testFn = function(bindingKey) {
		
		var vals = [];
		var val;
		var someTruthy = false;
		var iter =0;
		var len = args.length;
		var arg;

		// test every arg for truthyness
		for(;iter<len;iter++) {
			arg = args[iter];
			val = utils.getTest(arg);
			vals.push(val);
			if(utils.isTruthy(val))
				someTruthy = true;

			// bindingkey hack to only bind once
			// if we can subscribe to this value lets do it
			if(isFirstCall && isSubscribable(arg)){
				arg.when(isTruthy).subscribe(testFn);
				
			}
		}

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
	var isSubscribable = ko.isSubscribable;
	var koo = ko.observable();

	this.test = function(){
		var v = getTest(val);
		if(isTruthy(v)) {
			koo(v);
		}
	};

	if(isSubscribable(val))
		val.when(isTruthy).subscribe(koo);
	this._subscribable=koo;
	return this;
};

ko.csp.Builder.prototype.compile = function(fn) {
	if(fn)
		this._subscribable.when(ko.csp._u.isTruthy).subscribe(fn);
	if(this.test){
		// test and pub if needed 
		this.test();
	}
	return this._subscribable;
};

ko.csp.buildRule = function(builderFn) {
	var builder;

	if(typeof builderFn === "ko.csp.Builder"){
		builder = builderFn;
	} else {
		builder = new ko.csp.Builder();
		builderFn(builder);
	}
	return builder;
};
