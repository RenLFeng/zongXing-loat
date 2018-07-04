
av.wait = function (msg) {
    if ($('.modal input').length == 0) {
        $('.modal').remove();
    }
    $('.modal2,.loading').remove();

    var nomodal = $('.modal').length == 0;

    var s = '';
    if (nomodal) s += '<div class="modal modal2">';
    //s += '<div class="loading"><p>{0}</p></div>'.format(msg || 'Loading...');
    s += '<div class="loading"></div>';
    if (nomodal) s += '</div>';
    $(nomodal ? 'body' : '.modal').append(s);
    av.doing = true;
};
av.waitok = function () {
    $('.modal2,.loading').remove();
    av.doing = false;
};
av.delmodal = function () {
    $('html,body').removeClass('body-hide body-fix');
    $('.modal').css('visibility', 'hidden');
    setTimeout(function () {
        $('.modal').remove();
    }, 300);
};


/**
 * av.alert({title:'', body:'', buttons:[]})
 * button: {text:'', click:function(){}, href:''}
 */
!(function ($) {
    var focus_flag = false;
    var h_window = $(window).height();
    var $body, scrollTop, handler;

    function alert(title, msg, btn, func_ok) {
        var options = arguments[0];
        if (typeof options == 'string') {
            options = {
                title: title,
                body: msg
            };
            if (!!btn) {
                options.buttons = [{
                    text: btn,
                    click: (typeof func_ok == 'string' ? null : func_ok),
                    href: (typeof func_ok == 'string' ? func_ok : '')
                }];
            }
        }
        if (!options.buttons) {
            options.buttons = [];
        }
        if (!options.title) {
            options.body = '<p class="tishi">{0}</p>'.format(options.body);
        }
        var s = '<div class="modal modal3">' +
            '<div class="_masker"></div>' +
            '<div class="_dialog">' +
            '<div class="_header"><p class="_title">{0}</p></div>' +
            '<div class="_body scrollbd">{1}</div>' +
            '<div class="_foot"></div>' +
            '<a class="_close"></a>' +
            '</div></div>';
        s = s.format(options.title, options.body);
        $('.modal').remove();
        $(document.body).append(s);
        $body = $('.modal ._body');

        $(document.body).addClass('body-fix');

        // button
        var btncnt = options.buttons.length;
        for (var i = 0; i < btncnt; i++) {
            var btn = options.buttons[i];
            var $a = $('<a class="btn{0}-{1}">{2}</a>'.format(btncnt, i, btn.text));
            $('._dialog ._foot').append($a);

            if (btn.href) $a.attr('href', btn.href);
            else if (btn.click) $a.on('click', btn.click);
            else $a.on('click', function () {
                var e = $('.modal ._close')[0];
                e.click();
                window.useFast && e.click();
            });
        }
        // 没有滚动条的时候，阻止滚动-
        if ($body.height() + 10 > $body[0].scrollHeight) {
            // 事件绑定在modal上
            $('.modal').on('touchmove', function (event) {
                event.preventDefault();
            });
        }

        $('.modal ._close').on('click', av.delmodal);

        $('.modal').on('click', function (event) {
            var $t = $(event.target);
            if ($t.hasClass('_masker')) {
                av.delmodal();
            }
        });
    }

    av.alert = alert;
})(jQuery);