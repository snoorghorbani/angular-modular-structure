/**set action modal and data contract
 *  maybe : 
 *            apiGateway
 *              .context(controllerName)
                .action(actionName)
 *              .post(POST/PUT/DELETE?GET)
 *              .model(function(){})
 *              .schema({
 *					name:{
 *	 					IsRequired
 *	 					Default
 *	 					Type
 *	 					MaxLength
 *					}	 
 *              })
 *              .getter(value_path,function(){})
 *              .setter(value_path,function(){})
 *              .notification(message);
 **/
angular
    .module('dashboard')
        .run(['apiGateway', '_', function (apiGateway, _) {

            apiGateway
                .context('dashboard')
                .action("DailySalesAmount")
                .type('POST')
                .schema({
                    "Period": {},
                    "Result": {
                        "Items": [{
                            "Date": {},
                            "TotalNumber": {},
                            "TotalNetAmount": {}
                        }]
                    }
                })
                .getter("Result.Items.Date", function (value) {
                    return new Date(moment(value).format());
                })
                .notification("dashboard.Daily Sales Amount of Dashboard start")
                .done()
            ;
        }])
;