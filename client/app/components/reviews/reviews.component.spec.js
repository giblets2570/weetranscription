'use strict';

describe('Component: reviews', function() {
  // load the component's module
  beforeEach(module('transcribeApp.reviews'));

  var reviewsComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    reviewsComponent = $componentController('reviews', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
