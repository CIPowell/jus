module.exports = function(value)
{
    var exp = this.params.exp;
    if ( value.match(exp) )
    {
        this.valid('regex');
    }
    else
    {
        this.invalid('regex', this.params.fail_message ? this.param.fail_message : 'Did not match the regular expression ' + exp.toString());
    }
};
