describe('bettermentActivityToQif', function () {
    var qifBuilder;
    var bettermentQifBuilder;
    var bettermentActivityToQif;
    var date;

    function makeTestXmlDoc(innerXml) {
        return $($.parseXML('<?xml version="1.0" encoding="UTF-8"?><activities>' + innerXml + '</activities>'));
    }

    var COMMON_XML =
        +'<accountID>1000000</accountID>'
            + '<accountIsClosed>false</accountIsClosed>'
            + '<accountIsMaster>true</accountIsMaster>'
            + '<accountName>Account Name</accountName>'
            + '<txnID>200000</txnID>'
            + '<date>2010/09/10</date>'
            + '<dateString>Sept 10</dateString>'
            + '<documentHash>XYZ</documentHash>'
            + '<pending>false</pending>'
            + '<failed>false</failed>';

    var ACCOUNT_BONUS_XML = '<transaction>'
        + COMMON_XML
        + '<amount>10.10</amount>'
        + '<balance>10.10</balance>'
        + '<description>Account Bonus</description>'
        + '<type>ACCOUNT_BONUS</type>'
        + '<typeID>19</typeID>'
        + '</transaction>';

    var FEE_XML = '<transaction>'
        + COMMON_XML
        + '<amount>-57.00</amount>'
        + '<balance>274.45</balance>'
        + '<type>FEE</type>'
        + '<typeID>3</typeID>'
        + '</transaction>';

    var DIVIDEND_XML = '<transaction>'
        + COMMON_XML
        + '<amount>24.68</amount>'
        + '<balance>24.68</balance>'
        + '<description>Dividend from XXX</description>'
        + '<type>DIVIDEND</type>'
        + '<typeID>4</typeID>'
        + '</transaction>';

    var DEPOSIT_XML = '<transaction>'
        + COMMON_XML
        + '<amount>50.50</amount>'
        + '<balance>50.50</balance>'
        + '<description>Initial Deposit from ****ABCD</description>'
        + '<type>DEPOSIT</type>'
        + '<typeID>1</typeID>'
        + '</transaction>';

    var MARKET_CHANGE_XML = '<transaction>'
        + COMMON_XML
        + '<amount>-12.21</amount>'
        + '<balance>0</balance>'
        + '<description>Market Changes</description>'
        + '<type>MARKET_CHANGE</type>'
        + '<typeID>2</typeID>'
        + '<hasChildren>false</hasChildren>'
        + '</transaction>';

    var NESTED_MARKET_CHANGE_XML = '<transaction>'
        + COMMON_XML
        + '<amount>48.48</amount>'
        + '<balance>0</balance>'
        + '<description>Market Changes</description>'
        + '<type>MARKET_CHANGE</type>'
        + '<typeID>2</typeID>'
        + '<hasChildren>true</hasChildren>'
        + MARKET_CHANGE_XML
        + '</transaction>';

    beforeEach(function () {
        date = new Date(0);
        date.setDate(10);
        date.setMonth(8);
        date.setYear(2010);

        qifBuilder = new QifBuilder();
        bettermentQifBuilder = new BettermentQifBuilder(qifBuilder);
        bettermentActivityToQif = new BettermentActivityToQif(bettermentQifBuilder);

        spyOn(qifBuilder, 'toQifString').andReturn('badger');

        spyOn(bettermentQifBuilder, 'accountBonus');
        spyOn(bettermentQifBuilder, 'fee');
        spyOn(bettermentQifBuilder, 'dividend');
        spyOn(bettermentQifBuilder, 'deposit');
        spyOn(bettermentQifBuilder, 'marketChange');
    });

    it('should return result of qif builder', function () {
        expect(bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(ACCOUNT_BONUS_XML)).qif).toEqual('badger');
    });

    describe('account bonus', function () {
        it('makes correct betterment qif builder call', function () {
            bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(ACCOUNT_BONUS_XML));

            expect(bettermentQifBuilder.accountBonus).toHaveBeenCalledWith(date, 10.10);
        });

        it('counts as 1 transaction', function () {
            expect(bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(ACCOUNT_BONUS_XML)).numTransactions).toEqual(1);
        });
    });

    describe('fee', function () {
        it('makes correct betterment qif builder call', function () {
            bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(FEE_XML));

            expect(bettermentQifBuilder.fee).toHaveBeenCalledWith(date, -57);
        });

        it('counts as 1 transaction', function () {
            expect(bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(FEE_XML)).numTransactions).toEqual(1);
        });
    });

    describe('dividend', function () {
        it('makes correct betterment qif builder call', function () {
            bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(DIVIDEND_XML));

            expect(bettermentQifBuilder.dividend).toHaveBeenCalledWith(date, 24.68);
        });

        it('counts as 1 transaction', function () {
            expect(bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(DIVIDEND_XML)).numTransactions).toEqual(1);
        });
    });

    describe('deposit', function () {
        it('makes correct betterment qif builder call', function () {
            bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(DEPOSIT_XML));

            expect(bettermentQifBuilder.deposit).toHaveBeenCalledWith(date, 50.50);
        });

        it('counts as 1 transaction', function () {
            expect(bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(DEPOSIT_XML)).numTransactions).toEqual(1);
        });
    });

    describe('market change', function () {
        it('makes correct betterment qif builder call', function () {
            bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(MARKET_CHANGE_XML));

            expect(bettermentQifBuilder.marketChange).toHaveBeenCalledWith(date, -12.21);
        });

        it('counts as 1 transaction', function () {
            expect(bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(MARKET_CHANGE_XML)).numTransactions).toEqual(1);
        });

        it('makes correct betterment qif builder call for nested market changes', function () {
            bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(NESTED_MARKET_CHANGE_XML));

            expect(bettermentQifBuilder.marketChange).toHaveBeenCalledWith(date, 48.48);
            expect(bettermentQifBuilder.marketChange).toHaveBeenCalledOnce();
        });

        it('counts as 1 transaction for nested market changes', function () {
            expect(bettermentActivityToQif.convertBettermentActivityXMLDoc(makeTestXmlDoc(NESTED_MARKET_CHANGE_XML)).numTransactions).toEqual(1);
        });
    });
});