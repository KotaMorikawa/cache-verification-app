import { TestPanel } from "@/components/TestPanel";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Tokyo", {
      cache: "no-store",
      next: { tags: ["time"] }, // 競合：no-storeとタグ
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log(`[Case5] Fetched at ${new Date().toISOString()}`);
    return res.json();
  } catch (error) {
    console.error("[Case5] Fetch error:", error);
    throw error;
  }
}

export default async function Case5Page() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-background p-8">
      <TestPanel
        caseNumber={5}
        caseTitle="Case 5: no-store + タグ（競合）"
        initialData={data}
        fetchConfig={`fetch(url, {
  cache: 'no-store',
  next: { tags: ['time'] }  // ⚠️ 競合
})`}
      />
    </div>
  );
}
