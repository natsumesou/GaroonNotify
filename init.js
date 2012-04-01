var garoon = {};
garoon.Models = {};
garoon.Collections = {};
garoon.Views = {};

$.ajaxSetup({
    cache: false,
    global: true
});


window.onload = function(){
    if(location.href.indexOf('background') >= 0){
        garoon.schedule = new garoon.Collections.Schedule();
        garoon.schedule._fetch();
        garoon.schedule.task(60000);
    }else{
        garoon.formView = new garoon.Views.Form();
    }
};
