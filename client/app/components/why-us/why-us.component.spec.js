'use strict';

describe('Component: whyUs', function() {
  // load the component's module
  beforeEach(module('transcribeApp.why-us'));

  var whyUsComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    whyUsComponent = $componentController('whyUs', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
