$(function() {
	$.ajax({
		type: 'GET',
		url: 'https://wwws.betterment.com/data/GetAllActivity',
		dataType: 'xml',
		success: function(xml) {
			var bb = new WebKitBlobBuilder();

			$.each(xml.documentElement.childNodes, function(idx, node) { 
				if (node.nodeName == 'transaction') {
					var transactionInfo = {};
					$.each(node.childNodes, function(idx, childNode) {
						transactionInfo[childNode.nodeName] = childNode.textContent;
					});
					transactionInfo.amount = parseFloat(transactionInfo.amount);
					transactionInfo.balance = parseFloat(transactionInfo.balance);
					transactionInfo.failed = transactionInfo.failed == "true";
					transactionInfo.pending = transactionInfo.pending == "true";
					console.log(transactionInfo);
				}
			});

			bb.append(xml);
			saveAs(bb.getBlob('text/plain;charset=ascii'), "bb.txt");
		},
		failure: function() {
			alert('Unable to export QIF');
		}
	});
});