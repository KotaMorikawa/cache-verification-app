"use server";
import { revalidateTag } from "next/cache";
import { generateServerActionTimeData } from "@/lib/timeUtils";

export async function clearTimeCache() {
  revalidateTag("time");
  return { revalidated: true, timestamp: new Date().toISOString() };
}

export async function fetchCase2Data() {
  try {
    const data = generateServerActionTimeData("case2");
    console.log(`[Case2 Server Action] Generated data at ${new Date().toISOString()}`);
    return data;
  } catch (error) {
    console.error("[Case2 Server Action] Error:", error);
    throw error;
  }
}
