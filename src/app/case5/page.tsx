import { TestPanel } from "@/components/TestPanel";
import { generateTimeData } from "@/lib/timeUtils";

export const dynamic = "force-dynamic";

async function getData() {
  // 独自の時刻データ生成関数を使用（外部APIの代替）
  const data = generateTimeData();

  console.log(`[Case5] Generated data at ${new Date().toISOString()}`);

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
