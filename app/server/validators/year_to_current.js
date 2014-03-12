module.exports = function(value)
{
    var x = Number(value);

    if(isNaN(x))
    {
        this.invalid('Value is not a number');
    }
    else if ( x > new Date().getFullYear() )
    {
        this.invalid('The value cannot be greater then the current year');
    }
    else
    {
        this.valid();
    }
}
