ko.subscribable.fn.once = function() {
	var koo = ko.observable();
	var subscription = this.subscribe(function(v){
		koo(v);
		subscription.dispose();	
	});
	return koo;
};