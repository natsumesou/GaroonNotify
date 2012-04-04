garoon.Models.Storage = Backbone.Model.extend({
    load: function() {
        var schedules = Storage['schedules'] || new garoon.Collections.Schedule();
        this.set({
            domain: Storage['domain'],
            username: Storage['username'],
            password: Storage['password'],
            schedules: schedules
        });

        return this;
    },

    save: function() {
        Storage['domain'] = this.get('domain');
        Storage['username'] = this.get('username');
        Storage['password'] = this.get('password');
        Storage['schedules'] = this.get('schedules');

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
