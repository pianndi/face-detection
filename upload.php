<?php

var_dump($_FILES);
function upload($data) {
  $namaGambar = $data["img"]["name"];
  $ukuranFile = $data["img"]["size"];
  $error = $data["img"]["error"];
  $tmpName = $data["img"]["tmp_name"];

  if ($error === 4 || $ukuranFile === 0) {
    echo "<script>
          alert('Gambar bermasalah');
          </script>";
    return false;
  }
  $ekstensiValid = ["jpg",
    "jpeg",
    "png",
    "webp"
  ];
  $ekstensiGambar = strtolower(end(explode(".", $namaGambar)));

  if (!in_array($ekstensiGambar, $ekstensiValid)) {
    echo "<script>
          alert('Format file salah');
          </script>";
    return false;
  }
  $namaFileBaru = uniqid()  . "." . $ekstensiGambar;
  move_uploaded_file($tmpName, "foto_absen/".$namaFileBaru);
  return $namaFileBaru;
}
$gambar = upload($_FILES);
var_dump($gambar);
if ($gambar) {
  header("Location: foto_absen");
}
?>
<br />
<img src="foto_absen/<?=$gambar; ?>" alt="" />