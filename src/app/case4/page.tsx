import { TestPanel } from "@/components/TestPanel";

export const dynamic = "force-dynamic";

async function getData() {
  const res = await fetch("http://localhost:3000/api/time");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  console.log(`[Case4] Fetched data at ${new Date().toISOString()}`);

  return data;
}

export default async function Case4Page() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-background p-8">
      <TestPanel
        caseNumber={4}
        caseTitle="Case 4: デフォルト"
        initialData={data}
        fetchConfig={`fetch(url)
// オプションなし`}
      />
    </div>
  );
}
