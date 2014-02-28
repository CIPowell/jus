/*global describe, it, require */

(function () {
    'use strict';

    var assert = require('chai').assert;

    describe('Assert Tests', function () {

        it('should pass', function () {
            assert.ok(true);
        });



    });

    describe('Validator Tests', function(){
        it('regex tests', function(){
            var rex = require('../../app/server/validators/regex.js');

            rex.call({
                params : {
                    exp : /^[0-9]+$/
                },
                valid : function(){
                    assert.ok(true);
                },
                invalid : function(){
                    assert.ok(false)
                }},'012');

            rex.call({
                params : {
                    exp : /^[0-9]+$/
                },
                valid : function(){
                    assert.ok(false);
                },
                invalid : function(){
                    assert.ok(true)
                }},'01aa2');
        });

    });
})();
