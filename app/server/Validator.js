/**
 * Validate objects against the validators provided
 * validators : an array of validation funtcions that return an object { valid : true/false, message : "error message" }
 *
 * We spawn a fieldvalidator class per field....
 */
var FieldValidator = function (validators)
{
    this.vaidators = []

    for( var i = validators.length; i-- )
    {
        this.vaidators.push(requre('./validators/' + this.vaidators[i].name).bind(this.vaidators[i].params);
    }

    /**
     *
     */
    this.validate = function(value)
    {
        var valid = true;
        var messages = [];

        for( var v in this.validators )
        {
            var result = v(value);

            valid = valid && result.valid;
            if (result.message)
            {
                if( typeof result.message == typeof [] )
                {
                    messages = messages.concat(result.message);
                }
                else
                {
                    messages.push(result.message);
                }
            }
        }
    }
}

/**
 * A class that validates records, spec should be in the format { fieldname : [{ name : <>, params: <> }, ... ] }
 */
var RecordValidator = function (spec)
{
    this.validators = {};

    for( var field_name in spec )
    {
        this.validators[field_name] = new FieldValidator(spec[field_name]);
    }


    this.validate_field = function(field_name, value)
    {
        return this.validators[field_name].validate(value);
    }

    /**
     *
     */
    this.validate = function(record)
    {
        var success = true;
        var results = {};

        for ( var field_name in this.validators )
        {
            var result = this.validators[field_name].validate(record[field_name]);

            success = success && result.success;
            results[field_name] = result;
        }

        return { success : success, results : result };
    }
}
