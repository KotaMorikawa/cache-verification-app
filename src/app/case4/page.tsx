import { TestPanel } from "@/components/TestPanel";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Tokyo");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log(`[Case4] Fetched at ${new Date().toISOString()}`);
    return res.json();
  } catch (error) {
    console.error("[Case4] Fetch error:", error);
    throw error;
  }
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
