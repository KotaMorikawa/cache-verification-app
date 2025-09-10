# Next.js 15 キャッシュ動作検証計画

## 🎯 検証目的

Next.js 15において、`fetch`の`next.tags`オプションを設定した際のキャッシュ動作を明確にする。
特に、ドキュメントの例では`cache: 'force-cache'`なしでタグが設定されているが、これが実際に機能するのかを検証する。

## 📋 検証環境

- **Next.js バージョン**: 15.x
- **ビルド環境**: 本番ビルド（`next build && next start`）
- **テスト用API**: `https://worldtimeapi.org/api/timezone/Asia/Tokyo`
  - レスポンスにタイムスタンプが含まれるため、キャッシュ確認が容易

## 🔍 検証ケース

### 共通コンポーネント

```typescript
// app/components/TestPanel.tsx
'use client';

import { useState } from 'react';
import { clearTimeCache } from '@/app/actions';

interface TestPanelProps {
  caseNumber: number;
  caseTitle: string;
  initialData: any;
  fetchConfig: string;
}

export function TestPanel({ caseNumber, caseTitle, initialData, fetchConfig }: TestPanelProps) {
  const [logs, setLogs] = useState<string[]>([
    `Initial load: ${initialData.datetime}`
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setLogs(prev => [...prev, `Page refreshed at ${new Date().toISOString()}`]);
    window.location.reload();
  };

  const handleSoftNavigation = () => {
    setLogs(prev => [...prev, `Soft navigation at ${new Date().toISOString()}`]);
    // Router.push を使った遷移
    window.location.href = `/case${caseNumber}`;
  };

  const handleRevalidate = async () => {
    setIsLoading(true);
    try {
      const result = await clearTimeCache();
      setLogs(prev => [...prev, `RevalidateTag executed: ${result.timestamp}`]);
    } catch (error) {
      setLogs(prev => [...prev, `Error: ${error}`]);
    }
    setIsLoading(false);
  };

  const handleFetchAPI = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/test/case${caseNumber}`);
      const data = await res.json();
      setLogs(prev => [...prev, `API fetch: ${data.datetime}`]);
    } catch (error) {
      setLogs(prev => [...prev, `Error: ${error}`]);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{caseTitle}</h2>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold">Fetch設定:</h3>
        <pre className="text-sm mt-2">{fetchConfig}</pre>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold">現在のデータ:</h3>
        <p>DateTime: {initialData.datetime}</p>
        <p>Unix: {initialData.unixtime}</p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🔄 ページ更新
        </button>
        
        <button
          onClick={handleSoftNavigation}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          🔗 ソフトナビゲーション
        </button>
        
        <button
          onClick={handleRevalidate}
          disabled={isLoading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          🗑️ RevalidateTag
        </button>
        
        <button
          onClick={handleFetchAPI}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          📡 API経由で取得
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">ログ:</h3>
        <div className="text-sm space-y-1">
          {logs.map((log, i) => (
            <div key={i} className="font-mono">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### ケース1: タグのみ設定（ドキュメントの例）

```typescript
// src/app/case1/page.tsx
import { TestPanel } from '@/components/TestPanel';

async function getData() {
  const res = await fetch('https://worldtimeapi.org/api/timezone/Asia/Tokyo', {
    next: { tags: ['time'] }
  });
  console.log(`[Case1] Fetched at ${new Date().toISOString()}`);
  return res.json();
}

export default async function Case1Page() {
  const data = await getData();
  
  return (
    <TestPanel
      caseNumber={1}
      caseTitle="Case 1: タグのみ"
      initialData={data}
      fetchConfig={`fetch(url, {
  next: { tags: ['time'] }
})`}
    />
  );
}
```

### ケース2: force-cache + タグ

```typescript
// src/app/case2/page.tsx
import { TestPanel } from '@/components/TestPanel';

async function getData() {
  const res = await fetch('https://worldtimeapi.org/api/timezone/Asia/Tokyo', {
    cache: 'force-cache',
    next: { tags: ['time'] }
  });
  console.log(`[Case2] Fetched at ${new Date().toISOString()}`);
  return res.json();
}

export default async function Case2Page() {
  const data = await getData();
  
  return (
    <TestPanel
      caseNumber={2}
      caseTitle="Case 2: force-cache + タグ"
      initialData={data}
      fetchConfig={`fetch(url, {
  cache: 'force-cache',
  next: { tags: ['time'] }
})`}
    />
  );
}
```

### ケース3: revalidate + タグ

```typescript
// src/app/case3/page.tsx
import { TestPanel } from '@/components/TestPanel';

async function getData() {
  const res = await fetch('https://worldtimeapi.org/api/timezone/Asia/Tokyo', {
    next: { 
      tags: ['time'],
      revalidate: 60  // 60秒でキャッシュ無効化
    }
  });
  console.log(`[Case3] Fetched at ${new Date().toISOString()}`);
  return res.json();
}

export default async function Case3Page() {
  const data = await getData();
  
  return (
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
  );
}
```

### ケース4: デフォルト（何も設定しない）

```typescript
// src/app/case4/page.tsx
import { TestPanel } from '@/components/TestPanel';

async function getData() {
  const res = await fetch('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
  console.log(`[Case4] Fetched at ${new Date().toISOString()}`);
  return res.json();
}

export default async function Case4Page() {
  const data = await getData();
  
  return (
    <TestPanel
      caseNumber={4}
      caseTitle="Case 4: デフォルト"
      initialData={data}
      fetchConfig={`fetch(url)
// オプションなし`}
    />
  );
}
```

### ケース5: no-store + タグ（競合するオプション）

```typescript
// src/app/case5/page.tsx
import { TestPanel } from '@/components/TestPanel';

async function getData() {
  const res = await fetch('https://worldtimeapi.org/api/timezone/Asia/Tokyo', {
    cache: 'no-store',
    next: { tags: ['time'] }  // 競合：no-storeとタグ
  });
  console.log(`[Case5] Fetched at ${new Date().toISOString()}`);
  return res.json();
}

export default async function Case5Page() {
  const data = await getData();
  
  return (
    <TestPanel
      caseNumber={5}
      caseTitle="Case 5: no-store + タグ（競合）"
      initialData={data}
      fetchConfig={`fetch(url, {
  cache: 'no-store',
  next: { tags: ['time'] }  // ⚠️ 競合
})`}
    />
  );
}
```

## 🧪 検証用Server Actions（API Routes不要）

**注意**: 当初予定していたAPI Routes (`/api/test/[case]`, `/api/revalidate`) は実装不要です。代わりにServer Actionsを使用することで、よりシンプルで効率的な実装を実現しています。

### Server Actions実装

```typescript
// src/app/actions.ts
'use server';
import { revalidateTag } from 'next/cache';

// revalidateTag用のServer Action
export async function clearTimeCache() {
  revalidateTag('time');
  return { revalidated: true, timestamp: new Date().toISOString() };
}

// 各ケース用のデータ取得Server Actions
const BASE_URL = "https://worldtimeapi.org/api/timezone/Asia/Tokyo";

export async function fetchCase1Data() {
  const res = await fetch(BASE_URL, {
    next: { tags: ["time"] },
  });
  const data = await res.json();
  return { ...data, serverTime: new Date().toISOString(), caseNumber: "case1" };
}

export async function fetchCase2Data() {
  const res = await fetch(BASE_URL, {
    cache: "force-cache",
    next: { tags: ["time"] },
  });
  const data = await res.json();
  return { ...data, serverTime: new Date().toISOString(), caseNumber: "case2" };
}

export async function fetchCase3Data() {
  const res = await fetch(BASE_URL, {
    next: { tags: ["time"], revalidate: 60 },
  });
  const data = await res.json();
  return { ...data, serverTime: new Date().toISOString(), caseNumber: "case3" };
}

export async function fetchCase4Data() {
  const res = await fetch(BASE_URL);
  const data = await res.json();
  return { ...data, serverTime: new Date().toISOString(), caseNumber: "case4" };
}

export async function fetchCase5Data() {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
    next: { tags: ["time"] },
  });
  const data = await res.json();
  return { ...data, serverTime: new Date().toISOString(), caseNumber: "case5" };
}
```

## 🎮 統合ダッシュボード

```typescript
// src/app/page.tsx （ダッシュボードは / に配置）
import Link from 'next/link';
import { ComparisonTable } from '@/components/ComparisonTable';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Next.js 15 Cache Testing Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <Link
              key={i}
              href={`/case${i}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">Case {i}</h2>
              <p className="text-gray-600">
                {i === 1 && 'タグのみ（ドキュメントの例）'}
                {i === 2 && 'force-cache + タグ'}
                {i === 3 && 'revalidate + タグ'}
                {i === 4 && 'デフォルト（オプションなし）'}
                {i === 5 && 'no-store + タグ（競合）'}
              </p>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">テスト手順</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>各ケースをクリックして詳細ページへ</li>
            <li>「ページ更新」ボタンでハードリロード</li>
            <li>「ソフトナビゲーション」でクライアントサイド遷移</li>
            <li>「RevalidateTag」でキャッシュクリア</li>
            <li>「API経由で取得」でRoute Handler経由のフェッチ</li>
            <li>ログを確認してキャッシュ動作を検証</li>
          </ol>
        </div>
        
        <ComparisonTable />
      </div>
    </div>
  );
}
```

### リアルタイム比較コンポーネント

```typescript
// src/components/ComparisonTable.tsx
'use client';

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ComparisonTable() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllCases = async () => {
    setIsLoading(true);
    const newResults: Record<string, any> = {};
    
    // Server Actionsを並列実行（API Routes不要）
    try {
      const { fetchCase1Data, fetchCase2Data, fetchCase3Data, fetchCase4Data, fetchCase5Data } =
        await import("@/app/actions");

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

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">リアルタイム比較</h2>
        <button
          onClick={fetchAllCases}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : '全ケースを取得'}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unix Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Server Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(results).map(([key, value]) => (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {value.unixtime || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {value.serverTime || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {value.error ? '❌ Error' : '✅ Success'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

## 📊 検証手順

### 1. プロジェクトセットアップ

```bash
# Next.js 15プロジェクト作成
npx create-next-app@latest cache-test --typescript --app --tailwind

# 依存関係インストール
cd cache-test
npm install
```

### 2. ビルド時の確認

```bash
npm run build
```

**確認項目：**
- 各ページのレンダリング方式
  - `○` (Static) = 静的生成
  - `λ` (Dynamic) = 動的レンダリング
  - `◐` (Partial Prerendering) = 部分的事前レンダリング

### 3. 本番環境で起動

```bash
npm run start
# http://localhost:3000/dashboard にアクセス
```

### 4. インタラクティブ検証

**ダッシュボードから実行：**

1. **初回測定**
   - ダッシュボードの「全ケースを取得」ボタンをクリック
   - 各ケースのUnix Timeを記録

2. **個別ケーステスト**
   - 各ケースのリンクをクリックして詳細ページへ
   - 以下のボタンで動作確認：
     - 🔄 **ページ更新**: ハードリロードでキャッシュ確認
     - 🔗 **ソフトナビゲーション**: Router Cache経由の遷移
     - 🗑️ **RevalidateTag**: キャッシュクリア実行
     - 📡 **API経由で取得**: Route Handler経由のフェッチ

3. **ログ確認**
   - 各アクションのタイムスタンプを比較
   - キャッシュの有無を判定

### 5. コンソールログ確認

```bash
# ターミナルでサーバーログを確認
# [CaseN] Fetched at ... のログでサーバーサイドのフェッチを確認
```

## 📈 結果記録テンプレート

### インタラクティブ検証結果

| ケース | ビルド時 | 初回表示 | ページ更新後 | RevalidateTag後 | API経由 | 結論 |
|--------|----------|----------|--------------|------------------|---------|------|
| 1. タグのみ | | | 同じ/違う？ | 更新される？ | | |
| 2. force-cache + タグ | | | 同じ/違う？ | 更新される？ | | |
| 3. revalidate + タグ | | | 同じ/違う？ | 更新される？ | | |
| 4. デフォルト | | | 同じ/違う？ | N/A | | |
| 5. no-store + タグ | | | 同じ/違う？ | 効果なし？ | | |

### 判定基準

- **キャッシュあり**: ページ更新後も同じUnix Time
- **キャッシュなし**: ページ更新で新しいUnix Time
- **RevalidateTag有効**: 実行後に新しいデータ取得
- **RevalidateTag無効**: 実行しても変化なし

## 🛠️ 追加設定ファイル

### レイアウト

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Next.js 15 Cache Testing',
  description: 'Testing cache behavior in Next.js 15',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Cache Testing</h1>
            <div className="space-x-4">
              <a href="/dashboard" className="hover:text-blue-300">Dashboard</a>
              <a href="/case1" className="hover:text-blue-300">Case 1</a>
              <a href="/case2" className="hover:text-blue-300">Case 2</a>
              <a href="/case3" className="hover:text-blue-300">Case 3</a>
              <a href="/case4" className="hover:text-blue-300">Case 4</a>
              <a href="/case5" className="hover:text-blue-300">Case 5</a>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
```

### Next.js設定

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    // ログ出力を詳細に
    logging: 'verbose',
  },
};

