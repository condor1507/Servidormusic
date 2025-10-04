const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Función para normalizar URLs de YouTube
function normalizeURL(url){
  try{
    url = url.replace("youtu.be/","www.youtube.com/watch?v=");
    const videoParam = url.includes("v=") ? url.split("v=")[1].slice(0,11) : null;
    return videoParam ? "https://www.youtube.com/watch?v=" + videoParam : url.split("?")[0];
  }catch(e){
    return url;
  }
}

app.get("/convert", async (req, res) => {
  let videoURL = req.query.url;
  if(!videoURL) return res.status(400).json({ error: "URL requerida" });

  videoURL = normalizeURL(videoURL);

  try{
    // Verifica si el video existe
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, "-");

    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp3"`);
    res.setHeader("Content-Type", "audio/mpeg");

    ytdl(videoURL, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25
    }).pipe(res);

  } catch(err){
    console.error(err);
    res.status(500).json({ error: "No se pudo convertir el video. Puede estar privado, restringido o protegido por copyright." });
  }
});

app.get("/", (req, res) => {
  res.send("Backend SnapTube Pro funcionando 🚀");
});

app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
