import { TestPanel } from "@/components/TestPanel";

export const dynamic = "force-dynamic";

async function getData() {
  const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Tokyo", {
    cache: "no-store",
    next: { tags: ["time"] }, // 競合：no-storeとタグ
  } as RequestInit);
  console.log(`[Case5] Fetched at ${new Date().toISOString()}`);
  return res.json();
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
