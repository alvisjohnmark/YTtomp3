import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const handleDownload = async () => {
    if (!url.trim()) return;
    const serverUrl = `http://localhost:5000/download?url=${encodeURIComponent(url)}`;
    window.location.href = serverUrl;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">YouTube to MP3 Converter</h1>
      <p className="mb-6 text-gray-400">No shitty ads. 100% Free to Use.</p>
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Paste YouTube URL here..."
          className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUrl(e.target.value)}
        />
          <button
          onClick={handleDownload}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition"
          >
            Download MP3
          </button>
      </div>
    </div>
  );
}

export default App;
