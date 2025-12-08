"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PiStarFourLight } from "react-icons/pi";
import { TfiBackLeft } from "react-icons/tfi";
import { Input } from "@/components/ui/input";

import { IoDocumentTextOutline } from "react-icons/io5";
import { Textarea } from "@/components/ui/textarea";
import { CiAirportSign1, CiImageOn } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { FiMessageCircle } from "react-icons/fi";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyBSpoZInMQz5az3TRsErqBBLYF2sOmg3b4",
  });

  const handledetect = async () => {
    if (!file) return;
    setLoading(true);
    setResult([]);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/object-detection", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      setResult(data.objects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch("/api/image-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log(data);

      if (data.error) {
        console.error(data.error);
      } else if (data.image) {
        setImageUrl(data.image);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [text, setText] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);

  async function handleRecognition() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const prompt = `
  Extract all ingredients from the following text.
  Return ONLY a JSON array, nothing else.
  Text:
  "${text}"
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let extracted: string[] = [];

      // Use optional chaining and a fallback empty string
      const responseText = response.text ?? "";

      try {
        const match = responseText.match(/\[.*\]/s);
        if (match) {
          extracted = JSON.parse(match[0]);
        } else if (responseText) {
          extracted = [responseText]; // fallback
        }
      } catch (err) {
        console.error("Failed to parse JSON:", responseText);
        if (responseText) extracted = [responseText];
      }

      setIngredients(extracted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-h-screen ">
      <div className="w-full h-15 flex items-center border-b-2 border-[#E4E4E7]">
        <p className="font-black text-semibold ml-10">AI tools</p>
      </div>

      <div className="w-full flex justify-center">
        <Tabs defaultValue="analysis" className="w-[400px] mt-10">
          <TabsList>
            <TabsTrigger value="analysis">Image analysis</TabsTrigger>
            <TabsTrigger value="recognition">
              Ingredient recognition
            </TabsTrigger>
            <TabsTrigger value="creator">Image creator</TabsTrigger>
          </TabsList>
          <TabsContent value="analysis">
            <div className="w-full h-auto ">
              <div className="flex justify-between h-20 items-center">
                <div className="flex items-center h-10 gap-2">
                  <PiStarFourLight />

                  <p className="font-semibold font-xl">Image analysis</p>
                </div>
                <button
                  onClick={() => {
                    setPreview(null);
                    setFile(null);
                    setResult([]);
                  }}
                  className="w-10 h-10 border border-[#E4E4E7] rounded-xl cursor-pointer flex items-center justify-center"
                >
                  <TfiBackLeft />
                </button>
              </div>
              <div className="h-10">
                <p className="text-[#71717A] font-sm">
                  Upload a food photo, and AI will detect the ingredients.
                </p>
              </div>
              <div className="w-ful max-h-fit">
                <div className=" w-full max-w-sm items-center gap-3">
                  {!preview && (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;

                        setFile(f);
                        setPreview(URL.createObjectURL(f));
                      }}
                    />
                  )}

                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-40 h-40 object-cover rounded cursor-pointer"
                    />
                  )}
                </div>
                <div className="w-full h-10 flex justify-end items-end mt-5">
                  <Button
                    onClick={handledetect}
                    className=" rounded-xl cursor-pointer text-white"
                  >
                    {loading ? "Loading..." : "Generate"}
                  </Button>
                </div>
              </div>
              <div className="w-full h-30">
                <div className="flex items-center gap-2">
                  <IoDocumentTextOutline className="w-5 h-5" />
                  <p className="font-semibold text-xl">Here is the summary</p>
                </div>
                <Textarea
                  // value={result}
                  value={(result || [])
                    .map((cur: { label: string }) => cur.label)
                    .join(",")}
                  placeholder="First, enter your image to recognize ingredients."
                  readOnly
                  className="text-[#71717A] text-sm border"
                />
                {/* <div>
                  {result.map((item, index) => {
                    return <div key={index}>{item?.label}</div>;
                  })}
                </div> */}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="recognition">
            <div className="w-full h-auto">
              <div className="flex justify-between h-20 items-center">
                <div className="flex items-center gap-2">
                  <PiStarFourLight />
                  <p className="font-semibold font-xl">
                    Ingredient Recognition
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIngredients([]);
                    setText("");
                  }}
                  className="w-10 h-10 border border-[#E4E4E7] rounded-xl cursor-pointer flex items-center justify-center"
                >
                  <TfiBackLeft />
                </button>
              </div>

              <div>
                <p className="text-[#71717A] text-sm">
                  Describe the food, and AI will detect the ingredients.
                </p>
              </div>

              <div className="space-y-2">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter recipe or ingredients description..."
                />
                <div className="w-full flex justify-end">
                  <Button
                    onClick={handleRecognition}
                    className="rounded-xl text-white"
                  >
                    {loading ? "Loading..." : "Generate"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IoDocumentTextOutline size={20} />
                  <p className="font-semibold text-xl">
                    Identified Ingredients
                  </p>
                </div>
                {ingredients.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {ingredients.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#71717A] text-sm">
                    First, enter your text to recognize ingredients.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="creator">
            <div className="w-full h-80 ">
              <div className="flex justify-between h-20 items-center">
                <div className="flex items-center h-10 gap-2">
                  <PiStarFourLight />

                  <p className="font-semibold font-xl">Food image creator</p>
                </div>
                <button
                  onClick={() => {
                    setPrompt("");
                    setImageUrl(null);
                  }}
                  className="w-10 h-10 border border-[#E4E4E7] rounded-xl cursor-pointer flex items-center justify-center"
                >
                  <TfiBackLeft />
                </button>
              </div>
              <div className="h-10">
                <p className="text-[#71717A] font-sm">
                  What food image do you want? Describe it briefly.
                </p>
              </div>
              <div className="w-ful h-30">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Жишээ: Astronaut riding a horse"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                  onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                />
                <div className="w-full h-10 flex justify-end items-end mt-5">
                  <Button
                    onClick={handleGenerate}
                    className=" rounded-xl cursor-pointer text-white"
                  >
                    {loading ? "Loading..." : "Generate"}
                  </Button>
                </div>
              </div>
              <div className="w-full h-30">
                <div className="flex items-center gap-2">
                  <CiImageOn className="w-4 h-5" />
                  <p className="font-semibold text-xl">Result</p>
                </div>
                <p className="text-[#71717A] text-sm">
                  First, enter your text to generate an image.
                </p>
                {imageUrl && (
                  <div className="mt-6">
                    <img
                      src={imageUrl}
                      alt="Generated"
                      className="max-w-full rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-full h-full flex items-end justify-end relative z-50">
        <button className="w-12 h-12 rounded-full bg-black flex items-center justify-center cursor-pointer">
          <FiMessageCircle />
        </button>
      </div>
    </div>
  );
}
