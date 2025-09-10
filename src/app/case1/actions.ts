"use server";
import { revalidateTag } from "next/cache";
import { generateServerActionTimeData } from "@/lib/timeUtils";

export async function clearTimeCache() {
  revalidateTag("time");
  return { revalidated: true, timestamp: new Date().toISOString() };
}

export async function fetchCase1Data() {
  try {
    const data = generateServerActionTimeData("case1");
    console.log(`[Case1 Server Action] Generated data at ${new Date().toISOString()}`);
    return data;
  } catch (error) {
    console.error("[Case1 Server Action] Error:", error);
    throw error;
  }
}
