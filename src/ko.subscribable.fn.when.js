ko.subscribable.fn.when = function(predicateFn) {
	var koo = ko.observable();
	var subscription = this.subscribe(function(v){
		if(predicateFn(v)){
			koo(v);			
		}
	});
	return koo;
};