import './index.scss';
import html from './template.html';

export function startAnimate(){

    $('body').append(html);

    let div = $('.logindiv');
    div.show = function(){
        $('body').append('<div class="_masker"></div>');
        div.addClass('show');
    };
    div.hide = function(){
        $('._masker').remove();
        div.removeClass('show');
    };
    window.logindiv = div;

    bindEvent(div);
    setTimeout(function(){
        div.show();
    },100);

    function bindEvent(div){
        div.find('.close').on('click', div.hide);
        div.find('.regf .hd>a').eq(1).on('click', function(){
            div.find('.regf').addClass('none');
            div.find('.logf').removeClass('none');
        });
        div.find('.logf .hd>a').eq(0).on('click', function(){
            div.find('.regf').removeClass('none');
            div.find('.logf').addClass('none');
        });
    }
}
