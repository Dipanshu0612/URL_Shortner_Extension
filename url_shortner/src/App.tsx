/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import "./index.css";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";

function App() {
  const [input, setInput] = useState("");
  const [newURL, setNewURL] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const validURL = new URL(input);
      try {
        const res = await fetch("https://api.tinyurl.com/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TINYURL_KEY}`,
          },
          body: JSON.stringify({ url: validURL.href, description: "My URL" }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setNewURL(data.data.tiny_url);
        console.log(data);
      } catch (apiError: any) {
        toast.error("API request failed");
        console.log(apiError);
      }
    } catch (urlError: any) {
      toast.error("Invalid URL");
      console.log(urlError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-full w-full flex flex-col items-center justify-center min-h-[35rem] min-w-[25rem]">
        <h1 className="text-4xl font-bold sm:text-2xl md:text-3xl">URL Shortener</h1>
        <input
          type="text"
          className="border-2 border-gray-500 p-2 rounded-lg w-80 mt-4"
          placeholder="Enter URL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-lg mt-4"
          onClick={fetchData}
          disabled={loading}
        >
          Shorten URL
        </button>

        {loading && (
          <div className="flex flex-col items-center">
            <p className="text-blue-500 mt-4">Shortening your URL...</p>
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="blue"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}

        {newURL && (
          <div className="flex flex-col items-center">
            <a
              href={newURL}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 mt-4"
            >
              {newURL}
            </a>
            <button
              className="
              bg-blue-500
              text-white
              p-2
              rounded-lg
              mt-4"
              onClick={() => {
                navigator.clipboard.writeText(newURL);
                toast.success("Copied to clipboard!");
              }}
            >
              Copy to clipboard
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
