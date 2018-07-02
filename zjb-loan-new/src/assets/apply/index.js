import './index.scss';
import {selectDom} from '../common/module/select';

export function initApply () {
  bindEvent();
}



function bindEvent() {
    $('.apply-menu a').on('click', function(){
        let a = $(this);
        if(!a.hasClass('hover')){
            changeForm(a);
        }
    });


    function changeForm(a){
        $('.apply-menu a.hover').removeClass('hover');
        a.addClass('hover');
        $('.apply-form .aform').addClass('none').eq(a.index()).removeClass('none');
        $('.apply-form>h2>i').html(a.html());
        let btn = $('.apply-form .bot .btn');
        if(a.index()===3){
            btn.html('完成');
        }else{
            btn.html('下一步');
        }
    }
}

function submitForm(){
    // todo: submit form
}
