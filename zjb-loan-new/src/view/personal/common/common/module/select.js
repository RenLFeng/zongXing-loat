import "../styles/select.scss";

$.fn.dlChange = function(idx){
    let sel = this;
    let dt = sel.find('dt');
    let op = sel.find('dd>i').eq(idx);

    dt.next().removeClass('show');

    if(sel.data('index')==idx){
        return;
    }
    dt.html(op.html());
    sel.data('value', op.data('value')||op.html());
    sel.data('index', idx);
    sel.trigger('change');
};
export function selectDom(){

    $('body').on('click', 'dl.select>dt', function(){
        let active = $(this).next().hasClass('show');
        $('dl.select>dd.show').removeClass('show');
        if(!active){
            $(this).next().addClass('show');
        }
    });
    $('body').on('click', 'dl.select>dd>i', function(){
        let $t = $(this),
            sel = $t.parent().parent();
        sel.dlChange($t.index());
    });
    $('body').on('click touchend', function(event){
        let el = event.target || window.event.srcElement;
        if($(el).closest('dl.select').length==0){
            $('dl.select>dd.show').removeClass('show');
        }
    });
}
