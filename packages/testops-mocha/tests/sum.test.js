"use strict";
exports.__esModule = true;
var sum_1 = require("./sum");
var assert = require('assert');
describe('sum', function () {
    describe('add', function () {
        it('adds 1 + 2 to equal 3', function (done) {
            assert.equal(sum_1.sum(1, 2), 3);
            done();
        });
        it('adds 2 + 3 to equal 5', function (done) {
            assert.equal(sum_1.sum(2, 3), 5);
            done();
        });

        describe('fail test case', function () {
            it('adds 1 + 2 to equal 4', function (done) {
                assert.equal(sum_1.sum(1, 2), 4);
                done();
            });
            it('adds 2 + 3 to equal 6', function (done) {
                assert.equal(sum_1.sum(2, 3), 6);
                done();
            });
        });
    });
});
