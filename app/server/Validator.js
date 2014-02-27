var events = require('events');

/**
 * Validate objects against the validators provided
 * validators : an array of validation funtcions that return an object { valid : true/false, message : "error message" }
 *
 * We spawn a fieldvalidator class per field....
 */
var FieldValidator = function (field_name, validators)
{
    this.field_name = field_name;
    this.vaidators = []
    this.results = {};

    for( var i = validators.length; i-- ; )
    {
        this.validators.push(requre('./validators/' + this.validators[i].name).bind({
            params : this.vaidators[i].params,
            valid : this.valid.bind(this),
            invalid : this.invalid.bind(this)
        }));

        this.results[this.validators[i].name] = undefined;
    }
};

FieldValidator.super_ = events.EventEmitter;
FieldValidator.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: FieldValidator,
        enumerable: false
    }
});

/**
 * start the validation of a field, lo
 */
FieldValidator.prototype.validate = function(value)
{
    for(var r in this.results ){ this.results[r] = undefined; }

    for( var v in this.validators )
    {
        //fire off all the validators ... responses will be collected
        v(value);
    }
};

FieldValidator.prototype.testdone = function()
{
    var valid= true;
    var messages = [];
    for( var name in results )
    {
        if( results[name] === undefined ){
            return; //not yet done;
        }
        else if( results[name] !== true )
        {
            valid = false; //at least one test has failed
            messages = messages + results[name];
        }
    }

    if(valid)
    {
        this.emit('valid');
    }
    else
    {
        this.emit('invalid', { messages : messages });
    }
}

FieldValidator.prototype.valid = function(testName)
{
    this.results[testname] = true;
    this.testdone();
}

FieldValidator.prototype.invalid = function(testname, messages)
{
    this.results[testname] = messages;
    this.testdone();
}

/**
 * A class that validates records, spec should be in the format { fieldname : [{ name : <>, params: <> }, ... ] }
 */
var RecordValidator = function (spec)
{
    this.validators = {};

    for( var field_name in spec )
    {
        this.validators[field_name] = new FieldValidator(field_name, spec[field_name]);
        this.validators[field_name].on('valid', this.valid_callback.bind(this));
        this.validators[field_name].on('invalid', this.invalid_callback.bind(this));
    }

}

RecordValidator.super_ = events.EventEmitter;
RecordValidator.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: FieldValidator,
        enumerable: false
    }
});

RecordValidator.prototype.validate_field = function(field_name, value)
{
    this.validators[field_name].validate(value);
}

/**
 *
 */
RecordValidator.prototype.validate = function(record)
{
    this.success = true;
    this.results = {};

    for ( var field_name in this.validators )
    {
        this.results[field_name] = { success : undefined };
        this.validators[field_name].validate(record[field_name]);
    }
}

RecordValidator.prototype.valid_callback = function(evt)
{
    this.results[evt.field] = { success:true };
    this.checkComplete();
}

RecordValidator.prototype.invalid_callback = function(evt)
{
    this.success = false;
    this.results[evt.field] = { success:false, messages: evt.messages };
    this.checkComplete();
}

RecordValidator.prototype.checkComplete = function(evt)
{
    for( var fld in this.results )
    {
      if(this.results[fld].success === undefined) return;
    }

    this.emit(success ? 'valid' : 'invalid', this.results);
}

module.exports = { RecordValidator : RecordValidator, FieldValidator : FieldValidator }

