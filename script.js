// Load faceapi

function cariWajah() {
  faceapi.nets.tinyFaceDetector.loadFromUri("models").then(() => {
    test.style.display = "none";
    condition.innerHTML = "";
    absensi();
  });
}
function absensi() {
  if ("mediaDevices" in navigator) {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          advanced: [
            {
              focusMode: "auto",
            },
          ],
          width: { min: 576, ideal: 720, max: 1080 },
          height: { min: 576, ideal: 720, max: 1080 },
        },
      })
      .then((stream) => {
        video.srcObject = stream;
        video.style.display = "block";
        const track = stream.getVideoTracks()[0];

        let interval = 400;
        // CEK SETIAP 0.4s SEKALI KARENA BIKIN LAG!!

        let cek = setInterval(async function () {
          input = video;
          const detections = await faceapi.detectSingleFace(
            input,
            new faceapi.TinyFaceDetectorOptions()
          );
          if (detections) {
            clearInterval(cek);
            // return data image
            let image = await cekrik(64);
            test.src = image;
            // return data image

            // test file form
            img.value = image;
            // test

            clearInterval(loading);
            condition.style.color = "green";
            condition.innerHTML = "Wajah Terdeteksi!";
            video.style.display = "none";
            test.style.display = "block";

            // Menghindari gambar hitam
            setTimeout(function () {
              track.stop();
            }, 100);
          }
        }, interval);

        // animasi loading
        condition.style.color = "black";
        condition.innerHTML = "Mencari Wajah";
        let loading = setInterval(function () {
          if (condition.innerHTML.length < 16) {
            condition.innerHTML += ".";
          } else {
            condition.innerHTML = "Mencari Wajah";
          }
        }, interval);
      })
      .catch((err) => {
        condition.innerHTML = "Camera " + err.message;
      });
  }
}

function cekrik(dims = 64, wm = true) {
  // kompres gambar ke dims pixel
  return new Promise((success) => {
    canvas.width = dims;
    canvas.height = dims;
    const c = canvas.getContext("2d");

    c.scale(-1, 1);
    c.drawImage(video, -dims, 0, dims, dims);

    if (wm) {
      c.imageSmoothingEnabled = false;
      c.scale(-1, 1);
      let scale = dims / 64;
      c.textAlign = "center";
      c.lineWidth = 0.5 * scale;

      // Judul
      let fontSize = 20;
      let text = "E-kur";
      c.strokeStyle = "rgba(23,23,23,0.7)";
      c.fillStyle = "rgba(76,175,80,0.3)";
      c.font = `normal normal 900 ${fontSize * scale}px arial`;
      c.fillText(text, canvas.width / 2, canvas.height / 2);
      c.strokeText(text, canvas.width / 2, canvas.height / 2);

      // Deskripsi
      fontSize = 8;
      text = "SMKN 1 Demak";
      c.fillStyle = "rgba(255,255,255,0.3)";
      c.font = `normal normal 900 ${fontSize * scale}px arial`;
      c.fillText(text, canvas.width / 2, canvas.height / 2 + fontSize * scale);
      c.strokeText(
        text,
        canvas.width / 2,
        canvas.height / 2 + fontSize * scale
      );
    }
    // Return Base64
    success(canvas.toDataURL("image/webp", 0.75));
  });
}
