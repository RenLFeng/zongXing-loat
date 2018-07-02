import './index.scss'


export function startPage() {
  initPage();
  bindEvent();
  topNav();
}

function initPage() {

}

function bindEvent() {
  let div = $('.subsite .sec-product');
  div.find('.tabs').on('click', 'a', function(){
    let $t = $(this);
    if($t.hasClass('hover_')) return;
    $t.addClass('hover_').siblings().removeClass('hover_');
    let idx = $t.index();
    let ss = div.find('.bd').addClass('load').html();
    ss = ss.replace(/产品名称\d+/g, '产品名称'+idx);
    setTimeout(function(){
      div.find('.bd').removeClass('load').html(ss);
    },300);
  });

  let div2 = $('.subsite .sec-honor .bd');
  let count = div2.find('.swiper-slide').length;
  div2.find('.page>b').html('1/'+count);
  var swiper = new Swiper('.subsite .sec-honor .swiper-container', {
    speed: 1000,
    loop: true,
    onSlideChangeEnd: resetHornor
  });
  div2.find('.prev').on('click', function () {
    swiper.swipePrev();
  });
  div2.find('.next').on('click', function () {
    swiper.swipeNext();
  });
  function resetHornor(){
    let d = swiper.getSlide(swiper.activeIndex);
    let idx = swiper.activeIndex || count;
    if (idx > count) idx = 1;
    div2.find('.page>b').html(`${idx}/${count}`);
  }
}

function topNav(){
  let div = $('.subsite-coupon');
  $('.rtopbtns .c1').on('click', function () {
    if(!div.hasClass('show')){
      div.addClass('show');
    }
  });
  $('.subsite-coupon .close').on('click', function () {
    div.removeClass('show');
  });
}
