garoon.Models.Storage = Backbone.Model.extend({
    load: function() {
        var string = this.get('schedules');
        var schedules = [];
        if(string !== undefined){
            schedules = JSON.parse(string);
        }
        this.set({
            domain: localStorage['domain'],
            username: localStorage['username'],
            password: localStorage['password'],
            schedules: schedules
        });
    },
    save: function() {
        localStorage['domain'] = this.get('domain');
        localStorage['username'] = this.get('username');
        localStorage['password'] = this.get('password');
        var schedules = this.get('schedules');
        if(typeof schedules === 'object'){
            localStorage['schedules'] = JSON.stringify(schedules);
        }else{
            localStorage['schedules'] = schedules;
        }
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
