<?php
require '../db/db.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../libs//PHPMailer/src/Exception.php';
require '../libs//PHPMailer/src/PHPMailer.php';
require '../libs//PHPMailer/src/SMTP.php';


$errors = [];
$emailRegular = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';


if($_POST['password'] != $_POST['password_repyt']){
  $errors[] = 'Passwords not equal';
}
if(strlen($_POST['password']) < 8){
  $errors[] = 'Password is so short';
}
if(preg_match($emailRegular, $_POST['email']) != 1){
  $errors[] = 'Email invalid';
}

print_r($errors);
$player = R::dispense('players');
foreach ($_POST as $key => $value) {
  if($key != 'password_repyt' && $key != 'password'){
    $player->$key = $value;
  }elseif($key == 'password'){
    $player->$key = md5($value);
  }
}
$id = $player->acepted = false;

// mail($_POST['email'], 'Welcom', 'Welcom: \n  '.$sitelink);
// R::store($player);
