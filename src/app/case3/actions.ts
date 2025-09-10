"use server";
import { revalidateTag } from "next/cache";
import { generateServerActionTimeData } from "@/lib/timeUtils";

export async function clearTimeCache() {
  revalidateTag("time");
  return { revalidated: true, timestamp: new Date().toISOString() };
}

export async function fetchCase3Data() {
  try {
    const data = generateServerActionTimeData("case3");
    console.log(`[Case3 Server Action] Generated data at ${new Date().toISOString()}`);
    return data;
  } catch (error) {
    console.error("[Case3 Server Action] Error:", error);
    throw error;
  }
}
