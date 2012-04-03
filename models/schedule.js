garoon.Models.Schedule = Backbone.Model.extend({
    notifySpan: garoon.INTERVAL * 2,
    isUpcoming: function() {
        var diff = this.get('startdate') - new Date();
        return  0 <= diff && diff <= this.notifySpan;
    },
    isNew: function() {
        return this.get('new');
    },
    isPast: function() {
        return this.get('startdate') - new Date() < 0;
    },
    isUpdated: function() {
        return this.get('updated') - this.get('updatedCheck') > 0;
    },
    update: function(schedule) {
        this.set({
            updatedCheck: new Date(schedule.get('updated')),
            new: schedule.get('new'),
            isUpcomingNotified: schedule.get('isUpcomingNotified')
        });

        return this;
    }
});
