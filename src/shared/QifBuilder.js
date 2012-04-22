var INVESTMENT_ACCOUNT_HEADER = "!Type:Invst";

function QifBuilder() {

    var lines = [INVESTMENT_ACCOUNT_HEADER];

    function formatDate(date) {
        var month = '' + (date.getMonth() + 1);
        if (month.length == 1) {
            month = '0' + month;
        }

        var dayOfMonth = '' + date.getDate();
        if (dayOfMonth.length == 1) {
            dayOfMonth = '0' + dayOfMonth;
        }
        return [date.getFullYear(), month, dayOfMonth].join('-');
    }

    function addRecord(date, type, newLines) {
        lines.push("D" + formatDate(date));
        if (type) {
            lines.push("N" + type);
        }
        lines = lines.concat(newLines);
        lines.push("^", "");
    }

    this.toQifString = function () {
        return lines.join("\n");
    };

    this.dividend = function (date, stockSymbol, amount) {
        addRecord(date, "Dividend", ["Y" + stockSymbol, "T" + amount]);
    };

    this.buy = function (date, stockSymbol, numShares, pricePerShare) {
        addRecord(date, "Buy", ["Y" + stockSymbol, "I" + pricePerShare, "Q" + numShares]);
    };

    this.sell = function (date, stockSymbol, numShares, pricePerShare) {
        addRecord(date, "Sell", ["Y" + stockSymbol, "I" + pricePerShare, "Q" + numShares]);
    };

    this.adjust = function (date, amount, options) {
        options = options || {};
        var newLines = ["T" + amount];
        if (options.payee) {
            newLines.push("P" + options.payee);
        }
        if (options.memo) {
            newLines.push("M" + options.memo);
        }
        addRecord(date, undefined, newLines);
    };
}