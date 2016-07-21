angular
    .module('shortcuts')
        .service('shortcuts.service', ['$resource', 'locale', '_', 'personalize',
            function ($resource, locale, _, personalize) {
                var SHORTCUT = 'shortcut'
                this.addToShortcuts = function (item) {
                    var shortcuts = personalize.load(SHORTCUT) || [];
                    shortcuts.push(item);
                    personalize.save(SHORTCUT, shortcuts);
                }
                this.getItems = function () {
                    return personalize.load(SHORTCUT);
                }
            }])
;