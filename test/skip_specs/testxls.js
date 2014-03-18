/*global describe, it, require */

(function () {
    'use strict';

    var assert = require('chai').assert,
        excel = require('xlrd-parser');

    describe('XLS parser test', function () {

        it('Open XLS', function () {
            excel.parse('../data/pnemo.xls', function(err, worksheet){

                assert.notOk(err);
                assert.ok(worksheet);
            });
        });

        it('Open XLSX', function () {
            excel.parse('../data/pneumo.xlsx', function(err, worksheet){

                assert.notOk(err);
                assert.ok(worksheet);
            });
        });


    });

})();
