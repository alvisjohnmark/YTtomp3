import express from "express";
import cors from "cors";
import ytdl from "@distube/ytdl-core";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
  let url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  console.log("Using cookies:", process.env.YT_COOKIES); // Debugging cookies

  res.header("Content-Disposition", 'attachment; filename="audio.mp3"');

  try {
    const options = {
      filter: "audioonly",
      quality: "highestaudio",
      requestOptions: {
        headers: {
          cookie: process.env.YT_COOKIES, 
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
    };

    ytdl(url, options).pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download audio" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
