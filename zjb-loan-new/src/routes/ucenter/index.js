import './index.scss'
import $ from 'jquery';

function initPage() {
}

function bindEvent() {
    $('.uc-lbody>.navbox').on('click', '.hd>a,.folder>a', function(){
        $(this).parent().toggleClass('hover');
    });
}
