describe('ko.observable.when',function(){
	it('exists',function(){
		var koo = ko.observable();
		expect(koo.when).toBeDefined();
	});

	it('returns an observable',function(){
		var koo = ko.observable();
		expect(koo.when(identityFn).subscribe).toBeDefined();
	});

	it('calls only when the predicate matches',function(){
		var koo = ko.observable();
		var spy = sinon.spy();

		var whenObs = koo.when(truthyFn).subscribe(spy);

		koo(false);
		expect(spy.args.length).toEqual(0);

		koo('yes');
		expect(spy.args[0][0]).toEqual('yes');

		koo(0);
		expect(spy.args.length).toEqual(1);
	});
});