
/**
 * api: string
 * data: object
 * method: get|post|xxx
 * success: function
 * error: function
 */
av.ajax = function (options) {

    if (!options.method) {
        options.method = !!options.data ? 'post' : 'get';
    }
    var method = options.method.toUpperCase();

    function success(res) {
        av.waitok();
        if (typeof res == 'string' && '[{'.indexOf(res[0]) > -1) {
            res = JSON ? JSON.parse(res) : eval('(' + res + ')');
        }
        av.ajax_res = res;
        if (res.success) {
            options.success && options.success(res.result);
            return;
        }
        av.alert({
            title: '',
            body: res.error.message
        });
        options.error && options.error(res.error);
    }

    function error(xhr, status, error) {
        var res = xhr.responseText;
        if (res[0] == '{') {
            res = JSON ? JSON.parse(res) : eval('(' + res + ')');
            success(res);
            return;
        }
        av.waitok();
        av.alert({
            title: '',
            body: '网络异常，请稍后重试'
        });
        options.error && options.error({
            message: ''
        });
    }
    var ajaxopt = {
        url: options.api,
        data: options.data,
        dataType: 'json',
        method: method,
        type: method,
        timeout: 30000,
        headers: {
            Accept: 'application/json'
        },
        success: success,
        error: error
    };
    if (method == 'POST') {
        av.wait();
        if (options.data) {
            ajaxopt.data = JSON.stringify(options.data);
            ajaxopt.contentType = 'application/json';
        }
    }

    $.ajax(ajaxopt);
};