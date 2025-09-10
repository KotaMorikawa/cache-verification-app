"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { fetchCase1Data } from "@/app/case1/actions";
import { fetchCase2Data } from "@/app/case2/actions";
import { fetchCase3Data } from "@/app/case3/actions";
import { fetchCase4Data } from "@/app/case4/actions";
import { fetchCase5Data } from "@/app/case5/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ApiResponseData {
  unixtime?: number;
  serverTime?: string;
  error?: string;
}

export function ComparisonTable() {
  const [results, setResults] = useState<Record<string, ApiResponseData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllCases = async () => {
    setIsLoading(true);
    const newResults: Record<string, ApiResponseData> = {};

    // Server Actionsを並列実行
    try {
      const [case1, case2, case3, case4, case5] = await Promise.allSettled([
        fetchCase1Data(),
        fetchCase2Data(),
        fetchCase3Data(),
        fetchCase4Data(),
        fetchCase5Data(),
      ]);

      // 結果を格納
      newResults.case1 = case1.status === "fulfilled" ? case1.value : { error: "Failed to fetch" };
      newResults.case2 = case2.status === "fulfilled" ? case2.value : { error: "Failed to fetch" };
      newResults.case3 = case3.status === "fulfilled" ? case3.value : { error: "Failed to fetch" };
      newResults.case4 = case4.status === "fulfilled" ? case4.value : { error: "Failed to fetch" };
      newResults.case5 = case5.status === "fulfilled" ? case5.value : { error: "Failed to fetch" };
    } catch (_error) {
      // 全体的なエラーハンドリング
      for (let i = 1; i <= 5; i++) {
        newResults[`case${i}`] = { error: "Failed to fetch" };
      }
    }

    setResults(newResults);
    setIsLoading(false);
  };

  const getCaseDescription = (caseKey: string) => {
    const descriptions = {
      case1: "タグのみ",
      case2: "force-cache + タグ",
      case3: "revalidate + タグ",
      case4: "デフォルト",
      case5: "no-store + タグ（競合）",
    };
    return descriptions[caseKey as keyof typeof descriptions] || caseKey;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">リアルタイム比較</CardTitle>
          <Button
            onClick={fetchAllCases}
            disabled={isLoading}
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {isLoading ? "Loading..." : "全ケースを取得"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case</TableHead>
                <TableHead>説明</TableHead>
                <TableHead>Unix Time</TableHead>
                <TableHead>Server Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(results).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{key}</TableCell>
                  <TableCell>{getCaseDescription(key)}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {(value as ApiResponseData).unixtime || "N/A"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {(value as ApiResponseData).serverTime
                      ? new Date(
                          (value as ApiResponseData).serverTime as string
                        ).toLocaleTimeString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {(value as ApiResponseData).error ? (
                      <span className="text-red-600">❌ Error</span>
                    ) : (
                      <span className="text-green-600">✅ Success</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {Object.keys(results).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            「全ケースを取得」ボタンをクリックして比較を開始してください
          </div>
        )}
      </CardContent>
    </Card>
  );
}
