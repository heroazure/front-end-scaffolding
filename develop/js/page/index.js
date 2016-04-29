/**
 * Created by heroxiao on 2016/4/28.
 */
define(function (require, exports, module) {
    var $=require('$')

    $(function () {
        console.log(11)
        var paging=require('paging')
        paging().firstPage()
        //require('mm')
        /*var ob={
            status:true,
            handle: function () {
                console.log(this.status)
                this.status=false
            },
            change: function () {
                this.status=!this.status
            }
        }*/
    })
});