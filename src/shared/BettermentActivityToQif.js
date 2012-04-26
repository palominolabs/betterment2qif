function BettermentActivityToQif(bettermentQifBuilder) {

    function assertLoggedIn(xmlDoc) {
        if (xmlDoc.find('error').length > 0) {
            throw "Not logged in";
        }
    }

    function parseActivityXmlString(xmlDoc) {
        var transactions = [];

        assertLoggedIn(xmlDoc);

        $.each(xmlDoc.find('activities > *'), function (idx, node) {
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
            transactionInfo.typeID = parseInt(transactionInfo.typeID);
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
        0:'withdrawal', // to an external bank account
        1:'deposit', // from an external bank account
        2:'marketChange',
        3:'fee',
        4:'dividend',
        // 9: allocation change
        // 10: ?
        // 11: ?
        // 12: ?
        // 13: ?
        // 14: ?
        // 15: ?
        // 16: ?
        // 17: rebalance
        // 18: stock market update
        19:'accountBonus',
        22:'withdrawal', // to another goal
        23:'deposit' // from another goal
    };

    this.convertBettermentActivityXMLDoc = function (xmlDoc) {
        var transactions = parseActivityXmlString(xmlDoc);

        var numTransactions = 0;
        $.each(transactions, function (idx, txn) {
            var functionName = TRANSACTION_HANDLERS[txn.typeID];
            if (functionName) {
                bettermentQifBuilder[functionName](txn.date, txn.amount);
                numTransactions++;
            }
        });

        return {
            qif:bettermentQifBuilder.toQifString(),
            numTransactions:numTransactions,
            computedBalance:bettermentQifBuilder.bettermentSharePrice * bettermentQifBuilder.bettermentSharesHeld
        };
    };
}