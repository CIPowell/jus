module.exports = function (obj)
{
    delete obj.field_name;   
    delete obj.value;
    
    this.callback(obj);
}