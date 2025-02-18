import express from "express";
import cors from "cors";
import ytdl from "@distube/ytdl-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Now use __dirname to build the path to cookies.json
const cookiesFilePath = path.resolve(__dirname, "cookies.json");

let cookies = {};
try {
  cookies = JSON.parse(fs.readFileSync(cookiesFilePath, "utf8"));
} catch (err) {
  console.error("Error reading cookies.json:", err);
}

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
