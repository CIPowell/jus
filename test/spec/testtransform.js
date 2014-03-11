(function () {
    'use strict';

    var assert = require('chai').assert;

    describe('rename tests', function(){
        var rename = require('../../app/server/transforms/rename.js');

        it('should change the name', function(){


            var r = rename.bind({ params : { name : 'bar' }});

            var record = { field_name :'foo', value : 'xxx' },
                t_record = r(record);

            assert.ok(t_record.field_name == 'bar');
        });
    });
})();
