angular
    .module('api_gateway')
        .config(function (apiGatewayProvider) {
            apiGatewayProvider.set_data_type_schema({
                "Password": {
                    "Type": "Password",
                    "IsRequired": true,
                    "MinLength": 6
                },
                "EmailAddress": {
                    "Type": "email"
                },
                "PagingInfo": {
                    "PageNo": {
                        "Type": "number",
                        "IsRequired": true,
                        "Default": 1
                    },
                    "PageSize": {
                        "Type": "number",
                        "IsRequired": true,
                        "Default": 5
                    }
                },
                "SortingInfo": {
                    "FieldName": {
                        "InputType": "select",
                        "IsRequired": true,
                        "Default": "ProductName",
                        "options": ["ProductName", "TotalSoldNumber"]
                    },
                    "Direction": {
                        "Type": "select",
                        "IsRequired": true,
                        "Default": "ASC",
                        "options": ["ASC", "DESC"]
                    }
                },
                "Period": {
                    "Start": {
                        "Type": "date",
                        "InputType": "mask",
                        "Pattern": "(13)\\d{2}\\/(0[1-9]|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])",
                        "IsRequired": true,
                        "Default": "1390/1/1"
                    },
                    "End": {
                        "Type": "date",
                        "InputType": "mask",
                        "Pattern": "(13)\\d{2}\\/(0[1-9]|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])",
                        "IsRequired": true,
                        "Default": "1399/12/12"
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
                }
            });
        });