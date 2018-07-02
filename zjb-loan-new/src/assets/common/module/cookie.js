av.cookie = {
    get: function (key) {
        var mat = new RegExp('(^|[^a-z])' + key + '=(.*?)(;|$)', 'i').exec(document.cookie);
        return mat ? decodeURIComponent(mat[2]) : '';
    },
    set: function (key, value, hours) {
        var ck = name + '=' + encodeURIComponent(value);
        if (hours) {
            var date = new Date();
            date.setTime(date.getTime() + hours * 3600 * 1000);
            ck += "; expires=" + date.toGMTString();
        }
        ck += '; path=/';
        document.cookie = ck;
    }
};