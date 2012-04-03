garoon.Collections.Schedule = Backbone.Collection.extend({
    url: 'http://products.cybozu.co.jp/garoon/', //DUMMY URL
    model: garoon.Models.Schedule,
    parse: function(resp) {
        var schedules = $.xml2json(resp).schedule;
        if(schedules.length === undefined){
            schedules = [schedules];
        }
        for(var i in schedules){
            if(schedules[i].id !== undefined){
                if(schedules[i].id.match(/(^schedule:[0-9]*):.*/i)){
schedules[i].id = RegExp.$1
                }
            }else{
                schedules[i].id = new Date().getTime();
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
        clearInterval(this.interval);
        this.interval = setInterval($.proxy(this._fetch, this), interval);
    },

    _fetch: function(interval){
        var storage = new garoon.Models.Storage();
        storage.load();
        this.url = 'https://' + storage.domain() + '/cgi-bin/cbgrn/grn.cgi/reminder/schedule_notifier';

        var params = {
            _system: 1,
            _notimecard: 1,
            _force_login: 1,
            use_cookie: -1,
            _account: storage.username(),
            _password: storage.password()
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
        var oldSchedules = new garoon.Collections.Schedule();
        schedules.each(function(schedule){
            if(schedule.isPast()){
                oldSchedules.add(schedule);
            }
        });
        oldSchedules.each(function(schedule) {
            schedules.remove(schedule);
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
        var storage = new garoon.Models.Storage();
        storage.load();
        var oldSchedules = new garoon.Collections.Schedule(storage.schedules());
        schedules.each(function(schedule){
            if(oldSchedules.hasSameSchedule(schedule)){
                var oldSchedule = oldSchedules.getSameSchedule(schedule);
                schedule.update(oldSchedule);
            }
        });

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
        var storage = new garoon.Models.Storage();
        storage.load();
        storage.schedules(schedules);
        storage.save();
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
            schedule.get('startdate') + "\n" + schedule.get('facility')
        );
        notification.show();
    },

    errorNotification: function(collection, xhr, status){
        var storage = new garoon.Models.Storage();
        var text = xhr.status+":"+xhr.statusText+"\nresponse text: "+xhr.responseText.slice(0, 30)+'...';

        if(xhr.status == 200 && xhr.responseText.indexOf('HTML') >= 0){
            text = "set username and password in plugin's popup page.";
            console.info(text);
        }else if(xhr.status == 0){
            text = 'domain [' + storage.domain() + '] or username or password is invalid : ' + xhr.statusText;
            console.error(text);
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
