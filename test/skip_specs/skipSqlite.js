/*global describe, it, require */

(function () {
    'use strict';

    var assert = require('chai').assert;

    describe('sqlite tests', function(){
        var sqlite = require('../../app/server/databases/sqlite.js');


        it('should connect to a sqlitefile', function()
        {
            try
            {
                var db = new sqlite({
                    filename : 'test.db'
                });

                assert.ok(db);
            }
            catch(err)
            {
                assert.ok(false, err);
            }

        });

        it('should prepare an insert query string', function()
        {
            var db = new sqlite({
                filename : 'test.db'
            });

            var stmt = db.get_insert_string('test', [
                'test_field'
            ]);

            assert.ok(stmt == 'INSERT INTO test (test_field) VALUES ($test_field);');
        });

        it('should prepare an insert statement', function()
        {
            var db = new sqlite({
                filename : 'test.db'
            });

            var stmt = db.prepare_insert('test', {
                'test_field' : {}
            });

            assert.ok(db.insert_query);
        });

        it('should insert a record', function()
        {
            var db = new sqlite({
                filename : 'test.db'
            });

            var stmt = db.prepare_insert('test', {
                'test_field' : {}
            });

            db.insert({ 'test_field' : 'test_value' }, function(err){
                assert.isNull(err);
            });
        });

        it('should not insert a record', function()
        {
            var db = new sqlite({
                filename : 'test.db'
            });

            var stmt = db.prepare_insert('test', {
                'test_field' : {}
            });

            db.insert({ 'xxxx' : 'test_value' }, function(err){
                assert.isNotNull(err);
            });
        });

    });

    var Submitter = require('../../app/server/Submitter.js');

    describe('Test adapter', function(){
        it('should make a connection', function(){
            var db = new Submitter('sqlite', {
                filename:'test.db'
            },
            'test',
            {
                "test_field" : {}
            });

            assert.ok(db);
        });
    });

})();
