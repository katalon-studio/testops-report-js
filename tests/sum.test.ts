import { sum } from './sum'
const assert =  require('assert');

describe('sum', function() {
  it('adds 1 + 2 to equal 3', function (done) {
    assert.equal(sum(1, 2), 3);
    done();
  });

  it('adds 2 + 3 to equal 5', function (done) {
    assert.equal(sum(2, 3), 5);
    done();
  });
});
