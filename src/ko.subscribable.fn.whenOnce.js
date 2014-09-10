ko.subscribable.fn.whenOnce = function(predicateFn) {
	var koo = ko.observable();
	var subscription = this.subscribe(function(v){
		if(predicateFn(v)){
			koo(v);
			subscription.dispose();	
		}
	});
	return koo;
};