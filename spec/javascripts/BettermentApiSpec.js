describe('BettermentApi', function () {
    var NOT_LOGGED_IN_XML = $.parseXML('<errors>'
        + '<message>NOT_LOGGED_IN</message>'
        + '<error>'
        + '<code>NOT_LOGGED_IN</code>'
        + '</error>'
        + '</errors>');

    var UNAUTHORIZED_XML = $.parseXML('<errors>'
        + '<message>24045</message>'
        + '<error>'
        + '<code>UNAUTHORIZED</code>'
        + '</error>'
        + '</errors>');

    var ACCOUNTS_XML = $.parseXML('<aggregateHomeInfo>'
        + '<userId>1234</userId>'
        + '<accountNum>3</accountNum>'
        + '<accounts>'
        + '<account>'
        + '<accountId>123</accountId>'
        + '<name>Firsty</name>'
        + '</account>'
        + '<account>'
        + '<accountId>456</accountId>'
        + '<name>Nexty</name>'
        + '</account>'
        + '<account>'
        + '<accountId>789</accountId>'
        + '<name>Lasty</name>'
        + '</account>'
        + '</accounts>'
        + '</aggregateHomeInfo>');

    var successCallback, errorCallback;

    beforeEach(function () {
        successCallback = jasmine.createSpy('successCallback');
        errorCallback = jasmine.createSpy('errorCallback');
    });

    describe('#getAccounts', function () {
        it('makes ajax call', function () {
            spyOn($, 'ajax');
            BettermentApi.getAccounts(successCallback, errorCallback);

            expect($.ajax).toHaveBeenCalled();
            expect($.ajax.mostRecentCall.args[0].url).toEqual('/data/GetAggregateHomeInfo');
        });

        it('calls error callback for server error', function () {
            spyOn($, 'ajax').andCallFake(function (options) {
                options.error();
            });

            BettermentApi.getAccounts(successCallback, errorCallback);

            expect(errorCallback).toHaveBeenCalled();
        });

        it('calls error callback for not logged in', function () {
            spyOn($, 'ajax').andCallFake(function (options) {
                options.success(NOT_LOGGED_IN_XML);
            });

            BettermentApi.getAccounts(successCallback, errorCallback);

            expect(errorCallback).toHaveBeenCalled();
        });

        it('calls success callback with account information', function () {
            spyOn($, 'ajax').andCallFake(function (options) {
                options.success(ACCOUNTS_XML);
            });

            BettermentApi.getAccounts(successCallback, errorCallback);

            expect(successCallback).toHaveBeenCalledWith([
                {id:'123', name:'Firsty'},
                {id:'456', name:'Nexty'},
                {id:'789', name:'Lasty'}
            ]);
        });
    });

    describe('#getAccountActivity', function () {
        it('makes ajax call', function () {
            spyOn($, 'ajax');
            BettermentApi.getAccountActivity('1234', successCallback, errorCallback);

            expect($.ajax).toHaveBeenCalled();
            expect($.ajax.mostRecentCall.args[0].url).toEqual('/data/GetAllActivity?account=1234');
        });

        it('calls error callback for server error', function () {
            spyOn($, 'ajax').andCallFake(function (options) {
                options.error();
            });

            BettermentApi.getAccountActivity('1234', successCallback, errorCallback);

            expect(errorCallback).toHaveBeenCalled();
        });

        it('calls error callback for not logged in', function () {
            spyOn($, 'ajax').andCallFake(function (options) {
                options.success(NOT_LOGGED_IN_XML);
            });

            BettermentApi.getAccountActivity('1234', successCallback, errorCallback);

            expect(errorCallback).toHaveBeenCalled();
        });

        it('calls error callback for unauthorized', function () {
            spyOn($, 'ajax').andCallFake(function (options) {
                options.success(UNAUTHORIZED_XML);
            });

            BettermentApi.getAccountActivity('1234', successCallback, errorCallback);

            expect(errorCallback).toHaveBeenCalled();
        });

        it('calls success callback with returned xml', function () {
            spyOn($, 'ajax').andCallFake(function (options) {
                options.success('badger');
            });

            BettermentApi.getAccountActivity('1234', successCallback, errorCallback);

            expect(successCallback).toHaveBeenCalled();
        });
    });
});