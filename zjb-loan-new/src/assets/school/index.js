import './index.scss'

$(function () {
  initPage();
  bindEvent();
});

function initPage() {
}

function bindEvent() {
  let d1 = $('.school .news');
  d1.on('click', '.item', function(){
    let $t = $(this),
      t1 = $t.find('.t1').html(),
      t2 = $t.find('.t2').html();
    d1.find('.text .t1').html(t1);
    d1.find('.text .t2').html(t2);
    $t.addClass('hover').siblings().removeClass('hover');
  })
}
