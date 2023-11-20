const condition = document.getElementById("condition");
const cariWajahButton = document.getElementById("cariWajahButton");
const test = document.getElementById("test");
const faceImg = document.getElementById("faceImg");
const video = document.getElementById("video");
const videoWrapper = document.getElementById("videoWrapper");

// Load faceapi
let loaded = false;
let loadedVid = false;
async function cariWajah() {
  condition.innerHTML = "";
  cariWajahButton.disabled = true;
  condition.style.color = "black";
  test.style.display = "none";
  condition.style.display = "block";
  condition.innerHTML = "Loading";
  const modelNames = [
    "tiny_face_detector_model.weights",
    "face_landmark_68_tiny_model.weights",
    "face_recognition_model.weights",
  ];

  if (!loaded) {
    if ("caches" in window) {
      const cache = await caches.open("faceapi");
      const cachess = await Promise.all(
        modelNames.map(async (m) => {
          const res = await cache.match("models/" + m);
          const data =
            res && "arrayBuffer" in res
              ? new Float32Array(await res.arrayBuffer())
              : undefined;
          return data;
        })
      );
      const models = await Promise.all(
        cachess.map(async (c, i) => {
          if (c instanceof Float32Array) return c;
          console.log(c);
          // return new Float32Array(c.split(",").map((v) => parseFloat(v)));
          const model = await faceapi.fetchNetWeights(
            "models/" + modelNames[i]
          );
          cache.add("models/" + modelNames[i]);
          return model;
        })
      );
      try {
        faceapi.nets.tinyFaceDetector.load(models[0]);
        faceapi.nets.faceLandmark68TinyNet.load(models[1]);
        faceapi.nets.faceRecognitionNet.load(models[2]);
      } catch (e) {
        console.log(e);
        cariWajahButton.disabled = false;
      }
    } else {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("models"),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri("models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("models"),
        ]);
      } catch (e) {
        console.log(e);
        cariWajahButton.disabled = false;
      }
    }
    loaded = true;
  }
  absensi();
}

let stream;
let deviceId;
async function absensi() {
  const { descriptor } = await faceapi
    .detectSingleFace(faceImg, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true)
    .withFaceDescriptor();
  // console.log(descriptor);
  if ("mediaDevices" in navigator) {
    if (!loadedVid) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: "user" },
          },
        });
        cariWajahButton.disabled = false;
        video.srcObject = stream;
        videoWrapper.style.display = "block";
        loadedVid = true;
      } catch (err) {
        condition.innerHTML = err.message;
        cariWajahButton.disabled = false;
        return false;
      }
    }
    let interval = 300;
    //CEK SETIAP 0.4s SEKALI KARENA BIKIN LAG!!
    video.oncanplay = async () => {
      condition.innerHTML = "Mencocokkan Wajah";
      let cek = setInterval(async function () {
        if (condition.innerHTML.length < 21) {
          condition.innerHTML += ".";
        } else {
          condition.innerHTML = "Mencocokkan Wajah";
        }
        input = video;
        const detections = await faceapi
          .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks(true)
          .withFaceDescriptor();
        
        // Cocokkan wajah

        if (detections) {
          const distance = faceapi.euclideanDistance(
            descriptor,
            detections.descriptor
          );
          if (distance >= 0.4) return;
          console.log(distance);
          clearInterval(cek);
          // clearTimeout(timeout);
          // return data image
          let image = cekrik(64);
          test.src = image;
          // return data image
          img.value = image;

          condition.style.color = "green";
          condition.innerHTML = "Wajah Terdeteksi!";
          videoWrapper.style.display = "none";
          test.style.display = "block";
          // Menghindari gambar hitam
          test.addEventListener("load", () => {
            hadir.submit();
          });
        }
      }, interval);
      // let timeout = setTimeout(() => {
      //   clearInterval(cek);
      //   condition.innerHTML = "Wajah tidak cocok!";
      //   condition.style.color = "red";
      // }, 30000);
    };
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
