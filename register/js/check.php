<?php
// print_r($_GET);

require '../../db/db.php';

$id = $_GET['id'];

if($id != null){
  if(R::count( 'players', ' id = ? ', [ $id ] ) != 0){
    $accepted = R::getRow('SELECT * FROM `players` WHERE `id` = '.$id);
    $_SESSION['player'] = $accepted; 
    echo $accepted['acepted'];
  }
}
?>
