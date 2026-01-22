//----------------------------------------------------------origanal hun mai----------
import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

const CLH = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
 

 const handleQuerySubmit = async () => {
  if (!query.trim() || loading) return; // 🔒 prevents spam clicks

  setLoading(true);
  setResponse("");

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user", // ✅ REQUIRED
              parts: [{ text: query }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512, // 🔽 lower quota usage
          },
        }),
      }
    );

    if (!res.ok) {
      if (res.status === 429) {
        setResponse("⚠️ Too many requests. Please wait 1 minute and try again.");
        return;
      }
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();
    const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    setResponse(geminiText || "No response from Gemini.");
  } catch (err) {
    console.error(err);
    setResponse("❌ Failed to fetch response.");
  } finally {
    setLoading(false);
  }
};



  const downloadAsPDF = () => {
    const element = document.getElementById("gemini-output");
    if (element) {
      const opt = {
        margin:       0.5,
        filename:     'CLH_Response.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
  
      html2pdf().set(opt).from(element).save();
    }
  };
  

  return (
     <div className="min-h-screen p-6 bg-[radial-gradient(circle,_#9ca3af_1px,_transparent_1px)] [background-size:20px_20px]">
  
    
    <div className="p-6 max-w-xl mx-auto rounded-2xl shadow-2xl space-y-5 bg-gradient-to-br from-white to-blue-50">
      <h2 className="text-2xl font-extrabold text-center text-blue-700">CLH Mode 🚀</h2>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query here..."
        className="w-full p-3 border-2 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-xl transition-all duration-300"
        rows={4}
      />

      <button
        onClick={handleQuerySubmit}
        className={`transition-all duration-300 ${
          loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-bold py-2 px-4 rounded-xl w-full shadow hover:shadow-md`}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Submit'}
      </button>

      {response && (
        <>
          <div
            id="gemini-output"
            className="bg-white border-l-4 border-blue-600 p-4 rounded-xl mt-4 shadow-inner transition-all duration-300 whitespace-pre-wrap"
          >
            <strong className="block text-blue-700 mb-2">CLH Response:</strong>
            <p className="text-gray-700">{response}</p>
          </div>
          <button
            onClick={downloadAsPDF}
            className="w-full bg-green-600 text-white p-3 rounded-lg mt-4 hover:bg-green-700 transition"
          >
            Download as PDF
          </button>
        </>
      )}
    </div>
       </div> 
  );
};

export default CLH;


