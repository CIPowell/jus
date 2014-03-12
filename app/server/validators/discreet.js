module.exports = function(value)
{
    if(this.params.values.indexOf(value) === -1)
    {
        this.invalid('discreet', 'Value must be one of ' + this.params.values.join(', '));
    }
    else
    {
        this.valid('discreet');
    }
};
