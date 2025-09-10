import { TestPanel } from "@/components/TestPanel";
import { generateTimeData } from "@/lib/timeUtils";

export const dynamic = "force-dynamic";

async function getData() {
  // 独自の時刻データ生成関数を使用（外部APIの代替）
  const data = generateTimeData();

  console.log(`[Case3] Generated data at ${new Date().toISOString()}`);

  return data;
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
