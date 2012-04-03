garoon.Views.Form = Backbone.View.extend({
    el: '#form',
    initialize: function(){
        var el = $(this.el);
        this.storage = new garoon.Models.Storage();
        this.storage.load();

        this.domain = el.find("*[name=domain]");
        this.username = el.find("*[name=username]");
        this.password = el.find("*[name=password]");

        this.domain.val(this.storage.domain());
        this.username.val(this.storage.username());
        this.password.val(this.storage.password());
        el.find('*[type=button]').click($.proxy(this.save, this));

        el.find('.text').bind('keyup', $.proxy(function(event){
            if(event.keyCode == 13){
                this.save();
            }
        }, this));
    },
    save: function() {
        this.storage.domain(this.domain.val());
        this.storage.username(this.username.val());
        this.storage.password(this.password.val());
        this.storage.save();

        $(this.el).find('.result').text('saved');
        
        garoon.schedule = new garoon.Collections.Schedule();
        garoon.schedule._fetch();
    }
});
