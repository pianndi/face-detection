// Load faceapi
function cariWajah() {
  condition.innerHTML = "";
  condition.style.color = "black";
  test.style.display = "none";
  condition.style.display = "block";
  condition.innerHTML = "Loading...";
  faceapi.nets.tinyFaceDetector.loadFromUri("models").then(absensi);
}

let stream;
let deviceId;
async function absensi() {
  if ("mediaDevices" in navigator) {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: "user" },
        },
      });
      const tracks = stream.getVideoTracks();
      video.srcObject = stream;
      video.style.display = "block";
      let interval = 200;
      //CEK SETIAP 0.2s SEKALI KARENA BIKIN LAG!!
      video.oncanplay = () => {
        let cek = setInterval(async function () {
          input = video;
          // const detections = true;
          const detections = await faceapi.detectSingleFace(
            input,
            new faceapi.TinyFaceDetectorOptions()
          );
          
          if (detections) {
            clearInterval(cek);
            // return data image
            let image = cekrik(64);
            test.src = image;
            // return data image

            img.value = image;
            clearInterval(loading);
            condition.style.color = "green";
            condition.innerHTML = "Wajah Terdeteksi!";
            video.style.display = "none";
            test.style.display = "block";
            // Menghindari gambar hitam
            test.addEventListener("load", () => {
              hadir.submit();
            });
          }
        }, interval);
      };

      // animasi loading
      condition.innerHTML = "Mencari Wajah";
      let loading = setInterval(function () {
        if (condition.innerHTML.length < 16) {
          condition.innerHTML += ".";
        } else {
          condition.innerHTML = "Mencari Wajah";
        }
      }, interval);
    } catch (err) {
      condition.innerHTML = err.message;
    }
  }
}

function cekrik(dims = 64, wm = true) {
  // kompres gambar ke dims pixel

  canvas.width = dims;
  canvas.height = dims;
  const c = canvas.getContext("2d");

  c.scale(-1, 1);
  c.drawImage(
    video,
    -dims,
    -(canvas.height * (video.videoHeight / video.videoWidth)) + dims,
    canvas.width,
    canvas.height * (video.videoHeight / video.videoWidth)
  );

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
    c.strokeText(text, canvas.width / 2, canvas.height / 2 + fontSize * scale);
  }
  // Return Base64
  return canvas.toDataURL("image/jpeg", 0.75);
}
