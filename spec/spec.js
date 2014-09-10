describe('ko-csp',function(){
	describe('namespace',function(){
		it('exists',function(){
			expect(ko.csp).toBeDefined();
		});
	});

	describe('utils',function(){
		describe('isBuilder',function(){
			it('works',function(){
				var builder = new ko.csp.Builder();
				expect(ko.csp._u.isBuilder).toBeDefined();
				expect(ko.csp._u.isBuilder(builder)).toEqual(true);
			});
		});
		describe('isSubscribable',function(){
			it('works',function(){
				var builder = new ko.csp.Builder();
				expect(ko.csp._u.isSubscribable).toBeDefined();
				expect(ko.csp._u.isSubscribable(builder)).toEqual(true);
			});
		})

		// describe('getTest',function(){
		// 	it('works',function(){
		// 		var builder = new ko.csp.Builder();
		// 		var koo = ko.observable();
		// 		builder.isTruthy(koo);
		// 		console.log(builder)
		// 		koo(false);
		// 		expect(.toEqual(false);

		// 		koo(true);
		// 		expect(builder.test()).toEqual(true);
		// 	});
		// });
	});


	describe('ko.csp.Builder.prototype.isTruthy',function(){
		it('works with truthy vals',function(){
			var builder = new ko.csp.Builder();
			var spy = sinon.spy();

			ko.csp.buildRule(function(builder){
				builder.isTruthy(true);
			}).compile(spy);

			expect(spy.args.length).toEqual(1);
		});

		it('works with subscribables, calls them',function(){
			var builder = new ko.csp.Builder();
			var spy = sinon.spy();
			var koo = ko.observable();

			ko.csp.buildRule(function(builder){
				builder.isTruthy(koo);
			}).compile(spy);

			expect(spy.args.length).toEqual(0);

			koo(true);
			expect(spy.args[0][0]).toEqual(true);

			koo(false);
			expect(spy.args.length).toEqual(1);
		});

	});


	describe('ko.csp.Builder.prototype.and',function(){
		it('works with truthy vals',function(){
			var builder = new ko.csp.Builder();
			var spy = sinon.spy();

			ko.csp.buildRule(function(builder){
				return builder.and(true);
			}).compile(spy);

			expect(spy.args.length).toEqual(1);
		});

		it('can run nested',function(){
			var builder = new ko.csp.Builder();
			var spy = sinon.spy();
			var koo1 = ko.observable();
			var koo2 = ko.observable();

			ko.csp.buildRule(function(builder){
				return builder.and(builder.rule().isTruthy(koo1),koo2);
			}).compile(function(){
				spy.apply(spy,arguments);
			});

			koo1(false);
			expect(spy.args.length).toEqual(0);

			koo1('yes');
			expect(spy.args.length).toEqual(0);

			koo2('yep');
			expect(spy.args.length).toEqual(1);

		});

		it('works with subscribables, calls them',function(){
			var builder = new ko.csp.Builder();
			var spy = sinon.spy();
			var koo = ko.observable();

			ko.csp.buildRule(function(builder){
				return builder.and(koo);
			}).compile(spy);

			expect(spy.args.length).toEqual(0);

			koo(true);
			expect(spy.args.length).toEqual(1);
			expect(spy.args[0][0][0]).toEqual(true);

			koo(false);
			expect(spy.args.length).toEqual(1);
		});

		it('works with multiple subscribables, calls them',function(){
			var builder = new ko.csp.Builder();
			var spy = sinon.spy();
			var koo1 = ko.observable();
			var koo2 = ko.observable();
			var koo3 = ko.observable(true);

			ko.csp.buildRule(function(builder){
				return builder.and(koo1,koo2,koo3);
			}).compile(function(){
				spy.apply(spy,arguments);
			})

			koo1(true);
			expect(spy.args.length).toEqual(0);

			koo2(false);
			expect(spy.args.length).toEqual(0);

			koo2(false);
			expect(spy.args.length).toEqual(0);

			koo2(true);
			var len = spy.args.length;

			expect(spy.args.length).toEqual(1);
		});
	});

	describe('ko.csp.Builder.prototype.or',function(){
		it('works with truthy vals',function(){
			var builder = new ko.csp.Builder();
			var spy = sinon.spy();

			ko.csp.buildRule(function(builder){
				return builder.and(true);
			}).compile(spy);

			expect(spy.args.length).toEqual(1);
		});

		it('works with subscribables, calls them',function(){
			var builder = new ko.csp.Builder();
			var spy = sinon.spy();
			var koo = ko.observable();

			ko.csp.buildRule(function(builder){
				return builder.and(koo);
			}).compile(spy);

			expect(spy.args.length).toEqual(0);

			koo(true);
			expect(spy.args.length).toEqual(1);
			expect(spy.args[0][0][0]).toEqual(true);

			koo(false);
			expect(spy.args.length).toEqual(1);
		});

		it('works with multiple subscribables, calls them',function(){
			var builder = new ko.csp.Builder();
			var spy = sinon.spy();
			var koo1 = ko.observable();
			var koo2 = ko.observable();
			var koo3 = ko.observable(false);

			ko.csp.buildRule(function(builder){
				return builder.or(koo1,koo2,koo3);
			}).compile(function(){
				spy.apply(spy,arguments);
			})


			koo1(false);
			expect(spy.args.length).toEqual(0);

			koo2(true);
			expect(spy.args.length).toEqual(1);

			koo2(false);
			expect(spy.args.length).toEqual(1);

			koo3(true);
			expect(spy.args.length).toEqual(2);
		});

		it('can run nested',function(){
			var builder = new ko.csp.Builder();
			var spy = sinon.spy();
			var koo1 = ko.observable();

			ko.csp.buildRule(function(builder){
				return builder.or(builder.rule().isTruthy(koo1));
			}).compile(function(){
				spy.apply(spy,arguments);
			});

			koo1(false);
			expect(spy.args.length).toEqual(0);

			koo1('yes');
			expect(spy.args.length).toEqual(1);

		});
	});


	describe('building',function(){
		

	});

});