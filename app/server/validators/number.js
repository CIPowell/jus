module.exports = function(value)
{
    var x = Number(value);

    if(isNaN(x))
    {
        this.invalid('number', 'Value is not a number');
    }
    else if ( this.params.min && x < this.params.min )
    {
        this.invalid('number', 'Value must be equal to or greater than ' + this.params.min);
    }
    else if ( this.params.max && x > this.params.max )
    {
        this.invalid('number', 'Value must be equal to or less than ' + this.params.max);
    }
    else
    {
        this.valid('number');
    }
}
