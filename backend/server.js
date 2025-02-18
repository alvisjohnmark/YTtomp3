import express from "express";
import cors from "cors";
import ytdl from "@distube/ytdl-core";
import fs from "fs";

const app = express();
app.use(cors());

const cookies = JSON.parse(fs.readFileSync("./cookies.json", "utf8"));

app.get("/download", async (req, res) => {
  let url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  res.header("Content-Disposition", 'attachment; filename="audio.mp3"');

  try {
    const options = {
      filter: "audioonly",
      quality: "highestaudio",
      requestOptions: {
        headers: {
          Cookie: Object.entries(cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join("; "),
        },
      },
    };

    ytdl(url, options).pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
