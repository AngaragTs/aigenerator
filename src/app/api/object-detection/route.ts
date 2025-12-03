import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN;
const inference = new InferenceClient({
  HF_TOKEN: HF_TOKEN || "",
});
type DetectionResult = {
  label: string;
  score: number;
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    const result = (await inference.objectDetection({
      Model: "facebook/detr-resnet-50",
      data: image,
    })) as DetectionResult[];
    const object = result
      .filter((obj) => obj.score > 0.5)
      .map((obj) => ({ label: obj.label, score: obj.score, box: obj.box }));
    return NextResponse.json(object);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
