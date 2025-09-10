"use client";

import { Link2, Radio, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Import all actions from each case segment
import { clearTimeCache as clearCase1Cache, fetchCase1Data } from "@/app/case1/actions";
import { clearTimeCache as clearCase2Cache, fetchCase2Data } from "@/app/case2/actions";
import { clearTimeCache as clearCase3Cache, fetchCase3Data } from "@/app/case3/actions";
import { clearCase4Cache, fetchCase4Data } from "@/app/case4/actions";
import { clearTimeCache as clearCase5Cache, fetchCase5Data } from "@/app/case5/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorldTimeData {
  datetime: string;
  unixtime: number;
}

interface ServerActionResponse extends WorldTimeData {
  serverTime: string;
  caseNumber: string;
}

interface TestPanelProps {
  caseNumber: number;
  caseTitle: string;
  initialData: WorldTimeData;
  fetchConfig: string;
}

export function TestPanel({ caseNumber, caseTitle, initialData, fetchConfig }: TestPanelProps) {
  const [logs, setLogs] = useState<string[]>([`Initial load: ${initialData.datetime}`]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleHardRefresh = () => {
    setLogs((prev) => [...prev, `Hard refresh at ${new Date().toISOString()}`]);
    // 完全なページリロード - 全キャッシュをバイパス
    window.location.reload();
  };

  const handleRouterRefresh = () => {
    setLogs((prev) => [...prev, `Router refresh at ${new Date().toISOString()}`]);
    // Next.jsのrouter.refresh() - データ再取得、Router Cacheは保持
    router.refresh();
    setLogs((prev) => [...prev, `Page data refreshed via router.refresh()`]);
  };

  const handleRouterNavigation = () => {
    setLogs((prev) => [...prev, `Router cache test at ${new Date().toISOString()}`]);
    // Router Cacheテスト: TOP→戻り
    setLogs((prev) => [...prev, `Navigating to TOP...`]);
    router.push(`/`);

    // 2秒後に元のページに戻る（Router Cache効果をテスト）
    setTimeout(() => {
      router.push(`/case${caseNumber}`);
    }, 2000);
  };

  const handleRevalidate = async () => {
    setIsLoading(true);
    try {
      let result: { revalidated: boolean; timestamp: string };
      let action: string;

      switch (caseNumber) {
        case 1:
          result = await clearCase1Cache();
          action = "RevalidateTag";
          break;
        case 2:
          result = await clearCase2Cache();
          action = "RevalidateTag";
          break;
        case 3:
          result = await clearCase3Cache();
          action = "RevalidateTag";
          break;
        case 4:
          result = await clearCase4Cache();
          action = "RevalidatePath";
          break;
        case 5:
          result = await clearCase5Cache();
          action = "RevalidateTag";
          break;
        default:
          throw new Error(`Invalid case number: ${caseNumber}`);
      }

      setLogs((prev) => [...prev, `${action} executed: ${result.timestamp}`]);
    } catch (error) {
      setLogs((prev) => [...prev, `Error: ${error}`]);
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{caseTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fetch設定表示 */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Fetch設定:</h3>
          <pre className="text-sm overflow-x-auto">{fetchConfig}</pre>
        </div>

        {/* 現在のデータ表示 */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold mb-2">現在のデータ:</h3>
          <p>DateTime: {initialData.datetime}</p>
          <p>Unix: {initialData.unixtime}</p>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleHardRefresh}
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            title="🔄 ハードリフレッシュ: window.location.reload()を実行
• 全キャッシュ（Router Cache、Data Cache）をクリア
• ページを完全にリロード
• 常に最新データを取得（キャッシュ無効化の基準値として使用）"
          >
            <RotateCcw className="w-4 h-4" />
            ハードリフレッシュ
          </Button>

          <Button
            onClick={handleRouterRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            title="📻 Router Refresh: router.refresh()を実行
• Router Cacheは保持したまま
• サーバーからページデータを再取得
• fetchのキャッシュ設定に従ってデータ更新
• ページ全体の再レンダリングは行わない"
          >
            <Radio className="w-4 h-4" />
            Router Refresh
          </Button>

          <Button
            onClick={handleRouterNavigation}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
            title="🔗 Router Cache Test: TOP→このページに自動遷移
• TOPページに移動後、2秒で自動的に戻る
• Router Cacheが有効な場合：キャッシュされたデータを表示
• Router Cacheが無効な場合：サーバーから新しいデータを取得"
          >
            <Link2 className="w-4 h-4" />
            Router Cache Test
          </Button>

          <Button
            onClick={handleRevalidate}
            disabled={isLoading}
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
            title={
              caseNumber === 4
                ? "🗑️ RevalidatePath: revalidatePath('/case4')を実行\n• 指定したパス(/case4)のキャッシュを無効化\n• tagsが設定されていないfetchにも効果あり\n• このCase4専用の無効化方法"
                : "🗑️ RevalidateTag: revalidateTag('time')を実行\n• 'time'タグが付いたキャッシュエントリを無効化\n• next: { tags: ['time'] }が設定されたfetchが対象\n• tagsが設定されていないfetchには効果なし"
            }
          >
            <Trash2 className="w-4 h-4" />
            {caseNumber === 4 ? "RevalidatePath" : "RevalidateTag"}
          </Button>
        </div>

        {/* ログ表示 */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">ログ:</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {logs.map((log, i) => (
              <div
                key={`log-${i}-${log.slice(0, 10)}`}
                className="text-sm font-mono p-2 bg-background rounded border"
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