module.exports = nextConfig;
```

### package.json スクリプト

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "analyze": "ANALYZE=true next build",
    "test:build": "next build && echo '✅ Build successful'",
    "test:cache": "npm run build && npm run start"
  }
}
```

## 🔬 詳細検証項目

### A. 開発環境での動作確認

```bash
npm run dev
```

- HMRキャッシュの影響
- 開発環境特有の動作

### B. Router Cacheの影響

クライアントサイドナビゲーション時の挙動：

```typescript
// app/components/Navigation.tsx
'use client';
import Link from 'next/link';

export function Navigation() {
  return (
    <nav>
      <Link href="/case1">Case 1</Link>
      <Link href="/case2">Case 2</Link>
      {/* ... */}
    </nav>
  );
}
```

### C. ログ出力による確認

```typescript
// app/utils/logger.ts
export function logFetch(caseName: string) {
  console.log(`[${new Date().toISOString()}] Fetching data for ${caseName}`);
}
```

## 💡 予想される結果

### 仮説1: タグだけではキャッシュされない
- ケース1は動的レンダリングになる
- 毎回新しいデータを取得
- `revalidateTag`は効果なし

### 仮説2: タグ設定で暗黙的にキャッシュ
- ケース1でもキャッシュされる
- `revalidateTag`で更新可能
- ドキュメントの例が正しい

