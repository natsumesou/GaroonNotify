describe("garoon.Collections.Schedule", function(){
    it("is existing variable", function(){
        expect(garoon.Collections.Schedule).toBeDefined();
    });

    var schedules = new garoon.Collections.Schedule();

    describe("fetch", function(){
        var onSuccess, onFailure;
        var request;

        beforeEach(function(){
            jasmine.Ajax.useMock();
            onSuccess = jasmine.createSpy('onSuccess');
            onFailure = jasmine.createSpy('onFailure');

            schedules.fetch({
                success: onSuccess,
                error: onFailure
            });
            request = mostRecentAjaxRequest();
        });

        //TODO cannot execute ajax mock test
        /*
        describe("on success", function(){
            beforeEach(function(){
                request.response(scheduleMock);
            });

            it("can load schedule data from schedule API", function() {
                expect(onSuccess).toHaveBeenCalled();
            });
        });
        */
    });

});
