import { TestPanel } from "@/components/TestPanel";

export const dynamic = "force-dynamic";

async function getData() {
  const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Tokyo", {
    next: {
      tags: ["time"],
      revalidate: 60, // 60秒でキャッシュ無効化
    },
  } as RequestInit);
  console.log(`[Case3] Fetched at ${new Date().toISOString()}`);
  return res.json();
}

export default async function Case3Page() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-background p-8">
      <TestPanel
        caseNumber={3}
        caseTitle="Case 3: revalidate + タグ"
        initialData={data}
        fetchConfig={`fetch(url, {
  next: { 
    tags: ['time'],
    revalidate: 60
  }
})`}
      />
    </div>
  );
}
