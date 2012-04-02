var garoon = {};
garoon.Models = {};
garoon.Collections = {};
garoon.Views = {};
garoon.INTERVAL = 60000;

$.ajaxSetup({
    cache: false,
    global: true
});


window.onload = function(){
    if(location.href.indexOf('background') >= 0){
        garoon.schedule = new garoon.Collections.Schedule();
        garoon.schedule._fetch();
        garoon.schedule.task(garoon.INTERVAL);
    }else{
        garoon.formView = new garoon.Views.Form();
    }
};
