garoon.Collections.Schedule = Backbone.Collection.extend({
    model: garoon.Models.Schedule,

    url: 'https://' + localStorage['domain'] + '/cgi-bin/cbgrn/grn.cgi/reminder/schedule_notifier',
    parse: function(resp) {
        var schedules = $.xml2json(resp).schedule;
        for(var i in schedules){
            if(schedules[i].id.match(/(^schedule:[0-9]*):.*/i)){
                schedules[i].id = RegExp.$1
            }
            schedules[i].enddate = new Date(schedules[i].enddate);
            schedules[i].startdate = new Date(schedules[i].startdate);
            schedules[i].updated = new Date(schedules[i].updated);
            schedules[i].new = true;
            schedules[i].isUpcomingNotified = false;
        }
        return schedules;
    },

    task: function(interval) {
        this.interval = setInterval($.proxy(this._fetch, this), interval);
    },

    _fetch: function(interval){
        var params = {
            _system: 1,
            _notimecard: 1,
            _force_login: 1,
            use_cookie: 0,
            _account: localStorage['username'],
            _password: localStorage['password']
        };
        this.fetch({
            dataType: 'xml',
            data: params,
            type: "POST",
            success: $.proxy(this.notify, this),
            error: $.proxy(this.errorNotification, this)
        });
    },

    clearPastSchedules: function(schedules) {
        schedules.each(function(schedule){
            if(schedule.isPast()){
                schedules.remove(schedule);
            }
        });

        return schedules;
    },

    hasSameSchedule: function(schedule){
        var id = schedule.get('id');
        var status = false;
        this.each(function(selfSchedule){
            if(selfSchedule.get('id') == id){
                status = true;
            }
        });

        return status;
    },

    getSameSchedule: function(schedule){
        var id = schedule.get('id');
        var thisSchedule = undefined;
        this.each(function(selfSchedule){
            if(selfSchedule.get('id') == id){
                thisSchedule = selfSchedule;
            }
        });

        return thisSchedule;
    },

    update: function(schedules) {
        var localSchedules = localStorage['schedules'];
        if(localSchedules !== undefined){
            var oldSchedules = new garoon.Collections.Schedule(JSON.parse(localSchedules));
            schedules.each(function(schedule){
                if(oldSchedules.hasSameSchedule(schedule)){
                    var oldSchedule = oldSchedules.getSameSchedule(schedule);
                    schedule.update(oldSchedule);
                }
            });
        }

        schedules = this.clearPastSchedules(schedules);
        return schedules;
    },

    notify: function(schedules, resp) {
        schedules = this.update(schedules);
        schedules.each(function(schedule){
            if(schedule.isUpcoming() && !schedule.get('isUpcomingNotified')){
                schedules.desktopNotification(schedule);
                schedule.set({isUpcomingNotified: true});
            }
            if(schedule.isNew()){
                schedules.desktopNotification(schedule);
                schedule.set({new: false});
            }
            if(schedule.isUpdated()){
                schedules.desktopNotification(schedule);
            }
        });
        localStorage['schedules'] = JSON.stringify(schedules.toJSON());
    },

    desktopNotification: function(schedule) {
        var title = schedule.get('title');
        if(schedule.isUpcoming() && !schedule.get('isUpcomingNotified')){
            title = '[upcoming] ' + title;
        }else if(schedule.isNew()){
            title = '[new] ' + title;
        }else if(schedule.isUpdated()){
            title = '[update] ' + title;
        }
        var notification = webkitNotifications.createNotification(
            '',  // icon url
            title,
            schedule.get('startdate')
        );
        notification.show();
    },

    errorNotification: function(collection, xhr, status){
        var text = xhr.status+":"+xhr.statusText+"\nresponse text: "+xhr.responseText.slice(0, 30)+'...';

        if(xhr.status == 200 && xhr.responseText.indexOf('HTML') >= 0){
            text = "set username and password in plugin's popup page.";
            console.info(text);
        }else{
            console.error(text);
        }
        var notification = webkitNotifications.createNotification(
            '',
            'Error',
            text
        );
        notification.show();
    }
});
