"use server";
import { revalidatePath } from "next/cache";
import { generateServerActionTimeData } from "@/lib/timeUtils";

export async function clearCase4Cache() {
  revalidatePath("/case4");
  return { revalidated: true, timestamp: new Date().toISOString() };
}

export async function fetchCase4Data() {
  try {
    const data = generateServerActionTimeData("case4");
    console.log(`[Case4 Server Action] Generated data at ${new Date().toISOString()}`);
    return data;
  } catch (error) {
    console.error("[Case4 Server Action] Error:", error);
    throw error;
  }
}
