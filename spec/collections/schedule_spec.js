describe("garoon.Collections.Schedule", function(){
    var schedules, request;
    var success, error;
    beforeEach(function() {
        jasmine.Ajax.useMock();

        success = jasmine.createSpy();
        error = jasmine.createSpy();

        schedules = new garoon.Collections.Schedule();
        schedules.fetch({
            dataType: 'xml',
            success: success,
            error: error
        });

        request = mostRecentAjaxRequest();
    });

    describe("fetch", function(){
        beforeEach(function() {
            request.response(scheduleMock);
            schedules = success.mostRecentCall.args[0];
        });

        it("can get garoon data", function(){
            expect(success).toHaveBeenCalled();
            expect(schedules.length).toEqual(2);
        });
    });
});
