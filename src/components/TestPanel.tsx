"use client";

import { Link2, Radio, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
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

  const handleRefresh = () => {
    setLogs((prev) => [...prev, `Page refreshed at ${new Date().toISOString()}`]);
    window.location.reload();
  };

  const handleSoftNavigation = () => {
    setLogs((prev) => [...prev, `Soft navigation at ${new Date().toISOString()}`]);
    // Router.push を使った遷移
    window.location.href = `/case${caseNumber}`;
  };

  const handleRevalidate = async () => {
    setIsLoading(true);
    try {
      const clearTimeCache = (await import("@/app/actions")).clearTimeCache;
      const result = await clearTimeCache();
      setLogs((prev) => [...prev, `RevalidateTag executed: ${result.timestamp}`]);
    } catch (error) {
      setLogs((prev) => [...prev, `Error: ${error}`]);
    }
    setIsLoading(false);
  };

  const handleFetchAPI = async () => {
    setIsLoading(true);
    try {
      // Server Actionを直接呼び出し
      let data: ServerActionResponse;
      switch (caseNumber) {
        case 1: {
          const { fetchCase1Data } = await import("@/app/actions");
          data = await fetchCase1Data();
          break;
        }
        case 2: {
          const { fetchCase2Data } = await import("@/app/actions");
          data = await fetchCase2Data();
          break;
        }
        case 3: {
          const { fetchCase3Data } = await import("@/app/actions");
          data = await fetchCase3Data();
          break;
        }
        case 4: {
          const { fetchCase4Data } = await import("@/app/actions");
          data = await fetchCase4Data();
          break;
        }
        case 5: {
          const { fetchCase5Data } = await import("@/app/actions");
          data = await fetchCase5Data();
          break;
        }
        default:
          throw new Error(`Invalid case number: ${caseNumber}`);
      }

      setLogs((prev) => [...prev, `Server Action fetch: ${data.datetime}`]);
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
            onClick={handleRefresh}
            variant="default"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            ページ更新
          </Button>

          <Button
            onClick={handleSoftNavigation}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Link2 className="w-4 h-4" />
            ソフトナビゲーション
          </Button>

          <Button
            onClick={handleRevalidate}
            disabled={isLoading}
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            RevalidateTag
          </Button>

          <Button
            onClick={handleFetchAPI}
            disabled={isLoading}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Radio className="w-4 h-4" />
            API経由で取得
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
