$.ajax({
    type:'GET',
    url:'https://wwws.betterment.com/data/GetAllActivity',
    dataType:'xml',
    success:function (xml) {
        var bettermentActivityToQif = new BettermentActivityToQif(new BettermentQifBuilder(new QifBuilder()));
        var qif = bettermentActivityToQif.convertBettermentActivityXMLDoc($(xml));

        var dataUri = "data:text/plain;base64," + window.btoa(qif);
        $('a').html('Export QIF').attr({href: dataUri, target: '_blank'}).prependTo($('body'));
    },
    failure:function () {
        alert('Unable to export QIF');
    }
});