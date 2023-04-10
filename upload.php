<?php
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
  $namaFileBaru = uniqid()  . ".$ekstensiGambar";
  file_put_contents("foto_absen/".$namaFileBaru, $base64);
  return $namaFileBaru;
}
$gambar = upload($_POST);
var_dump($gambar);
// if ($gambar) {
//   header("Location: foto_absen/".$gambar);
// }
?>
<br />
<img src="foto_absen/<?=$gambar; ?>" alt="" />