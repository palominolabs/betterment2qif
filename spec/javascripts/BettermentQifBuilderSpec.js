describe("BettermentQifBuilder", function () {

    var date;
    var qifBuilder;
    var bettermentQifBuilder;

    beforeEach(function () {
        qifBuilder = new QifBuilder();
        spyOn(qifBuilder, 'dividend');
        spyOn(qifBuilder, 'adjust');
        spyOn(qifBuilder, 'buy');
        spyOn(qifBuilder, 'sell');
        bettermentQifBuilder = new BettermentQifBuilder(qifBuilder);

        date = new Date();
        date.setYear(1988);
        date.setMonth(3);
        date.setDate(3);
    });

    describe('#marketChange', function () {
        it("doesn't adjust share quantity", function () {
            bettermentQifBuilder.marketChange(date, 123);

            expect(bettermentQifBuilder.bettermentSharesHeld).toEqual(0);
        });

        it('increases share price for market increase', function () {
            bettermentQifBuilder.bettermentSharesHeld = 50;

            bettermentQifBuilder.marketChange(date, -100);

            expect(bettermentQifBuilder.bettermentSharePrice).toEqual(98);
        });

        it('decreases share price for market decrease', function () {
            bettermentQifBuilder.bettermentSharesHeld = 10;

            bettermentQifBuilder.marketChange(date, 80);

            expect(bettermentQifBuilder.bettermentSharePrice).toEqual(108);
        });
    });

    describe('#accountBonus', function () {
        it('adds to qif correctly', function () {
            bettermentQifBuilder.accountBonus(date, 123);

            expect(qifBuilder.adjust).toHaveBeenCalledWith(date, 123, {memo:'Account Bonus'});
            expect(qifBuilder.buy).toHaveBeenCalledWith(date, 'BETTERMENT', 1.23, 100);
        });

        it('increases share quantity', function () {
            bettermentQifBuilder.accountBonus(date, 123);

            expect(bettermentQifBuilder.bettermentSharesHeld).toEqual(1.23);
        });

        it("doesn't adjust share price", function () {
            bettermentQifBuilder.accountBonus(date, 123);

            expect(bettermentQifBuilder.bettermentSharePrice).toEqual(100);
        });
    });

    describe('#deposit', function () {
        it('adds to qif correctly', function () {
            bettermentQifBuilder.deposit(date, 521);

            expect(qifBuilder.adjust).toHaveBeenCalledWith(date, 521, {memo:'Deposit'});
            expect(qifBuilder.buy).toHaveBeenCalledWith(date, 'BETTERMENT', 5.21, 100);
        });

        it('increases share quantity', function () {
            bettermentQifBuilder.deposit(date, 777);

            expect(bettermentQifBuilder.bettermentSharesHeld).toEqual(7.77);
        });

        it("doesn't adjust share price", function () {
            bettermentQifBuilder.deposit(date, 123);

            expect(bettermentQifBuilder.bettermentSharePrice).toEqual(100);
        });
    });

    describe('#fee', function () {
        it('adds to qif correctly', function () {
            bettermentQifBuilder.fee(date, -80);

            expect(qifBuilder.sell).toHaveBeenCalledWith(date, 'BETTERMENT', .8, 100);
            expect(qifBuilder.adjust).toHaveBeenCalledWith(date, -80, {payee:'Fee'});
        });

        it('decreases share quantity', function () {
            bettermentQifBuilder.bettermentSharesHeld = 10;

            bettermentQifBuilder.fee(date, -300);

            expect(bettermentQifBuilder.bettermentSharesHeld).toEqual(7);
        });

        it("doesn't adjust share price", function () {
            bettermentQifBuilder.bettermentSharesHeld = 10;

            bettermentQifBuilder.fee(date, -300);

            expect(bettermentQifBuilder.bettermentSharePrice).toEqual(100);
        });
    });

    describe('#dividend', function () {
        it('adds to qif correctly', function () {
            bettermentQifBuilder.dividend(date, 123.45);

            expect(qifBuilder.dividend).toHaveBeenCalledWith(date, 'BETTERMENT', 123.45);
            expect(qifBuilder.buy).toHaveBeenCalledWith(date, 'BETTERMENT', 1.2345, 100);
        });

        it('adjusts share quantity', function () {
            bettermentQifBuilder.dividend(date, 150);

            expect(bettermentQifBuilder.bettermentSharesHeld).toEqual(1.5);
        });

        it("doesn't adjust share price", function () {
            bettermentQifBuilder.dividend(date, 1);

            expect(bettermentQifBuilder.bettermentSharePrice).toEqual(100);
        });
    });

});