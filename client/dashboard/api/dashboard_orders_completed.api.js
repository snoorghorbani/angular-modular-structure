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
        .run(['apiGateway', function (apiGateway) {

            apiGateway
                .context('dashboard')
                .action("OrdersCompleted")
                .type('GET')
                .schema({
                    //"Period": {},
                    "Result": {
                        "CompletedOrders": {},
                        "TotalOrders": {}
                    }
                })
                .virtual("ordersRate", 0)
                .getter("ordersRate", function (current) {
                    return (this.Result.CompletedOrders * 100 / this.Result.TotalOrders).toPrecision(2);
                })
                .notification("dashboard.Orders Completed of Dashboard start")
                .done()
            ;
        }])
;