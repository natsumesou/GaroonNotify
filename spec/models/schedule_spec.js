describe("garoon.Models.Schedule", function() {
    var schedule, schedules, request;
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
        schedule = schedules.at(0);
    });

    var upcomingSchedule, yesterdaySchedule, tomorrowSchedule;
    var now, upcoming, yesterday, tomorrow;
    beforeEach(function() {
        upcomingSchedule = new garoon.Models.Schedule();
        yesterdaySchedule = new garoon.Models.Schedule();
        tomorrowSchedule = new garoon.Models.Schedule();

        now = new Date();
        upcoming = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1);
        yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        upcomingSchedule.set({startdate: upcoming});
        yesterdaySchedule.set({startdate: yesterday});
        tomorrowSchedule.set({startdate: tomorrow});
    });

    describe("isUpcoming", function() {

        it("return true if schedule is upcoming", function() {
            expect(upcomingSchedule.isUpcoming()).toBeTruthy();
        });

        it("return false if schedule is yesterday", function() {
            expect(yesterdaySchedule.isUpcoming()).toBeFalsy();
        });

        it("return false if schedule is tomorrow", function() {
            expect(tomorrowSchedule.isUpcoming()).toBeFalsy();
        });
    });

    describe("isPast", function() {
        it("return true if yesterday schedule", function() {
            expect(yesterdaySchedule.isPast()).toBeTruthy();
        });

        it("return false if future schedule", function() {
            expect(upcomingSchedule.isPast()).toBeFalsy();
        });
    });


    describe("isNew", function() {
        var newSchedule, storageSchedule;
        beforeEach(function() {
            newSchedule = new garoon.Models.Schedule({new: true});
            storageSchedule = new garoon.Models.Schedule({new: false});
        });

        it("is return true when new is true", function() {
            expect(newSchedule.isNew()).toBeTruthy();
        });

        it("is return false when new is fals", function() {
            expect(storageSchedule.isNew()).toBeFalsy();
        });
    });

    describe("isUpdated", function() {
        var updatedSchedule, newSchedule;
        beforeEach(function() {
            updatedSchedule = new garoon.Models.Schedule({
                updated: now,
                updatedCheck: yesterday
            });
            newSchedule = new garoon.Models.Schedule({
                updated: now,
                updatedCheck: now
            });
        });

        it("return true if it is not updated after saved", function() {
            expect(updatedSchedule.isUpdated()).toBeTruthy();
        });

        it("return false if it is updated after saved", function() {
            expect(newSchedule.isUpdated()).toBeFalsy();
        });
    });

    describe("update", function() {
        it("update needed field", function() {
            var schedule = new garoon.Models.Schedule({
                new: true
            });
            var newSchedule = new garoon.Models.Schedule({new: false});
            expect(schedule.update(newSchedule).isNew()).toBeFalsy();
        });
    });
});
