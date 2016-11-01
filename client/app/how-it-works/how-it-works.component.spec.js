'use strict';

describe('Component: howItWorks', function() {
  // load the component's module
  beforeEach(module('transcribeApp.how-it-works'));

  var howItWorksComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    howItWorksComponent = $componentController('howItWorks', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
