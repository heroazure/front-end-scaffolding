/**
 * Created by xiaolijun on 2016/1/4.
 */
define(function (require, exports, module) {
    var $ = require("../plugin/jquery.js");
    require("../plugin/mustache.min.js");
    var callLoad=true;//避免快速滚动加载多次重复数据

    module.exports={
        handle: paging
    }
    function paging(optional){

        var that=this;

        optional=optional||{};
        //简单起见，以$开头命名的属性都为jquery对象
        var opt={
            page:optional.page,//请求页码
            url:optional.url||"/",//api
            tpl:optional.tpl||"",//列表项模板
            emptyTpl:optional.emptyTpl||"",//maxpage为0显示空模板
            $loadMore:optional.$loadMore||$("#load-more-record"),//加载更多的页面元素
            $targetContainer:optional.$targetContainer||$("#container"),//最外层包裹的容器，当maxpage为0时，容器只显示空数据模板
            $listContainer:optional.$listContainer,//当列表数据不是放在loadmore之前时，提供一个列表数据容器
            data: optional.data||{},//传递到接口的参数
            dataCallback:optional.dataCallback,//ajax获取成功之后的json数据处理回调函数，参数为返回的json对象
            initCallback:optional.initCallback,//加载第一页时回调
            isLoop:optional.isLoop||false//循环获取页数，当为true时，到了最后一页请求第一页
        }
        if(!opt.$loadMore){
            return;
        }
        if(!opt.page){//不给page属性时从loadmore中获取，此时一般都是加载页码大于1的情况
            var nextpage=parseInt(opt.$loadMore.data("currpage"))+1;
            opt.isLoop&&that.maxpage<nextpage&&(nextpage=1);//重置为第一页
            opt.data.page=opt.page=nextpage;
        }else{//加载第一页记得给page属性值
            opt.data.page=opt.page;
        }
        //默认为get请求
        $.ajax({
            dataType: "Json",
            //cache:false,
            url: opt.url,
            data: opt.data,
            beforeSend: function (xhr) {
                if(!callLoad){//避免快速滚动加载多次重复数据
                    return false;
                }
                callLoad=false;
                if(that.maxpage!="undefined"&&that.maxpage<opt.page){//非第一次加载并且请求的页码大于最大页数，不发送ajax请求
                    callLoad=true;
                    return false;
                }else{
                    opt.$loadMore.text("正在加载中...");
                }
            },
            success: function (json) {
                var data = json.data.data;
                !that.maxpage&&(that.maxpage=json.data.maxpage);
                if (parseInt(opt.page) == 1) {
                    opt.initCallback&&opt.initCallback(that.maxpage,json)
                }
                if (data && Array.isArray(data) && data.length) {
                    if (parseInt(opt.page) == 1) {
                        if(opt.$listContainer){
                            opt.$listContainer.children().remove();
                        }else{
                            opt.$loadMore.prevAll().remove();
                        }
                    }
                    var tpl = opt.tpl;
                    Mustache.parse(tpl);
                    opt.dataCallback&&opt.dataCallback(data,that.maxpage,json);
                    var render = Mustache.render(tpl, {"items": data});
                    if(opt.$listContainer){
                        opt.$listContainer.append(render);
                    }else{
                        opt.isLoop&&opt.$loadMore.prevAll().remove();
                        opt.$loadMore.before(render);
                    }
                    opt.$loadMore.data("currpage", opt.page);
                    if(that.maxpage<=opt.page){
                        opt.$loadMore.hide();
                    }else{
                        opt.$loadMore.text("加载更多...").show();
                    }
                } else {
                    if (parseInt(opt.page) == 1) {
                        opt.$targetContainer.html(opt.emptyTpl);
                    } else {
                        opt.$loadMore.hide();
                    }
                }
            },
            complete: function () {
                callLoad=true;
            }
        });
    }
});