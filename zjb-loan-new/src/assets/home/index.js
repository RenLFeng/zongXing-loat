import './index.scss';
import {animate} from './animate';
import {init} from './_invest';
import $ from 'jquery';

export function startAnimate() {

  initPage();
  bindEvent();
  animate();
}
function initPage() {
  let speed=1200;
  let page=0;
  let index=0;
  let time=null;
  let istrue=true;
  showText1();
  function showText1(){
    addClas();
    if(istrue){
      index=0;
    }else{
      index=-1;
    }
    time=setInterval(function(){
      index++;
      move(index);
      if(index==3 && page==0){
        page=1;
        index=0;
        clearInterval(time);
        time=null;
        setTimeout(showText2,3000);
      }
    },speed)
  }
  function showText2(){
    addClas();
    time=setInterval(function(){
      move(index);
      index++;
      if(index==3 && page==1){
        page=2;
        index=0;
        clearInterval(time);
        time=null;
        setTimeout(function(){
          $(".home-banner .w >p.item span").removeClass("act");
          showText3();
        },3000);
      }
    },speed)
  }
  function showText3(){
    addClas();
    time=setInterval(function(){
      move(index);
      index++;
      if(index==3 && page==2){
        page=0;
        index=0;
        clearInterval(time);
        time=null;
        istrue=false;
        setTimeout(function(){
          $(".home-banner .w >p.item span").removeClass("act");
          showText1();
        },3000);
      }
    },speed)
  }
  function move(index){
    $(".home-banner .w p.act span").eq(index).addClass("act");
  }
  function addClas(){
    $(".home-banner .w >p.item").eq(page).addClass("act").siblings().removeClass("act");
  }
}
function bindEvent() {
  $('.home-banner').on('click', function(){
    $('.home-banner video')[0].play();
  });
  $(".tab3_ >a").on("click",function(){
    let index=$(this).index();
    let tit=$(this).data("tit");
    $(this).addClass("hover").siblings().removeClass("hover")
    //$(".sec-tab3.g .tab-con").find("."+tit).show().siblings().hide();
    // $(".sec-tab3.g .tab-con .con").eq(index).addClas("con1").siblings().removeClass("con1");
    $(".sec-tab3.g .tab-con .con").eq(index).addClass("con1").siblings().removeClass("con1");
    //$(".sec-tab3.g .tab-con .con").addClass(tit);
  })
}

