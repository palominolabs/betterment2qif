var $body = $('body');
var $bettermentToQif = $('<div>').css('padding', '5px').prependTo($body);
var $accountsDropdown = $('<select>').css({display:'non', float:'left', 'line-height':'30px', 'margin-right':'10px'}).appendTo($bettermentToQif);
var $exportLink = $('<a>').css({display:'none', float:'left', 'line-height':'30px', 'margin-right':'10px'}).html('Export QIF').attr('href', '#').appendTo($bettermentToQif);
var $loadingImage = $('<img>').css({height:'30px'}).attr('src', getExtensionResourceURL('images/loading-spinner.gif')).appendTo($bettermentToQif);
var $finalBalance = $('<div>').css({float:'left', 'line-height':'30px', 'margin-right':'10px'}).appendTo($bettermentToQif);
var $finalBETTERMENTSharePrice = $('<div>').css({float:'left', 'line-height':'30px'}).appendTo($bettermentToQif);
$('<br>').css('clear', 'both').appendTo($bettermentToQif);

BettermentApi.getAccounts(function (accounts) {
    if (accounts.length == 0) {
        alert('No Betterment accounts');
    } else {
        $.each(accounts, function (idx, account) {
            $('<option>').attr('value', account.id).html(account.name).appendTo($accountsDropdown);
        });
        $exportLink.show();
    }

    $loadingImage.hide();
}, function () {
    alert('Unable to export QIF');
});

$exportLink.click(function () {
    $loadingImage.show();

    BettermentApi.getAccountActivity($accountsDropdown.val(), function ($xml) {
            try {
                $loadingImage.hide();

                var bettermentActivityToQif = new BettermentActivityToQif(new BettermentQifBuilder(new QifBuilder()));
                var conversionResult = bettermentActivityToQif.convertBettermentActivityXMLDoc($xml);

                if (conversionResult.numTransactions > 0) {
                    $finalBalance.html('Computed balance: $' + conversionResult.computedBalance.toFixed(2));
                    $finalBETTERMENTSharePrice.html('Final BETTERMENT imaginary stock share price: $' + conversionResult.sharePrice.toFixed(2));
                    window.open("data:text/plain;base64," + window.btoa(conversionResult.qif), "_blank");
                } else {
                    alert('No transactions');
                }
            } catch (e) {
                alert(e);
            }

    }, function () {
        $loadingImage.hide();
        alert('Unable to export QIF');
    });
});