
var Jus = (function()
{
    "use strict";
    /**
     * File Uploader widget
     */
    function Uploader(div)
    {
        this.checkAPI = function()
        {
            return !!(window.File && window.FileReader && window.FileList && window.Blob);
        }

        this.getForm = function()
        {
            var par = this.div.parentNode;
            while ( par && par.tagName.toLowerCase() != 'form' ) {  par = par.parentNode; }
            return par;
        }

        this.div = div;
        this.form = this.getForm();

        // Check to see if the browser supports this API, if not forget it and use the non-JS method
        if( ! this.checkAPI() ) {
            return;
        }
        else
        {


        }

        this.upload = function(res, req)
        {
            res.send('hello');
        }
    }

    return { Uploader : Uploader };
})();
