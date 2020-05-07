function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
var
  nickname = false;
  login    = false;
  password = false;
  password_repyt = false;
  email = false;


$("#nickname").on('input',function () {
  let val = this.value;
  $("#login").val(val);
  $("#playername").html(val);
  if(val.length >= 5){
    nickname = true;
    login = true;
    $("#erorr").html('')
  }else{
    $("#erorr").html('Нікнейм дуже короткий!')
    login = false;
    nickname = false;
  }
})


$("#login").on('input',function () {
  let val = this.value;
  if(val.length >= 5){
    login = true;
    $("#erorr").html('')
  }else{
    $("#erorr").html('Логін дуже короткий!')
    login = false;
  }
})

var password_becup = '';

$("#password").on('input',function () {
  let val = this.value;
  password_becup = val;
  if(val.length >= 8){
    password = true;
    $("#erorr").html('')
  }else{
    $("#erorr").html('Пароль дуже короткий! (принаймні 8 символів)')
    password = false;
  }
})

$("#password_repyt").on('input',function () {
  let val = this.value;
  if(val === password_becup){
    password_repyt = true;
    $("#erorr").html('')
  }else{
    $("#erorr").html('Паролі не співпадають')
    password_repyt = false;
  }
})

$("#email").on('input',function () {
  let val = this.value;
  if(validateEmail(val)){
    email = true;
    $("#erorr").html('')
  }else{
    $("#erorr").html('Неправильний формат email')
    email = false;
  }
})

// nickname = false;
// login    = false;
// password = false;
// password_repyt = false;
// email = false;
let id = setInterval(function () {
  if(nickname && login && password && password_repyt && email){
    $("#go").removeAttr('disabled');
    $("#go").attr('class', 'register_submit active');
  }else{
    $("#go").attr('disabled', 'disabled');
    $("#go").attr('class', 'register_submit');
  }
}, 100)
