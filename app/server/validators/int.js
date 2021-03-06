module.exports = function(value)
{
    var x = Number(value);

    if(isNaN(x))
    {
        this.invalid('int', 'Value is not a number');
    }
    else if( x % 1 !== 0 )
    {
        this.invalid('int', 'Value is not an integer');
    }
    else if ( this.params.min && x < this.params.min )
    {
        this.invalid('int', 'Value must be equal to or greater than ' + this.params.min);
    }
    else if ( this.params.max && x > this.params.max )
    {
        this.invalid('int', 'Value must be equal to or less than ' + this.params.max);
    }
    else
    {
        this.valid('int');
    }
}
