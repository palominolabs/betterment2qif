$('a').html('Export QIF').attr('href', '#').prependTo($('body')).click(function () {
    $.ajax({
        type:'GET',
        url:'https://wwws.betterment.com/data/GetAllActivity',
        dataType:'xml',
        success:function (xml) {
            var bettermentActivityToQif = new BettermentActivityToQif(new BettermentQifBuilder(new QifBuilder()));
            var conversionResult = bettermentActivityToQif.convertBettermentActivityXMLDoc($(xml));

            if (conversionResult.numTransactions > 0) {
                window.open("data:text/plain;base64," + window.btoa(conversionResult.qif), "_blank");
            } else {
                alert('No transactions');
            }
        },
        failure:function () {
            alert('Unable to export QIF');
        }
    });
});