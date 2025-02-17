import express from "express";
import cors from "cors";
import ytdl from "@distube/ytdl-core";

const { validateURL } = ytdl;

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
  let url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  url = url.split("?")[0];

  if (!validateURL(url)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  if (url.includes("youtu.be")) {
    url = url.replace("youtu.be/", "www.youtube.com/watch?v=");
  }

  res.header("Content-Disposition", 'attachment; filename="youraudiomf.mp3"');

  ytdl(url, { filter: "audioonly", quality: "highestaudio" }).pipe(res);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
