function BettermentActivityToQif(bettermentQifBuilder) {

    function parseActivityXmlString(xmlDoc) {
        var transactions = [];

        $.each(xmlDoc.find('activities > transaction'), function (idx, node) {
            // Convert the xml node into an easy to work with JS object
            var transactionInfo = {};
            $.each(node.childNodes, function (idx, childNode) {
                transactionInfo[childNode.nodeName] = childNode.textContent;
            });

            // Turn the date string into a date object
            var dateParts = transactionInfo.date.split('/');
            var date = new Date(0);
            date.setDate(parseInt(dateParts[2], 10));
            date.setMonth(parseInt(dateParts[1], 10) - 1);
            date.setYear(parseInt(dateParts[0], 10));
            transactionInfo.date = date;

            // Parse bools/floats into native types
            transactionInfo.amount = parseFloat(transactionInfo.amount);
            transactionInfo.balance = parseFloat(transactionInfo.balance);
            transactionInfo.failed = transactionInfo.failed == "true";
            transactionInfo.pending = transactionInfo.pending == "true";

            // Store the txn
            transactions.push(transactionInfo);
        });

        return transactions;
    }

    var TRANSACTION_HANDLERS = {
        ACCOUNT_BONUS:'accountBonus',
        FEE:'fee',
        DIVIDEND:'dividend',
        DEPOSIT:'deposit',
        MARKET_CHANGE:'marketChange',
        WITHDRAWAL:'withdrawal'
    };

    this.convertBettermentActivityXMLDoc = function (xmlDoc) {
        var transactions = parseActivityXmlString(xmlDoc);

        var numTransactions = 0;
        $.each(transactions, function (idx, txn) {
            var functionName = TRANSACTION_HANDLERS[txn.type];
            if (functionName) {
                bettermentQifBuilder[functionName](txn.date, txn.amount);
                numTransactions++;
            }
        });

        return {
            qif:bettermentQifBuilder.toQifString(),
            numTransactions:numTransactions
        };
    };
}