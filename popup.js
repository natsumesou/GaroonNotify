function register(){
    var form = document.forms.form;
    var username = form.elements.username.value;
    var password = form.elements.password.value;
    console.log(username);
    localStorage['username'] = username;
    localStorage['password'] = password;
}
