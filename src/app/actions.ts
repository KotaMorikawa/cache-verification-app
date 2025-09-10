"use server";
import { revalidateTag } from "next/cache";
import { generateServerActionTimeData } from "@/lib/timeUtils";

export async function clearTimeCache() {
  revalidateTag("time");
  return { revalidated: true, timestamp: new Date().toISOString() };
}

// 各ケース用のデータ取得関数
export async function fetchCase1Data() {
  try {
    // 独自の時刻データ生成関数を使用
    const data = generateServerActionTimeData("case1");

    console.log(`[Case1 Server Action] Generated data at ${new Date().toISOString()}`);

    return data;
  } catch (error) {
    console.error("[Case1 Server Action] Error:", error);
    throw error;
  }
}

export async function fetchCase2Data() {
  try {
    // 独自の時刻データ生成関数を使用
    const data = generateServerActionTimeData("case2");

    console.log(`[Case2 Server Action] Generated data at ${new Date().toISOString()}`);

    return data;
  } catch (error) {
    console.error("[Case2 Server Action] Error:", error);
    throw error;
  }
}

export async function fetchCase3Data() {
  try {
    // 独自の時刻データ生成関数を使用
    const data = generateServerActionTimeData("case3");

    console.log(`[Case3 Server Action] Generated data at ${new Date().toISOString()}`);

    return data;
  } catch (error) {
    console.error("[Case3 Server Action] Error:", error);
    throw error;
  }
}

export async function fetchCase4Data() {
  try {
    // 独自の時刻データ生成関数を使用
    const data = generateServerActionTimeData("case4");

    console.log(`[Case4 Server Action] Generated data at ${new Date().toISOString()}`);

    return data;
  } catch (error) {
    console.error("[Case4 Server Action] Error:", error);
    throw error;
  }
}

export async function fetchCase5Data() {
  try {
    // 独自の時刻データ生成関数を使用
    const data = generateServerActionTimeData("case5");

    console.log(`[Case5 Server Action] Generated data at ${new Date().toISOString()}`);

    return data;
  } catch (error) {
    console.error("[Case5 Server Action] Error:", error);
    throw error;
  }
}
