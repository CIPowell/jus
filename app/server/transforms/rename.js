module.exports = function(obj)
{
    obj.field_name = this.params.name;
    
    this.callback(obj, this.idx);
}
