garoon.Views.Form = Backbone.View.extend({
    el: '#form',
    initialize: function(){
        var el = $(this.el);
        this.domain = el.find("*[name=domain]");
        this.username = el.find("*[name=username]");
        this.password = el.find("*[name=password]");
        this.domain.val(localStorage['domain']);
        this.username.val(localStorage['username']);
        this.password.val(localStorage['password']);
        el.find('*[type=button]').click($.proxy(this.save, this));

        el.find('.text').bind('keyup', $.proxy(function(event){
            if(event.keyCode == 13){
                this.save();
            }
        }, this));
    },
    save: function() {
        localStorage['domain'] = this.domain.val();
        localStorage['username'] = this.username.val();
        localStorage['password'] = this.password.val();
        $(this.el).find('.result').text('saved');
    }
});