### 仮説3: 静的レンダリング時のみ有効
- ページ全体が静的な場合のみキャッシュ
- Full Route Cacheの影響を受ける

## 🛠️ トラブルシューティング

### よくある問題と対処法

1. **キャッシュがクリアされない**
   ```bash
   # .nextフォルダを削除して再ビルド
   rm -rf .next
   npm run build
   npm run start
   ```

2. **開発環境と本番環境で動作が異なる**
   - 必ず`npm run build && npm run start`で検証
   - 開発環境（`npm run dev`）はHMRキャッシュの影響あり
   - `NODE_ENV=production`を確認

3. **タイムスタンプが同じに見える**
   - Unix timeのミリ秒単位で比較
   - サーバーログも併せて確認
   - TestPanelのログ履歴を活用

4. **RevalidateTagが効かない**
   - コンソールエラーを確認
   - Server ActionとRoute Handlerの両方で試す
   - タグ名のタイポを確認（'time'で統一）

5. **ビルドエラー**
   ```bash
   # TypeScriptエラーの場合
   npm run build -- --no-lint
   
   # メモリ不足の場合
   NODE_OPTIONS='--max_old_space_size=4096' npm run build
   ```

### デバッグTips

```typescript
// app/debug/route.ts
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // キャッシュ状態を確認
  const testFetch = await fetch('https://worldtimeapi.org/api/timezone/Asia/Tokyo', {
    next: { tags: ['debug'] }
  });
  
  return Response.json({
    headers: Object.fromEntries(testFetch.headers.entries()),
    status: testFetch.status,
    cache: testFetch.headers.get('x-cache'),
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}
```

