# Next.js 15 Cache Verification App

Next.js 15における `fetch` の `next.tags` オプションを使用したキャッシュ動作を体系的に検証するためのアプリケーションです。

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)](https://www.typescriptlang.org/)

## 🎯 プロジェクト目的

Next.js 15のドキュメントでは `next.tags` のみでキャッシュタグが設定される例が示されていますが、実際に `cache: 'force-cache'` なしでキャッシュが機能するかを検証します。

### 主な検証項目

- ✅ `next.tags` のみでキャッシュが有効になるか
- ✅ `revalidateTag` が機能する条件
- ✅ 各種キャッシュオプションの組み合わせ効果
- ✅ Next.js 15のデフォルトキャッシュ動作

## 🚀 クイックスタート

### インストールと起動

```bash
# 依存関係のインストール
npm install

# 本番ビルド（重要：キャッシュ検証には必須）
npm run build

# 本番サーバー起動
npm run start
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

⚠️ **重要**: キャッシュ動作の正確な検証には本番環境（`npm run start`）が必要です。開発環境（`npm run dev`）ではHMRキャッシュの影響で正確な結果が得られません。

### テスト実行

1. **ダッシュボード**でケース概要を確認
2. 各**Case 1〜5**で個別テストを実行  
3. **詳細な手順**は [TEST_PROCEDURE.md](./TEST_PROCEDURE.md) を参照

## 📋 テストケース

| ケース | 設定 | 検証ポイント |
|--------|------|-------------|
| **Case 1** | `next: { tags: ['time'] }` | タグのみでキャッシュされるか |
| **Case 2** | `cache: 'force-cache', next: { tags: ['time'] }` | 明示的キャッシュ + タグ |
| **Case 3** | `next: { tags: ['time'], revalidate: 60 }` | revalidate + タグの組み合わせ |
| **Case 4** | オプションなし | Next.js 15のデフォルト動作 |
| **Case 5** | `cache: 'no-store', next: { tags: ['time'] }` | 競合オプションの動作 |

## 🏗️ アーキテクチャ

```
src/
├── app/
│   ├── case1~5/           # 各テストケースページ
│   │   └── page.tsx       # Server Component with fetch
│   ├── api/
│   │   ├── test/[case]/   # テスト用API Routes
│   │   └── revalidate/    # キャッシュ無効化API
│   ├── actions.ts         # Server Actions (revalidateTag)
│   ├── layout.tsx         # アプリケーションレイアウト
│   └── page.tsx          # ダッシュボード
└── components/
    ├── TestPanel.tsx      # 統一テストインターフェース
    ├── ComparisonTable.tsx # リアルタイム比較テーブル
    └── ui/               # shadcn/ui components
```

## ✨ 主要機能

### 🎮 TestPanel (インタラクティブテスト)

各ケースページで利用可能な統一テストインターフェース：

- **🔄 ページ更新**: ハードリロードでキャッシュ確認
- **🔗 ソフトナビゲーション**: Router Cache経由の遷移テスト  
- **🗑️ RevalidateTag**: Server Actionによるキャッシュ無効化
- **📡 API経由で取得**: Route Handler経由のフェッチテスト

### 📊 ダッシュボード

- 全ケースの概要表示
- リアルタイム比較テーブル
- 一括データ取得機能

### 🔍 詳細ログ

- サーバーサイドフェッチログ
- クライアントサイドアクションログ  
- タイムスタンプ比較による精密なキャッシュ検証

## 🛠️ 技術スタック

### Core
- **Next.js** 15.5.2 (App Router)
- **React** 19.1.0
- **TypeScript** 5.x

### Styling & UI
- **Tailwind CSS** v4
- **shadcn/ui** コンポーネント
- **Lucide React** アイコン

### Development
- **Biome** (リンター/フォーマッター)
- **Turbopack** (ビルドツール)

### API
- **WorldTimeAPI** - キャッシュ検証用タイムスタンプAPI

## 📝 開発者向けコマンド

```bash
# 開発サーバー（HMRキャッシュあり）
npm run dev

# 本番ビルド
npm run build  

# 本番サーバー起動
npm run start

# コード品質チェック
npm run lint        # Biome lint
npm run typecheck   # TypeScript check  
npm run format      # Biome format

# クリーンビルド（キャッシュリセット）
rm -rf .next && npm run build && npm run start
```

## 📚 ドキュメント

- **[TEST_PROCEDURE.md](./TEST_PROCEDURE.md)** - 詳細なテスト手順書
- **[PRD.md](./PRD.md)** - プロダクト要求仕様書
- **[CLAUDE.md](./CLAUDE.md)** - AI開発時のプロジェクト指示書

## 🧪 検証結果の解釈

### キャッシュ判定基準

- **キャッシュ有効**: 複数回アクセスで同じUnix Time
- **キャッシュ無効**: アクセス毎に異なるUnix Time
- **RevalidateTag有効**: 実行後に新しいデータ取得
- **RevalidateTag無効**: 実行前後でデータ不変

### ビルド出力の見方

```
Route (app)                         Size  First Load JS
├ ○ /                            1.54 kB         129 kB
├ ƒ /case1                           0 B         130 kB
├ ƒ /case2                           0 B         130 kB
```

- `○` Static: 静的生成（ビルド時に事前レンダリング）
- `ƒ` Dynamic: 動的レンダリング（リクエスト時にレンダリング）

## 🔧 トラブルシューティング

### よくある問題

1. **キャッシュが期待通りに動作しない**
   ```bash
   rm -rf .next && npm run build && npm run start
   ```

2. **開発環境と本番環境で結果が異なる**  
   → 必ず本番ビルドで検証してください

3. **TypeScriptエラー**
   ```bash
   npm run typecheck
   ```

4. **RevalidateTagが効かない**
   → コンソールログでエラーを確認

詳細は [TEST_PROCEDURE.md](./TEST_PROCEDURE.md) のトラブルシューティング章を参照

## 🔬 検証結果

### テスト実行環境
- **日時**: 2025年9月10日
- **バージョン**: Next.js 15.5.2, React 19.1.0
- **環境**: 本番ビルド (`npm run build && npm run start`)

### 詳細結果

| ケース | 設定 | ハードリフレッシュ | RevalidateTag | 結論 |
|--------|------|------------------|---------------|------|
| **Case 1** | `next: { tags: ['time'] }` | ❌ キャッシュされない | ⚠️ 効果あり（但し意味なし） | **キャッシュ無効** |
| **Case 2** | `cache: 'force-cache', next: { tags: ['time'] }` | ✅ キャッシュされる | ✅ 正常に新データ取得 | **キャッシュ有効** |
| **Case 3** | `next: { tags: ['time'], revalidate: 60 }` | ✅ キャッシュされる | ✅ 正常に新データ取得 | **キャッシュ有効** |
| **Case 4** | オプションなし | ❌ キャッシュされない | - | **キャッシュ無効** |
| **Case 5** | `cache: 'no-store', next: { tags: ['time'] }` | ❌ キャッシュされない | ❌ 効果なし | **競合により無効** |

### 🚨 重要な発見事項

#### **`next: { tags: ['time'] }` だけではキャッシュが有効にならない**

Next.js 15のドキュメント例では `next: { tags: ['time'] }` のみの記載がありますが、実際には**キャッシュは有効になりません**。

```javascript
// ❌ これだけではキャッシュされない（ドキュメント例）
const data = await fetch(url, { next: { tags: ['time'] } })

// ✅ 明示的なキャッシュ設定が必要
const data = await fetch(url, { 
  cache: 'force-cache',
  next: { tags: ['time'] } 
})

// ✅ または revalidate オプション
const data = await fetch(url, { 
  next: { tags: ['time'], revalidate: 60 } 
})
```

#### **`revalidateTag` が機能する条件**

- ✅ `cache: 'force-cache'` + `next: { tags: [...] }`
- ✅ `next: { tags: [...], revalidate: N }`
- ❌ `next: { tags: [...] }` のみ
- ❌ `cache: 'no-store'` + `next: { tags: [...] }`

### 📋 推奨事項

1. **キャッシュタグを使用する場合は必ず以下を併用**:
   - `cache: 'force-cache'` または
   - `revalidate` オプション

2. **Next.js 15での推奨パターン**:
   ```javascript
   // 無期限キャッシュ + タグベース無効化
   fetch(url, { 
     cache: 'force-cache',
     next: { tags: ['user', 'profile'] } 
   })

   // 時間ベース + タグベース無効化
   fetch(url, { 
     next: { 
       tags: ['posts'], 
       revalidate: 3600 // 1時間
     } 
   })
   ```

3. **開発時の注意**:
   - 本番ビルドでの検証が必須
   - `revalidateTag` の効果確認には適切なキャッシュ設定が前提

## 🎯 検証完了項目

この検証により以下を明確化：

- ✅ Next.js 15での `next.tags` のみによるキャッシュ動作 → **無効であることを確認**
- ✅ `revalidateTag` が機能する最小要件 → **明示的キャッシュ設定が必要**
- ✅ 推奨されるキャッシュ設定パターン → **force-cache + tagsまたはrevalidate + tags**
- ✅ Next.js 15キャッシュ戦略のベストプラクティス → **上記推奨事項を策定**

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

**📊 検証結果**: 上記の「🔬 検証結果」セクションに詳細なテスト結果を記載しています。

**🔗 関連リンク**:
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)