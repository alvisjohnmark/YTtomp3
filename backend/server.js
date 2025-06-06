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

// Path to cookies.json
const cookiesFilePath = path.resolve(__dirname, "cookies.json");

let cookies = [];
try {
  cookies = JSON.parse(fs.readFileSync(cookiesFilePath, "utf8"));
  console.log("Loaded cookies:", cookies); // Log the cookies array to see if it loads correctly
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

  // Set headers for the response
  res.header("Content-Disposition", 'attachment; filename="audio.mp3"');

  try {
    if (Array.isArray(cookies)) {
      // Pass the cookies array directly
      const options = {
        filter: "audioonly",
        quality: "highestaudio",
        requestOptions: {
          headers: {
            Cookie: cookies.map(cookie => `${cookie.name}=${cookie.value}`).join("; "),
          },
        },
      };

      // Start the download stream and pipe to the response
      ytdl(url, options).pipe(res);
    } else {
      throw new Error("Cookies are not loaded correctly.");
    }
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
