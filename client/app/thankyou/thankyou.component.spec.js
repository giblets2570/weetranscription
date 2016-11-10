'use strict';

describe('Component: ThankyouComponent', function() {
  // load the controller's module
  beforeEach(module('transcribeApp.thankyou'));

  var ThankyouComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ThankyouComponent = $componentController('thankyou', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
