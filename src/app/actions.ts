"use server";
import { revalidateTag } from "next/cache";

export async function clearTimeCache() {
  revalidateTag("time");
  return { revalidated: true, timestamp: new Date().toISOString() };
}

// 各ケース用のデータ取得関数
const BASE_URL = "https://worldtimeapi.org/api/timezone/Asia/Tokyo";

export async function fetchCase1Data() {
  try {
    const res = await fetch(BASE_URL, {
      cache: "force-cache",
      next: { tags: ["time"] },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log(`[Case1 Server Action] Fetched at ${new Date().toISOString()}`);
    const data = await res.json();
    return {
      ...data,
      serverTime: new Date().toISOString(),
      caseNumber: "case1",
    };
  } catch (error) {
    console.error("[Case1 Server Action] Error:", error);
    throw error;
  }
}

export async function fetchCase2Data() {
  try {
    const res = await fetch(BASE_URL, {
      cache: "force-cache",
      next: { tags: ["time"] },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log(`[Case2 Server Action] Fetched at ${new Date().toISOString()}`);
    const data = await res.json();
    return {
      ...data,
      serverTime: new Date().toISOString(),
      caseNumber: "case2",
    };
  } catch (error) {
    console.error("[Case2 Server Action] Error:", error);
    throw error;
  }
}

export async function fetchCase3Data() {
  try {
    const res = await fetch(BASE_URL, {
      next: { tags: ["time"], revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log(`[Case3 Server Action] Fetched at ${new Date().toISOString()}`);
    const data = await res.json();
    return {
      ...data,
      serverTime: new Date().toISOString(),
      caseNumber: "case3",
    };
  } catch (error) {
    console.error("[Case3 Server Action] Error:", error);
    throw error;
  }
}

export async function fetchCase4Data() {
  try {
    const res = await fetch(BASE_URL, {
      cache: "force-cache",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log(`[Case4 Server Action] Fetched at ${new Date().toISOString()}`);
    const data = await res.json();
    return {
      ...data,
      serverTime: new Date().toISOString(),
      caseNumber: "case4",
    };
  } catch (error) {
    console.error("[Case4 Server Action] Error:", error);
    throw error;
  }
}

export async function fetchCase5Data() {
  try {
    const res = await fetch(BASE_URL, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log(`[Case5 Server Action] Fetched at ${new Date().toISOString()}`);
    const data = await res.json();
    return {
      ...data,
      serverTime: new Date().toISOString(),
      caseNumber: "case5",
    };
  } catch (error) {
    console.error("[Case5 Server Action] Error:", error);
    throw error;
  }
}
