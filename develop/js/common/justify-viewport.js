/**
 * Created by heroxiao on 2016/4/23.
 */
//适合移动端web设计自动调整html font-size
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>640){
                docEl.style.fontSize='28px'
            }else{
                docEl.style.fontSize = 16 * (clientWidth / 375) + 'px';//假设这里就是以iphone 6为例
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);