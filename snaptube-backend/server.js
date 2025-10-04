const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/convert", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).json({ error: "URL requerida" });

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, "-");

    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp3"`);
    res.setHeader("Content-Type", "audio/mpeg");

    ytdl(videoURL, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25
    }).pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al convertir video a MP3" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend SnapTube Pro funcionando 🚀");
});

app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
