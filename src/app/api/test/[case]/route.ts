import type { NextRequest } from "next/server";

async function fetchWithCase(caseNumber: string) {
  const url = "https://worldtimeapi.org/api/timezone/Asia/Tokyo";

  switch (caseNumber) {
    case "case1":
      return fetch(url, { next: { tags: ["time"] } });
    case "case2":
      return fetch(url, { cache: "force-cache", next: { tags: ["time"] } });
    case "case3":
      return fetch(url, { next: { tags: ["time"], revalidate: 60 } });
    case "case4":
      return fetch(url);
    case "case5":
      return fetch(url, { cache: "no-store", next: { tags: ["time"] } });
    default:
      throw new Error("Invalid case number");
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ case: string }> }
) {
  try {
    const { case: caseParam } = await params;
    const res = await fetchWithCase(caseParam);
    const data = await res.json();

    return Response.json({
      ...data,
      serverTime: new Date().toISOString(),
      caseNumber: caseParam,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
