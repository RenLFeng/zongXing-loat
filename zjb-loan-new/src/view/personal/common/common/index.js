
import './index.scss';
import $ from 'jquery';
window.av = {};
window.av.doing = false;
window.av.touch = "ontouchend" in document ? true : false;

// require('./module/extends');
// require('./module/ajax');
// require('./module/cookie');
// require('./module/dialog');
// require('./module/loadjs');


window.av.query = function (name, url) {
    if (!name || typeof name != 'string') return '';
    if (!url) url = window.location.href;
    var mat = new RegExp('(^|[?&])(?:' + name + ')=(.*?)(&|#|$)', 'i').exec(url);
    if (mat && mat.length >= 2) return decodeURIComponent(mat[2]);
    return '';
};
window.av.top = function (y) {
    if (typeof y == 'undefined') {
        var top1 = document.body.scrollTop;
        var top2 = document.documentElement.scrollTop;
        return top1 || top2;
    }
    document.body.scrollTop = y;
    document.documentElement.scrollTop = y;
};

window.av.getWeek = function (datestr) {
    var wk = ['日', '一', '二', '三', '四', '五', '六'];
    var day = new Date(datestr).getDay();
    return wk[day];
};

!(function(){
    if (!window.JSON) {
        var sc = document.createElement('script');
        sc.src = 'http://cdn.bootcss.com/json2/20160511/json2.min.js';
        document.head.appendChild(sc);
    }
}());
$(function(){
    $('body').on('click', '[data-href]', function (event) {
        window.location.href = $(this).attr('data-href');
        event.preventDefault();
    });

});
