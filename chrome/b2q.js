$('a').html('Export QIF').attr('href', '#').prependTo($('body')).click(function() {
    $.ajax({
        type:'GET',
        url:'https://wwws.betterment.com/data/GetAllActivity',
        dataType:'xml',
        success:function (xml) {
            var bettermentActivityToQif = new BettermentActivityToQif(new BettermentQifBuilder(new QifBuilder()));
            var qif = bettermentActivityToQif.convertBettermentActivityXMLDoc($(xml));

            var bb = new WebKitBlobBuilder();
            bb.append(qif);
            saveAs(bb.getBlob('application/octet-stream'), 'betterment.qif');
        },
        failure:function () {
            alert('Unable to export QIF');
        }
    });
});