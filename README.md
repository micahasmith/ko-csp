# ko-csp

Beginning of a CSP implementation for knockout, entirely based on observables.

### Show Me The Code

As usual, see the test suite for more. Currently the implementation has been focused around infrastructure needed to build out.

#### Foundations of CSP via RFP/knockout

ko-csp takes a FRP approach to CSP. To begin building via this perspective, thare are some "utility" functions that are needed in order to satisfy many of the library's use cases.

**Note how most of this returns other observables.** So most of the interaction with this lib uses core knockout functionality.

##### ko.subscribable.once

Returns an observable that publishes only on the first event.

```js
var name = ko.observable();

// fire this the first time someone changes the name observable
// notice how it returns an observable!
name.once().subscribe(function(v){
	// first name change
	console.log('first name change was %s',v);
});

```

##### ko.subscribable.when

Returns an observable that fires when the passed in predicate evaluates to truthy.

```js
var isAllCool = ko.observable();
isAllCool.when(function(val){
	// truthyness
	return val;
}).subscribe(function(val){
	// do something with a truthy val
});
```

##### ko.subscribable.whenOnce

Returns an observable that fires once when the predictate matches.

The equivalent of `observable.when(fn).once()`. Maybe i should delete it.


#### The Real Stuff

The good stuff of this lib happens when you want to combine states of observables together. Example:

```js
var fname = ko.observable();
var lname = ko.observable();

var observable = ko.csp.buildRule(function(builder){
	// you can pass multiple observables
	// or even static values (though they're not monitored)
	// that one can respond to

	// by default `and` checks for truthyness
	return builder.and(
		fname,
		lname
	);
}).compile(function(val){
	
});
```

*Notes on this example:*

- obviously, you build the rule in the buildRule function call
- the compile function takes the place of a subscription function
- the compile function will test the rule and immediately publish a value if the state of the rule is initially truthy
- the compile function returns an observable that can be subsribed on for the rule

*Methods on buildRule's builder*

- builder.and
- builder.or
- builder.isTruthy
- builder.when(observable,predicateFn)

### License MIT
