app.service('notifyService', ['_', 'locale', function (_, locale) {
    var localize_then_show_message = function (type, textOrTitle, text, timeout, clickHandler, bodyOutputType) {
        var i18n = {
            path: 'common',
            text: ''
        };
        if (textOrTitle) {
            var temp = textOrTitle.split('.');
            i18n.path = temp.shift();
            i18n.text = temp.join('.');
        } else {
            i18n.text = 'default message';
        }
        locale.ready(i18n.path).then(function () {
            if (!UIkit.notify) return;
            var message = locale.getString([i18n.path, i18n.text].join('.'), {});
            UIkit.notify({
                message: message,
                status: type,
                timeout: 1000,
                pos: 'bottom-left',
            })
        });
    }

    this.success = _.leftCurry(localize_then_show_message)("success");

    this.error = _.leftCurry(localize_then_show_message)("danger");

    this.info = _.leftCurry(localize_then_show_message)("info");

    //this.wait = _.rightCurry(localize_then_show_message)("info");

    //this.warning = _.rightCurry(localize_then_show_message)("info");
}]);