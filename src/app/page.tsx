import Link from "next/link";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const testCases = [
    {
      number: 1,
      title: "Case 1: タグのみ",
      description: "next: { tags: ['time'] } のみ設定（ドキュメントの例）",
      color: "border-blue-200 hover:border-blue-300",
    },
    {
      number: 2,
      title: "Case 2: force-cache + タグ",
      description: "cache: 'force-cache' と next: { tags: ['time'] } を設定",
      color: "border-green-200 hover:border-green-300",
    },
    {
      number: 3,
      title: "Case 3: revalidate + タグ",
      description: "next: { tags: ['time'], revalidate: 60 } を設定",
      color: "border-yellow-200 hover:border-yellow-300",
    },
    {
      number: 4,
      title: "Case 4: デフォルト",
      description: "fetchオプションなし（デフォルト動作）",
      color: "border-gray-200 hover:border-gray-300",
    },
    {
      number: 5,
      title: "Case 5: no-store + タグ",
      description: "cache: 'no-store' と next: { tags: ['time'] } の競合",
      color: "border-red-200 hover:border-red-300",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Next.js 15 Cache Testing Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            fetch の next.tags オプションによるキャッシュ動作検証
          </p>
        </div>

        {/* テストケース一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testCases.map((testCase) => (
            <Card key={testCase.number} className={`transition-all ${testCase.color}`}>
              <CardHeader>
                <CardTitle className="text-lg">{testCase.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{testCase.description}</p>
                <Button asChild className="w-full">
                  <Link href={`/case${testCase.number}`}>テストを開始</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* テスト手順 */}
        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">📋 テスト手順</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>各ケースをクリックして詳細ページへ移動</li>
              <li>「ページ更新」ボタンでハードリロードしてキャッシュを確認</li>
              <li>「ソフトナビゲーション」でクライアントサイド遷移をテスト</li>
              <li>「RevalidateTag」でキャッシュクリアを実行</li>
              <li>「API経由で取得」でRoute Handler経由のフェッチを確認</li>
              <li>ログを確認してキャッシュ動作を検証</li>
            </ol>
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                ⚠️ 重要: 本番環境（
                <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                  npm run build && npm run start
                </code>
                ）でテストしてください
              </p>
            </div>
          </CardContent>
        </Card>

        {/* リアルタイム比較テーブル */}
        <ComparisonTable />
      </div>
    </div>
  );
}
