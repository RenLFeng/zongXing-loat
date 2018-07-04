av.loadjs = function (src, callback) {
    var sc = document.createElement('script');
    sc.type = 'text/javascript';
    sc.src = src;
    if (callback) {
        if (document.addEventListener) {
            sc.addEventListener("load", callback, false);
        } else {
            sc.onreadystatechange = function () {
                if (/loaded|complete/.test(sc.readyState)) {
                    sc.onreadystatechange = null;
                    callback();
                }
            };
        }
    }
    document.body.appendChild(sc);
};
