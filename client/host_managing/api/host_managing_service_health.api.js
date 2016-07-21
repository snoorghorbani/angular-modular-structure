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
    .module('host_managing')
        .run(['apiGateway', function (apiGateway) {

            apiGateway
                .context('hostManaging')
                .action("ServiceHealth")
                .type('GET')
                .schema({
                    "ServiceStatus": {},
                    "ServiceUpTime": {},
                    "ServerUpTime": {}
                })
                .notification("host_managing.Service Health of Host Managing start")
                .done()
            ;
        }])
;