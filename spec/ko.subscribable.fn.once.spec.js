describe('ko.observable.once',function(){
	it('exists',function(){
		var koo = ko.observable();
		expect(koo.once).toBeDefined();
	});

	it('returns an observable',function(){
		var koo = ko.observable();
		expect(koo.once(identityFn).subscribe).toBeDefined();
	});

	it('calls only when the predicate matches once',function(){
		var koo = ko.observable();
		var spy = sinon.spy();

		var whenObs = koo.once().subscribe(spy);

		koo(false);
		expect(spy.args.length).toEqual(1);

		koo('yes');
		expect(spy.args.length).toEqual(1);

		koo(0);
		expect(spy.args.length).toEqual(1);

		koo(1);
		expect(spy.args.length).toEqual(1);
	});
});