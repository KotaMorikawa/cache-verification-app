import { TestPanel } from "@/components/TestPanel";

export const dynamic = "force-dynamic";

async function getData() {
  const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Tokyo", {
    next: { tags: ["time"] },
  } as RequestInit);
  console.log(`[Case1] Fetched at ${new Date().toISOString()}`);
  return res.json();
}

export default async function Case1Page() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-background p-8">
      <TestPanel
        caseNumber={1}
        caseTitle="Case 1: タグのみ"
        initialData={data}
        fetchConfig={`fetch(url, {
  next: { tags: ['time'] }
})`}
      />
    </div>
  );
}
