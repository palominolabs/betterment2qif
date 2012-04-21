beforeEach(function () {
    this.addMatchers({
        toContainLines:function (expectedSubLinesArray) {
            return this.actual.indexOf(expectedSubLinesArray.join('\n')) !== -1;
        },
        toHaveBeenCalledOnce:function () {
            return this.actual.argsForCall.length == 1;
        }
    });
});
