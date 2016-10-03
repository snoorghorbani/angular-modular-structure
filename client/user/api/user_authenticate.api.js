/**set action modal and data contract
 *  maybe : 
 *            apiGateway
 *              .context(controllerName)
                .action(actionName)
 *              .type(POST/PUT/DELETE?GET)
 *              .model(function(){})
 *              .schema({
 *					name:{
 *	 					IsRequired
 *	 					Default
 *	 					Type
 *	 					MaxLength
 *					}	 
 *              })
 *              .virtual(property_name , default_value)
 *              .getter(value_path,function(){})
 *              .setter(value_path,function(){})
 *              .notification(message);
 **/
angular
    .module('login')
        .run(['apiGateway', function (apiGateway) {

            apiGateway
                .context('user')
                .action("Authenticate")
                .type('POST')
                .schema({
                    "AccountName": { "IsRequired": true },
                    "Password": {},
                    "Result": {
                        "AccountName": {},
                        "EmailAddress": {},
                        "RoleCode": {}
                    }
                })
                .done()
            ;
        }])
;