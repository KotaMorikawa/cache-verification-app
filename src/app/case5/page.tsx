import { TestPanel } from "@/components/TestPanel";

export const dynamic = "force-dynamic";

async function getData() {
  const res = await fetch("http://localhost:3000/api/time", {
    cache: "no-store",
    next: { tags: ["time"] },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  console.log(`[Case5] Fetched data at ${new Date().toISOString()}`);

  return data;
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
