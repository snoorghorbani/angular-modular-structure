angular
    .module('api_gateway')
        .config(function (apiGatewayProvider, _Provider) {
            window._date = _Provider._.date;
            window._is = _Provider._.is;
            apiGatewayProvider.set_data_type_getter({
                "date": function (value) {
                    //var date = moment(value).format("YYYY-MM-DD").split('-');
                    //return _Provider._.date.georgian.to.persian(date[0], date[1], date[2]).join('/');
                    var date = new Date(value.match(/\d+/)[0] * 1);
                    return _Provider._.date.georgian.to.persian(date.getUTCFullYear(), date.getMonth() + 1, date.getDate(), '/');
                }
            });
        })
;