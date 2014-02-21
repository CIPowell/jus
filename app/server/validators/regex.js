module.exports = function(value)
{
    var exp = this.exp;
    if ( value.match(exp) )
    {
        return { success : true, message : undefined };
    }
    else
    {
        return { success : false, message : this.fail_message ? this.fail_message : 'Did not match the regular expression' };
    }
};
