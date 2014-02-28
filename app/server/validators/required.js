module.exports = function(value)
{
    if( value === undefined || value === '' )
    {
        this.invalid('required', 'value is required');
    }
    else
    {
        this.valid('required');
    }
};
