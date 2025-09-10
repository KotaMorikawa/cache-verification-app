import { TestPanel } from "@/components/TestPanel";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Tokyo", {
      next: { tags: ["time"] },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log(`[Case1] Fetched at ${new Date().toISOString()}`);
    return res.json();
  } catch (error) {
    console.error("[Case1] Fetch error:", error);
    throw error;
  }
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
