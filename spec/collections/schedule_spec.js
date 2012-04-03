describe("garoon.Collections.Schedule", function() {
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
        request.response(scheduleMock);
        schedules = success.mostRecentCall.args[0];
    });

    describe("fetch", function() {
        it("can get garoon data", function() {
            expect(success).toHaveBeenCalled();
            expect(schedules.length).toEqual(2);
        });
    });

    describe("hasSameSchedule", function() {
        it("return true when schedules include same schedule", function() {
            expect(schedules.hasSameSchedule(schedules.at(0))).toBe(true);
        });

        it("return false when it has no same schedule ", function() {
            var schedule = new garoon.Models.Schedule();
            expect(schedules.hasSameSchedule(schedule)).toBe(false);
        });
    });

    describe("getSameSchedule", function() {
        it("return same id schedule if it has", function() {
            var schedule = schedules.at(0);
            expect(schedules.getSameSchedule(schedule).get('id')).toBe(schedule.get('id'));
        });


        it("return undefined if schedules has no same schedule", function() {
            var schedule = new garoon.Models.Schedule();
            expect(schedules.getSameSchedule(schedule)).toBeUndefined();
        });
    });

    describe("clearPastSchedules", function() {
        var schedule;
        beforeEach(function() {
            schedule = new garoon.Models.Schedule({startdate: new Date("3000-04-01 13:30:00")});
            schedules.add(schedule);
        });
        it("delete old schedules", function() {
            expect(schedules.clearPastSchedules(schedules).length).toBe(1);
        });
    });
});
