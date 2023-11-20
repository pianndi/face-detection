<?php

$date = date("Y-m-d");
$time = date("H:i:s");
var_dump($_POST["img"]);
if (isset($_POST["img"])) {
  $base64string = $_POST['img'];
  $uploadpath = 'foto_absen/';
  $parts = explode(";base64,", $base64string);
  $imageparts = explode("image/", @$parts[0]);
  $imagetype = $imageparts[1];
  $imagebase64 = base64_decode($parts[1]);
  $name_jpg = date("YmdHis").'.jpg';
  $file = $uploadpath.$name_jpg;
  file_put_contents($file, $imagebase64);
  echo "<img src='".$file."'>";
  
}