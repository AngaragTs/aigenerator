"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PiStarFourLight } from "react-icons/pi";
import { TfiBackLeft } from "react-icons/tfi";
import { Input } from "@/components/ui/input";

import { IoDocumentTextOutline } from "react-icons/io5";
import { Textarea } from "@/components/ui/textarea";
import { CiImageOn } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const UploadedFile = event.target.files?.[0];
    if (!UploadedFile) return;
    setFile(UploadedFile);
    setPreview(URL.createObjectURL(UploadedFile));
  };

  const handledetect = async () => {
    if (!file) return;
    setLoading(true);
    setResult([]);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/detect/route.ts", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.object || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-400 ">
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
            <div className="w-full h-80 ">
              <div className="flex justify-between h-20">
                <div className="flex items-center h-10 gap-2">
                  <PiStarFourLight />

                  <p className="font-semibold font-xl">Image analysis</p>
                </div>
                <button
                  onClick={() => {
                    setPreview(null);
                    setFile(null);
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
                    Generate
                  </Button>
                </div>
              </div>
              <div className="w-full h-30">
                <div className="flex items-center gap-2">
                  <IoDocumentTextOutline className="w-5 h-5" />
                  <p className="font-semibold text-xl">Here is the summary</p>
                </div>
                <Textarea
                  value={(result || [])
                    .map((cur: { label: string }) => cur.label)
                    .join(",")}
                  placeholder="First, enter your image to recognize ingredients."
                  readOnly
                  className="text-[#71717A] text-sm border"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="recognition">
            <div className="w-full h-80 ">
              <div className="flex justify-between h-20">
                <div className="flex items-center h-10 gap-2">
                  <PiStarFourLight />

                  <p className="font-semibold font-xl">
                    Ingredient recognition
                  </p>
                </div>
                <button className="w-10 h-10 border border-[#E4E4E7] rounded-xl cursor-pointer flex items-center justify-center">
                  <TfiBackLeft />
                </button>
              </div>
              <div className="h-10">
                <p className="text-[#71717A] font-sm">
                  Describe the food, and AI will detect the ingredients.
                </p>
              </div>
              <div className="w-ful h-30">
                <Textarea />
                <div className="w-full h-10 flex justify-end items-end mt-5">
                  <button className="w-26 h-10 border bg-amber-950 rounded-xl cursor-pointer">
                    Generate
                  </button>
                </div>
              </div>
              <div className="w-full h-30">
                <div className="flex items-center gap-2">
                  <IoDocumentTextOutline className="w-4 h-5" />
                  <p className="font-semibold text-xl">
                    Identified Ingredients
                  </p>
                </div>
                <p className="text-[#71717A] text-sm">
                  First, enter your text to recognize an ingredients.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="creator">
            <div className="w-full h-80 ">
              <div className="flex justify-between h-20">
                <div className="flex items-center h-10 gap-2">
                  <PiStarFourLight />

                  <p className="font-semibold font-xl">Food image creator</p>
                </div>
                <button className="w-10 h-10 border border-[#E4E4E7] rounded-xl cursor-pointer flex items-center justify-center">
                  <TfiBackLeft />
                </button>
              </div>
              <div className="h-10">
                <p className="text-[#71717A] font-sm">
                  What food image do you want? Describe it briefly.
                </p>
              </div>
              <div className="w-ful h-30">
                <Textarea />
                <div className="w-full h-10 flex justify-end items-end mt-5">
                  <Button variant="destructive">Generate</Button>
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
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
