describe("QifBuilder", function() {
	var qifBuilder;
	var date;

	beforeEach(function() {
		qifBuilder = new QifBuilder();
		date = new Date();
		date.setYear(1988);
		date.setMonth(3);
		date.setDate(3);
	});

	it('should export header for empty file', function() {
		expect(qifBuilder.toQifString()).toContainLines(["!Type:Invst"]);
	});

	it('should export dividend', function() {
		qifBuilder.dividend(date, 'BETTERMENT', 123.456);
		expect(qifBuilder.toQifString()).toContainLines(["D3 April 1988","NDividend","YBETTERMENT","T123.456", "^"]);
	});

	it('should export buy', function() {
		qifBuilder.buy(date, 'OTHER_TICKER', 24, 66.99);
		expect(qifBuilder.toQifString()).toContainLines(["D3 April 1988","NBuy","YOTHER_TICKER","I66.99","Q24","^"]);
	});

	it('should export sell', function() {
		qifBuilder.sell(date, 'OT', 24, 99.966);
		expect(qifBuilder.toQifString()).toContainLines(["D3 April 1988","NSell","YOT","I99.966","Q24", "^"]);
	});

	describe('#adjust', function() {
		it('should export with payee', function() {
			qifBuilder.adjust(date, 12345, {payee: 'ppp'});
			expect(qifBuilder.toQifString()).toContainLines(["D3 April 1988","T12345","Pppp","^"]);
		});

		it('should export with memo', function() {
			qifBuilder.adjust(date, 12345, {memo: 'ppp'});
			expect(qifBuilder.toQifString()).toContainLines(["D3 April 1988","T12345","Mppp","^"]);
		});

		it('should export with payee and memo', function() {
			qifBuilder.adjust(date, 12345, {memo: 'mpmp', payee: 'ppp'});
			expect(qifBuilder.toQifString()).toContainLines(["D3 April 1988","T12345","Pppp","Mmpmp","^"]);
		});

		it('should export with just amount', function() {
			qifBuilder.adjust(date, 12345);
			expect(qifBuilder.toQifString()).toContainLines(["D3 April 1988","T12345","^"]);
		});
	});


});