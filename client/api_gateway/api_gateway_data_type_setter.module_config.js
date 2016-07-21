angular
    .module('api_gateway')
        .config(function (apiGatewayProvider, _Provider) {
            apiGatewayProvider.set_data_type_setter({
                "date": function (value) {
                    if (!value) return "";

                    var jalaliDate = value.split('/');
                    return _Provider._.date.persian.to.georgian(parseInt(jalaliDate[0]), parseInt(jalaliDate[1]), parseInt(jalaliDate[2]), '/');
                }
            });
        })
;