'use strict';

describe('Component: time', function() {
  // load the component's module
  beforeEach(module('transcribeApp.time'));

  var timeComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    timeComponent = $componentController('time', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
