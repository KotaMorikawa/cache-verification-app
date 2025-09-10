import { TestPanel } from "@/components/TestPanel";

export const dynamic = "force-dynamic";

async function getData() {
  const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Tokyo");
  console.log(`[Case4] Fetched at ${new Date().toISOString()}`);
  return res.json();
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
