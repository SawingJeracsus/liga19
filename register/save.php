<?php
require '../db/db.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

$parrent = explode('/', $actual_link);
$parrent_str = '';
foreach ($parrent as $block) {
  if($block != $parrent[count($parrent) - 1]){
    $parrent_str = $parrent_str.'/'.$block;
  }
}
$parrent_str = substr($parrent_str, 1);

$errors = [];
$emailRegular = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';

if(strlen($_POST['login']) < 5){
  $errors[] = 'Login is short';
}
if(strlen($_POST['nickname']) < 5){
  $errors[] = 'Nickname is short';
}
if($_POST['password'] != $_POST['password_repyt']){
  $errors[] = 'Passwords not equal';
}
if(strlen($_POST['password']) < 8){
  $errors[] = 'Password is so short';
}
if(preg_match($emailRegular, $_POST['email']) != 1){
  $errors[] = 'Email invalid';
}

if(R::count( 'players', ' login = ? ', [ $_POST['login'] ] ) != 0){
  $errors[]= 'User with this login exist!';
}
if(R::count( 'players', ' email = ? ', [ $_POST['email'] ]) != 0){
  $errors[]= 'User with this email exist!';
}
if(R::count( 'players', ' nickname = ? ', [ $_POST['nickname'] ] ) != 0){
  $errors[]= 'User with this nickname exist!';
}


$player = R::dispense('players');
foreach ($_POST as $key => $value) {
  if($key != 'password_repyt' && $key != 'password'){
    $player->$key = $value;
  }elseif($key == 'password'){
    $player->$key = md5($value);
  }
}
$player->acepted = false;
$player->token = $token = md5(rand());

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();                                            // Send using SMTP
    $mail->Host       = $_SMPT['host'];                    // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = $_SMPT['username'];                     // SMTP username
    $mail->Password   = $_SMPT['password'];                               // SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
    $mail->Port       = $_SMPT['port'];                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

    $mail->setFrom($_SMPT['username'], $_GAME['name']);
    $mail->addAddress($_POST['email']);     // Add a recipient

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Welcom to the '.$_GAME['name'].'!';
    $mail->Body    = '
    <div class="main" style="
          display: -webkit-flex;
          display: -ms-flex;
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-direction: column;
          font-family: "Jost", sans-serif;">
      <h1>Welcom to the '.$_GAME['name'].'</h1>
      <p>Accept your adress</p>
      <a href="'.$parrent_str.'/accept.php?token='.$token.'&delete=0" style="
          display: block;
          width: 500px;
          padding: 4px;
          background-color: #4CAF50;
          color: #fff;
          text-align: center;
          margin-bottom: 10px;
          font-size: 2em;
          text-decoration: none;
      ">Accept</a>
      <a href="'.$parrent_str.'/accept.php?token='.$token.'&delete=1" style="
          display: block;
          width: 500px;
          padding: 4px;
          background-color: #f00;
          color: #fff;
          text-align: center;
          margin-bottom: 10px;
          font-size: 2em;
          text-decoration: none;
      ">If it`s not yor request - click here!</a>
    </div>
    ';

    if(empty($errors)){
      $mail->send();
    }
    // echo 'Message has been sent';
} catch (Exception $e) {
    $errors[] = "Не вдалось надіслати лист";
}
if(empty($errors)){
  $id = R::store($player);
}else{
  $id = 'null';
}
?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Підтвердіть ваш email</title>
    <link rel="stylesheet" href="css/save.css">
    <script
  src="https://code.jquery.com/jquery-3.5.1.min.js"
  integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
  crossorigin="anonymous"></script>
    <script>const id = <?php echo $id ?></script>
  </head>
  <body>
    <main>
      <div class="content_wrapper">
        <?php if(!empty($errors)):?>
          <div class="error">
            <h1><?php echo $errors[0] ?></h1>
            <a href="<?php echo $parrent_str?>">Назад до форми</a>
          </div>
        <?php else: ?>
          <div class="accept_email">
            <h1>Підтвердіть ваш поштовий ящик <?php echo $_POST['email']?></h1>
            <b>НЕ ЗАКРИВАЙТЕ ЦЮ СТОРІНКУ!</b>
            <br>
            <a href="<?php echo $parrent_str?>">Назад до форми</a>
          </div>
        <?php endif ?>
      </div>
    </main>
  </body>
  <script src="js/successchecker.js"></script>
</html>
