<?php

//var_dump($_POST);
//var_dump(end(explode("/", explode(";", $_POST["img"])[0])));
//var_dump(strlen(base64_decode(end(explode(",", $_POST["img"])))));

function upload($data) {
  $ekstensiGambar = end(explode("/", explode(";", $data["img"])[0]));
  $base64 = base64_decode(end(explode(",", $data["img"])));
  $ukuranFile = strlen($base64);

  $ekstensiValid = ["jpg",
    "jpeg",
    "png",
    "webp"
  ];

  if (!in_array($ekstensiGambar, $ekstensiValid)) {
    echo "<script>
          alert('Format file salah');
          </script>";
    return false;
  }
  $namaFileBaru = uniqid()  . "." . $ekstensiGambar;
  //move_uploaded_file($tmpName, "foto_absen/".$namaFileBaru);
  file_put_contents("foto_absen/".$namaFileBaru, $base64);
  return $namaFileBaru;
}
$gambar = upload($_POST);
var_dump($gambar);
if ($gambar) {
  header("Location: foto_absen/".$gambar);
}
?>
<br />
<img src="foto_absen/<?=$gambar; ?>" alt="" />