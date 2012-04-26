var $body = $('body');
var $bettermentToQif = $('<div>').css('padding', '5px').prependTo($body);
var $exportLink = $('<a>').css({display:'block', float:'left', 'line-height':'30px', 'margin-right':'10px'}).html('Export QIF').attr('href', '#').appendTo($bettermentToQif);
var $loadingImage = $('<img>').css({display:'none', height:'30px'}).attr('src', getExtensionResourceURL('images/loading-spinner.gif')).appendTo($bettermentToQif);
var $finalBalance = $('<div>').css({float:'left', 'line-height':'30px', 'margin-right':'10px'}).appendTo($bettermentToQif);
$('<br>').css('clear', 'both').appendTo($bettermentToQif);

$exportLink.click(function () {
    $loadingImage.show();

    $.ajax({
        type:'GET',
        url:'https://wwws.betterment.com/data/GetAllActivity',
        dataType:'xml',
        success:function (xml) {
            var bettermentActivityToQif = new BettermentActivityToQif(new BettermentQifBuilder(new QifBuilder()));
            var conversionResult = bettermentActivityToQif.convertBettermentActivityXMLDoc($(xml));

            if (conversionResult.numTransactions > 0) {
                $finalBalance.html('Computed balance: $' + conversionResult.computedBalance.toFixed(2));
                window.open("data:text/plain;base64," + window.btoa(conversionResult.qif), "_blank");
            } else {
                alert('No transactions');
            }
        },
        failure:function () {
            alert('Unable to export QIF');
        },
        complete:function () {
            $loadingImage.hide();
        }
    });
});