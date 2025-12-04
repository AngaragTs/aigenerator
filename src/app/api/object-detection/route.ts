import { NextRequest, NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN || process.env.HF_TOKEN;
const inference = new InferenceClient(HF_TOKEN || "");

interface DetectionResult {
  label: string;
  score: number;
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
}

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image" }, { status: 400 });
    }
    console.log("hii1");

    const results = (await inference.objectDetection({
      model: "facebook/detr-resnet-50",
      data: image,
    })) as DetectionResult[];
    console.log("hii2");

    const objects = results
      .filter((obj) => obj.score > 0.5)
      .map((obj) => ({ label: obj.label, score: obj.score, box: obj.box }));

    return NextResponse.json({ objects });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
};
