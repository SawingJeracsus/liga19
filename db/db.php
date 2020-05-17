<?php
  require 'config.php';
  require 'rb-mysql.php';
  R::setup('mysql:host='.$server_url.';dbname='.$server_db_name.'',$server_user_name, $server_password);
  session_start();
  //R::setup( 'mysql:host=localhost;dbname=mysite','root', '' );
 ?>
