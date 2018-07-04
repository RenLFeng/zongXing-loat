String.prototype.format = function () {
    var s = this,
        data = {};
    if (typeof arguments[0] === 'object') {
        data = arguments[0];
    } else {
        for (var i = 0; i < arguments.length; i++) {
            data[i] = arguments[i];
        }
    }
    s = s.replace(/\{(\w+)\}/gi, function (a, b) {
        return data[b] || '';
    });
    return s;
};
// tp=5: yyyy-MM-dd HH:mm
// tp=4: MM-dd HH:mm
// tp=1: Date
String.prototype.date = function (tp) {
    if (tp == 1) {
        var dd = this.split(/\D+/);
        if (dd.length < 3) return null;
        while (dd.length < 6) dd.push(0);
        return new Date(dd[0], dd[1] - 1, dd[2], dd[3], dd[4]);
    }
    if (tp == 4) {
        return this.substr(5, 11).replace('T', ' ');
    }
    return this.substr(0, 16).replace('T', ' ');
};