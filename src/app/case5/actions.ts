"use server";
import { revalidateTag } from "next/cache";
import { generateServerActionTimeData } from "@/lib/timeUtils";

export async function clearTimeCache() {
  revalidateTag("time");
  return { revalidated: true, timestamp: new Date().toISOString() };
}

export async function fetchCase5Data() {
  try {
    const data = generateServerActionTimeData("case5");
    console.log(`[Case5 Server Action] Generated data at ${new Date().toISOString()}`);
    return data;
  } catch (error) {
    console.error("[Case5 Server Action] Error:", error);
    throw error;
  }
}
