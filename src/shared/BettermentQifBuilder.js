function BettermentQifBuilder(qifBuilder) {
    var BETTERMENT_STOCK_SYMBOL = 'BETTERMENT';

    this.bettermentSharePrice = 100;
    this.bettermentSharesHeld = 0;

    this.toQifString = function () {
        return qifBuilder.toQifString();
    };

    this.marketChange = function (date, amount) {
        // The amount is the change in balance in account. It needs to be
        // converted into the change in share price for the imaginary
        // BETTERMENT stock
        var bettermentSharePriceChange = amount / this.bettermentSharesHeld;
        this.bettermentSharePrice += bettermentSharePriceChange;
    };

    this.accountBonus = function (date, amount) {
        var sharesAdded = amount / this.bettermentSharePrice;

        qifBuilder.adjust(date, amount, {memo:'Account Bonus'});
        qifBuilder.buy(date, BETTERMENT_STOCK_SYMBOL, sharesAdded, this.bettermentSharePrice);

        this.bettermentSharesHeld += sharesAdded;
    };

    this.deposit = function (date, amount) {
        var sharesAdded = amount / this.bettermentSharePrice;

        qifBuilder.adjust(date, amount, {memo:'Deposit'});
        qifBuilder.buy(date, BETTERMENT_STOCK_SYMBOL, sharesAdded, this.bettermentSharePrice);


        this.bettermentSharesHeld += sharesAdded;
    };

    this.withdrawal = function (date, amount) {
        // Amount will be a negative number for withdrawal
        var sharesAdded = amount / this.bettermentSharePrice;

        qifBuilder.sell(date, BETTERMENT_STOCK_SYMBOL, -sharesAdded, this.bettermentSharePrice);
        qifBuilder.adjust(date, amount, {memo:'Withdrawal'});

        this.bettermentSharesHeld += sharesAdded;
    };

    this.fee = function (date, amount) {
        // Amount will be a negative number so * by -1 to get the number
        // of shares sold
        var sharesSold = -1 * amount / this.bettermentSharePrice;
        this.bettermentSharesHeld -= sharesSold;

        qifBuilder.sell(date, BETTERMENT_STOCK_SYMBOL, sharesSold, this.bettermentSharePrice);
        qifBuilder.adjust(date, amount, {payee:'Fee'});
    };

    this.dividend = function (date, amount) {
        var sharesBought = amount / this.bettermentSharePrice;

        qifBuilder.dividend(date, BETTERMENT_STOCK_SYMBOL, amount);
        qifBuilder.buy(date, BETTERMENT_STOCK_SYMBOL, sharesBought, this.bettermentSharePrice);

        this.bettermentSharesHeld += sharesBought;
    };
}