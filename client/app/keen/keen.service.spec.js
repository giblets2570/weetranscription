'use strict';

describe('Service: keen', function() {
  // load the service's module
  beforeEach(module('transcribeApp.keen'));

  // instantiate service
  var keen;
  beforeEach(inject(function(_keen_) {
    keen = _keen_;
  }));

  it('should do something', function() {
    expect(!!keen).to.be.true;
  });
});
