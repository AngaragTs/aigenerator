import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PiStarFourLight } from "react-icons/pi";
import { TfiBackLeft } from "react-icons/tfi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="w-full h-400 ">
      <div className="w-full h-15 flex items-center border-b-2 border-[#E4E4E7]">
        <p className="font-black text-semibold ml-10">AI tools</p>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-150 h-full">
          <Tabs defaultValue="analysis" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="analysis">Image analysis</TabsTrigger>
              <TabsTrigger value="recognition">
                Ingredient recognition
              </TabsTrigger>
              <TabsTrigger value="creator">Image creator</TabsTrigger>
            </TabsList>
            <TabsContent value="analysis">
              <div className="w-full h-40 ">
                <div className="flex justify-between ">
                  <div className="flex items-center h-10 gap-2">
                    <PiStarFourLight />

                    <p className="font-semibold font-xl">Image analysis</p>
                  </div>
                  <button className="w-10 h-10 border border-[#E4E4E7] rounded-xl cursor-pointer flex items-center justify-center">
                    <TfiBackLeft />
                  </button>
                </div>
                <div>
                  <p className="text-[#71717A] font-sm">
                    Upload a food photo, and AI will detect the ingredients.
                  </p>
                </div>
                <div className="w-full">
                  <div className=" w-full max-w-sm items-center gap-3">
                    <Input id="picture" type="file" />
                  </div>
                  <div className="w-full h-full flex justify-end items-end">
                    <button className="w-26 h-10 border bg-amber-950 rounded-xl cursor-pointer">
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="recognition">
              Change your password here.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
