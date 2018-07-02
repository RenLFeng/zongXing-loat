import './index.scss';

export function startAnimate() {
  initPage();
  bindEvent();
}

function initPage() {
    var swiper = new Swiper('.tab3con1 .swiper-container', {
        autoplay: 5000,
        speed: 1000,
        loop: true,
        slidesPerView: 'auto',
        pagination: '.tab3con1 .swiper-pagination',
        paginationClickable: true
    });
    console.info(swiper)
  function makesvg(percentage, inner_text){
    var inner_text = '';
    var abs_percentage = Math.abs(percentage).toString();
    var percentage_str = percentage;
    var classes = ""
    if(percentage < 0){
      classes = "danger-stroke circle-chart__circle--negative";
    } else if(percentage > 0 && percentage <= 30){
      classes = "warning-stroke";
    } else{
      classes = "success-stroke";
    }
    var svg = '<svg class="circle-chart" viewbox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg">'
      + '<circle class="circle-chart__background" cx="16.9" cy="16.9" r="15.9" />'
      + '<circle class="circle-chart__circle '+classes+'"'
      + 'stroke-dasharray="'+ abs_percentage+',100"    cx="16.9" cy="16.9" r="15.9" />'
      + '<g class="circle-chart__info">'
      + '   <text class="circle-chart__percent" x="17.9" y="15.5"></text>';

    if(inner_text){
      svg += '<text class="circle-chart__subline" x="16.91549431" y="22">'+inner_text+'</text>'
    }
    svg += ' </g></svg>';

    return svg
  }
  (function( $ ) {
    $.fn.circlechart = function() {
      this.each(function() {
        var percentage = $(this).data("percentage");
        var inner_text = $(this).text();
        $(this).append(makesvg(percentage,inner_text));
      });
      return this;
    };
  }( jQuery ));
}

function bindEvent() {
  $(".sec-profit .box6 > div").hover(function(){
    $(this).find(".pic").circlechart();
  },function(){
    $(this).find("svg").remove();
  });
  let secs = $('.section');
  $('body').on('click', '.sec-tabs .tabs a', function () {
    let $t = $(this);
    $t.addClass('hover').siblings().removeClass('hover');
    let d = secs[$t.index()];
    console.log($t.index());
    if ($t.index() === 0) {
      av.top(812 - 130);
    } else {
      av.top(d.offsetTop - 130);
    }
  });
  $('body').on('click', '.sec-qa .q', function () {
    $(this).toggleClass('close');
  });
  $(".card2 .item.fensan .bd .dot").hover(function(){
    var index=$(this).index();
    $(".card2 .item.fensan .bd .info>p").eq(index).show();
  },function(){
    var index=$(this).index();
    $(".card2 .item.fensan .bd .info >p").eq(index).hide();
  });
  $(".card2 .item.xiaoe .bd .dot").hover(function(){
    var index=$(this).index();
    $(".card2 .item.xiaoe .bd .info>p").eq(index).show();
  },function(){
    var index=$(this).index();
    $(".card2 .item.xiaoe .bd .info >p").eq(index).hide();
  });
  $(".card2 .item.fensan .bd .info >p,.card2 .item.xiaoe .bd .info >p").hover(function(){
    $(this).show();
  },function(){
    $(this).hide();
  });
  let d1 = $('.topnav'),
    d2 = $('.sec-tabs .tabs');
  let d2top = 0;
  $('.banner .big').on('load', function () {
    d2top = d2.offset().top - 74;
  });
  $(window).on('scroll', function () {
    if (!d2top) d2top = d2.offset().top - 74;
    let top = av.top();
    if (top > 120) {
      d1.addClass('fix');
    } else {
      d1.removeClass('fix');
    }
    for (let i = secs.length - 1; i >= 0; i--) {
      if (top > secs[i].offsetTop - 140) {
        d2.find('a').eq(i).addClass('hover').siblings().removeClass('hover');
        break;
      }
    }
    if (top > d2top) {
      d2.addClass('fix');
    } else {
      d2.removeClass('fix');
      d2.find('a.hover').removeClass('hover');
    }
  });
}
