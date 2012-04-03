garoon.Models.Storage = Backbone.Model.extend({
    load: function() {
        var string = window.localStorage['schedules'];
        var schedules = [];
        if(string !== undefined){
            try{
                schedules = JSON.parse(string);
            }catch(error){
                schedules = new garoon.Collections.Schedule();
                console.warn("WARN: load schedules from localStorage is not formatted: %s", string);
                console.warn(error);
            }
        }
        this.set({
            domain: window.localStorage['domain'],
            username: window.localStorage['username'],
            password: window.localStorage['password'],
            schedules: schedules
        });

        return this;
    },

    save: function() {
        window.localStorage['domain'] = this.get('domain');
        window.localStorage['username'] = this.get('username');
        window.localStorage['password'] = this.get('password');
        var schedules = this.get('schedules');
        if(typeof schedules === 'object'){
            window.localStorage['schedules'] = JSON.stringify(schedules);
        }else{
            window.localStorage['schedules'] = schedules;
        }

        return this;
    },

    schedules: function(schedules) {
        if(schedules !== undefined){
            this.set({schedules: schedules});
        }
        return this.get('schedules');
    },

    domain: function(domain) {
        if(domain !== undefined){
            this.set({domain: domain});
        }
        return this.get('domain');
    },

    username: function(username) {
        if(username !== undefined){
            this.set({username: username});
        }
        return this.get('username');
    },

    password: function(password) {
        if(password !== undefined){
            this.set({password: password});
        }
        return this.get('password');
    }
});
