var INVESTMENT_ACCOUNT_HEADER = "!Type:Invst";
var MONTH_NAMES =  [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

function QifBuilder() {

	var lines = [INVESTMENT_ACCOUNT_HEADER];

	function formatDate(date) {
		return [date.getDate(), MONTH_NAMES[date.getMonth()], date.getFullYear()].join(' ');
	}

	function addRecord(date, type, newLines) {
		lines.push("D" + formatDate(date));
		if (type) {
			lines.push("N" + type);
		}
		lines = lines.concat(newLines);
		lines.push("^", "");
	}

	this.toQifString = function() {
		return lines.join("\n");
	};

	this.dividend = function(date, stockSymbol, amount) {
		addRecord(date, "Dividend", ["Y" + stockSymbol, "T" + amount]);
	};

	this.buy = function(date, stockSymbol, numShares, pricePerShare) {
		addRecord(date, "Buy", ["Y" + stockSymbol, "I" + pricePerShare, "Q" + numShares]);
	};

	this.sell = function(date, stockSymbol, numShares, pricePerShare) {
		addRecord(date, "Sell", ["Y" + stockSymbol, "I" + pricePerShare, "Q" + numShares]);
	};

	this.adjust = function(date, amount, options) {
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