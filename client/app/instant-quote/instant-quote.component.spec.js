'use strict';

describe('Component: instantQuote', function() {
  // load the component's module
  beforeEach(module('transcribeApp.instant-quote'));

  var instantQuoteComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    instantQuoteComponent = $componentController('instantQuote', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
