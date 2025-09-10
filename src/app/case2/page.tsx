import { TestPanel } from "@/components/TestPanel";

export const dynamic = "force-dynamic";

async function getData() {
  const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Tokyo", {
    cache: "force-cache",
    next: { tags: ["time"] },
  } as RequestInit);
  console.log(`[Case2] Fetched at ${new Date().toISOString()}`);
  return res.json();
}

export default async function Case2Page() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-background p-8">
      <TestPanel
        caseNumber={2}
        caseTitle="Case 2: force-cache + タグ"
        initialData={data}
        fetchConfig={`fetch(url, {
  cache: 'force-cache',
  next: { tags: ['time'] }
})`}
      />
    </div>
  );
}