## 🎯 期待される検証結果

### 予想される結果パターン

| ケース | 予想される動作 | 理由 |
|--------|---------------|------|
| 1. タグのみ | キャッシュされない、revalidateTag無効 | v15ではデフォルトno-store |
| 2. force-cache + タグ | キャッシュされる、revalidateTag有効 | 明示的なキャッシュ指定 |
| 3. revalidate + タグ | キャッシュされる、60秒後自動更新、revalidateTag有効 | revalidateがキャッシュを暗黙的に有効化 |
| 4. デフォルト | キャッシュされない | v15のデフォルト動作 |
| 5. no-store + タグ | キャッシュされない、警告表示、revalidateTag無効 | 競合オプション |

### 確認ポイント

- ✅ ビルド時の静的/動的判定が正しいか
- ✅ キャッシュの有無が設定通りか  
- ✅ revalidateTagが期待通り動作するか
- ✅ 競合オプションで警告が出るか
- ✅ サーバーログとクライアント表示が一致するか

## 📚 参考資料

- [Next.js 15 Caching Documentation](https://nextjs.org/docs/app/guides/caching)
- [fetch API Reference](https://nextjs.org/docs/app/api-reference/functions/fetch)
- [revalidateTag API Reference](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)

## 🎯 最終目標

この検証により、以下を明確にする：

1. **`next.tags`のみでキャッシュが有効になるか**
   - ドキュメントの例が正しいか検証
   - 暗黙的なキャッシュ動作の有無

2. **`revalidateTag`が機能する条件**
   - 必要な設定の組み合わせ
   - Server Action vs Route Handlerの違い

3. **Next.js 15のキャッシュ戦略**
   - デフォルトの動作
   - 明示的な設定の必要性

4. **ベストプラクティスの確立**
   - 推奨される設定パターン
   - アンチパターンの特定

## 🚀 実装チェックリスト

- [x] プロジェクト作成（Next.js 15.5.2）
- [x] 5つのケースページ実装（src/app/case1-5/page.tsx）
- [x] TestPanelコンポーネント実装（shadcn/ui使用）
- [x] ダッシュボード実装（src/app/page.tsx）
- [x] Server Actions実装（API Routes不要）
- [x] ComparisonTable実装（Server Actions使用）
- [x] lint/build/typecheck通過
- [ ] ビルド＆本番環境で起動
- [ ] 各ケースで検証実施
- [ ] 結果を記録
- [ ] ドキュメントへのフィードバック作成

---

**作成日**: 2025年1月
**Next.js バージョン**: 15.x
**検証者**: [記入してください]

## 📝 検証結果記入欄

```
実際の検証結果をここに記入：

[Case 1: タグのみ]
- ビルド時: 
- キャッシュ動作: 
- revalidateTag: 
- 備考: 

[Case 2: force-cache + タグ]
- ビルド時: 
- キャッシュ動作: 
- revalidateTag: 
- 備考: 

[Case 3: revalidate + タグ]
- ビルド時: 
- キャッシュ動作: 
- revalidateTag: 
- 備考: 

[Case 4: デフォルト]
- ビルド時: 
- キャッシュ動作: 
- revalidateTag: N/A
- 備考: 

[Case 5: no-store + タグ]
- ビルド時: 
- キャッシュ動作: 
- revalidateTag: 
- 備考: 

結論：
```