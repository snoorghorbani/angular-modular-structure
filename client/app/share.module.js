angular
    .module('share', [
        "main_sidebar"
    ])
    .config(function () { })
    .value("share_module_config", {
        show_$id: false,
        debug_mode: true
    })
    .constant('constants', {})
    .run(function () { });