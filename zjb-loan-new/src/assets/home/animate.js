import "./_animate.scss";
import $ from 'jquery';
import { knob } from '../common/module/knob';

export function animate(){
    let secs = [{
        el: $('.sec-proj'),
        func: project
    }, {
        el: $('.sec-touzi'),
        func: touzi
    }, {
        el: $('.sec-rongzi'),
        func: rongzi
    }, {
        el: $('.sec-tab3'),
        func: tab3
    }];
      try {
        secs.forEach(function (e) {
            e.middle = e.el[0].offsetTop + e.el[0].offsetHeight/2;
        });
    } catch(e) {

    }
    let wh = $(window).height();
    function scroll() {
        let top = window.av.top();
        secs.forEach(function (e) {
            // 出来了一半，或没有完全卷走，视为在可视区域-
            if (!e.called && e.middle < top + wh && e.middle > top) {
                e.called = true;
                e.func(e.el);
            }
        });
    }
    scroll();
    $(window).on('scroll', scroll);

}
function project(el) {
    knob();
}

function touzi(el) {
    el.find('.sec1').addClass('bounceInDown animated');
    el.find('.sec2').addClass('bounceInLeft animated');
    el.find('.sec3').addClass('bounceInRight animated');
}

function rongzi(el) {
    el.find('.sec1').addClass('bounceInDown animated');
    el.find('.sec2').addClass('bounceInLeft animated');
    el.find('.sec3').addClass('bounceInRight animated');
}

function tab3(el) {
    el.find('.line').addClass('show');
    setTimeout(function(){
        el.find('video').removeClass('hide').addClass('zoomIn animated');
    },500);
}
