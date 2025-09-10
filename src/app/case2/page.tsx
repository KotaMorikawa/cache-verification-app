import { TestPanel } from "@/components/TestPanel";

export const dynamic = "force-dynamic";

async function getData() {
  const res = await fetch("http://localhost:3000/api/time", {
    cache: "force-cache",
    next: { tags: ["time"] },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  console.log(`[Case2] Fetched data at ${new Date().toISOString()}`);

  return data;
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
