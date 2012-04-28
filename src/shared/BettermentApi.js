BettermentApi = {
    getAccounts:function (successCallback, errorCallback) {
        $.ajax({
            type:'GET',
            dataType:'xml',
            url:'/data/GetAggregateHomeInfo',
            success:function (xml) {
                var $xml = $(xml);
                var errors = $xml.find('errors');
                if (errors.length > 0) {
                    errorCallback();
                } else {
                    var accounts = [];
                    $.each($xml.find('account'), function (idx, account) {
                        accounts.push({
                            id:$(account).find('accountId').text(),
                            name:$(account).find('name').text()
                        });
                    });
                    successCallback(accounts);
                }
            },
            error:errorCallback
        });
    },

    getAccountActivity:function (accountId, successCallback, errorCallback) {
        $.ajax({
            type:'GET',
            dataType:'xml',
            url:'/data/GetAllActivity?account=' + accountId,
            success:function (xml) {
                var $xml = $(xml);
                var errors = $xml.find('errors');
                if (errors.length > 0) {
                    errorCallback();
                } else {
                    successCallback($xml);
                }
            },
            error:errorCallback
        });
    }
};