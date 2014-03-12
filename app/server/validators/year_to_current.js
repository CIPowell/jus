module.exports = function(value)
{
    var x = Number(value);

    if(isNaN(x))
    {
        this.invalid('year_to_current', 'Value is not a number');
    }
    else if ( x > new Date().getFullYear() )
    {
        this.invalid('year_to_current', 'The value cannot be greater then the current year');
    }
    else
    {
        this.valid('year_to_current');
    }
}
