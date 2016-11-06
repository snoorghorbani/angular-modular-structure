angular
    .module('api_gateway')
        .config(function (apiGatewayProvider) {
            apiGatewayProvider.set_data_type_schema({
                "Password": {
                    "type": "Password",
                    "required": true,
                    "minLength": 6
                },
                "EmailAddress": {
                    "type": "email"
                },
                "PagingInfo": {
                    "PageNo": {
                        "type": "number",
                        "required": true,
                        "default": 1
                    },
                    "PageSize": {
                        "type": "number",
                        "required": true,
                        "default": 15
                    }
                },
                "SortingInfo": {
                    "FieldName": {
                        "inputType": "select",
                        "required": true,
                        "default": "ProductName",
                        "options": ["ProductName", "TotalSoldNumber"]
                    },
                    "Direction": {
                        "type": "select",
                        "required": true,
                        "default": "ASC",
                        "options": ["ASC", "DESC"]
                    }
                },
                "Period": {
                    "Start": {
                        "type": "date",
                        "inputType": "mask",
                        "pattern": "(13)\\d{2}\\/(0[1-9]|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])",
                        "required": true,
                        "default": "1390/1/1"
                    },
                    "End": {
                        "type": "date",
                        "inputType": "mask",
                        "pattern": "(13)\\d{2}\\/(0[1-9]|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])",
                        "required": true,
                        "default": "1399/12/12"
                    }
                },
                "PriceComponent": {
                    "BasePrice": {},
                    "NetAmount": {},
                    "DiscountAmount": {},
                    "VatAmount": {
                        "Tax": {},
                        "MunicipalityTax": {}
                    },
                    "GrossAmount": {}
                },
                "OnlinePayment": {
                    "TransactionRefrenceId": {},
                    "PaymentDateTime": {}
                },
                "ExpiryDateTime": {
                    "type": "date",
                    "inputType": "mask",
                    "pattern": "(13)\\d{2}\\/(0[1-9]|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])",
                }
            });
        });