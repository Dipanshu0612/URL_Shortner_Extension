/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "react-toastify";

export default function LinkAnalytics() {
  const [input, setInput] = useState("");
  const [newURL, setNewURL] = useState({
    created_at: "",
    expires_at: "",
    main_url: "",
    hits: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchURLdata = async () => {
    setLoading(true);
    try {
      const validURL = new URL(input);
      try {
        const res = await fetch(
          `https://api.tinyurl.com/alias/${validURL.hostname}${validURL.pathname}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_TINYURL_KEY}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log(data);
        setNewURL({
          created_at: data.data.created_at,
          expires_at: data.data.expires_at,
          main_url: data.data.url,
          hits: data.data.hits,
        });
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
  const formatDate = (date: string) => {
    const newDate = new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return newDate;
  };

  return (
    <>
      <div className="h-full w-full flex flex-col flex-1 items-center justify-center text-center ">
        <h1 className="text-4xl font-bold sm:text-2xl md:text-3xl">
          Link Analytics
        </h1>
        <input
          type="text"
          className="border-2 border-gray-500 p-2 rounded-lg w-80 mt-4"
          placeholder="Enter Shorten URL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-lg mt-4"
          onClick={fetchURLdata}
          disabled={loading}
        >
          Analyze
        </button>

        {newURL.main_url !== "" && (
          <div className="flex flex-col items-center justify-center mt-4 text-left space-y-3 flex-wrap">
            <div className="space-y-5 border-2 p-3 rounded-3xl">
              <h2>
                Original URL: <a href={newURL.main_url}>{newURL.main_url}</a>
              </h2>
              <h2>Clicks: {newURL.hits}</h2>
              <h2>Created At: {formatDate(newURL.created_at)}</h2>
              <h2>Expires At: {newURL.expires_at === null ? "Never" : "-"}</h2>
            </div>
            <button
              onClick={() => {
                setNewURL({
                  created_at: "",
                  expires_at: "",
                  main_url: "",
                  hits: 0,
                });
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </>
  );
}
