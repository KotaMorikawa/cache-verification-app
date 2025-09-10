# Next.js 15 キャッシュ動作検証手順書

## 📋 検証概要

このドキュメントは、Next.js 15における `fetch` の `next.tags` オプションを使用したキャッシュ動作を体系的に検証するための手順書です。

### 🎯 検証目的

- `next.tags` のみでキャッシュが有効になるかを確認
- `revalidateTag` が機能する条件を特定  
- Next.js 15のキャッシュ戦略を明確化
- ベストプラクティスを確立

### 🔍 検証ケース

| ケース | 設定 | 検証ポイント |
|--------|------|-------------|
| Case 1 | `next: { tags: ['time'] }` | タグのみでキャッシュされるか |
| Case 2 | `cache: 'force-cache', next: { tags: ['time'] }` | 明示的キャッシュ + タグ |
| Case 3 | `next: { tags: ['time'], revalidate: 60 }` | revalidate + タグの組み合わせ |
| Case 4 | オプションなし | デフォルト動作 |
| Case 5 | `cache: 'no-store', next: { tags: ['time'] }` | 競合オプション |

## 🚀 環境準備

### 必要な環境

- Node.js 18.x以上
- Next.js 15.5.2
- 本番環境での検証（重要）

### プロジェクト起動

```bash
# 依存関係インストール
npm install

# 本番ビルド（必須）
npm run build

# 本番サーバー起動
npm run start

# ブラウザでアクセス
http://localhost:3000
```

⚠️ **重要**: 開発環境（`npm run dev`）では正確なキャッシュ動作を確認できません。必ず本番ビルドで検証してください。

## 📊 検証手順

### Phase 1: ビルド時確認

1. **ビルドログの確認**
   ```bash
   npm run build
   ```

2. **レンダリング方式の記録**
   ビルド出力で各ページのレンダリング方式を確認：
   - `○` (Static) = 静的生成
   - `ƒ` (Dynamic) = 動的レンダリング  
   - `◐` (Partial Prerendering) = 部分的事前レンダリング

### Phase 2: 初期データ取得

1. **ダッシュボードにアクセス**
   - http://localhost:3000 にアクセス
   - ページ下部の「全ケースを取得」ボタンをクリック

2. **ベースライン記録**
   各ケースのUnix Timeを記録（初期値として使用）

### Phase 3: 個別ケース検証

各ケースについて以下の手順を実行：

#### 3.1 基本動作確認

1. **ケースページにアクセス**
   - ダッシュボードから該当ケースをクリック
   - 初期表示データを記録

2. **ページ更新テスト**
   - 「ページ更新」ボタンをクリック
   - 新しいデータが表示されるかを確認
   - タイムスタンプを比較

#### 3.2 ナビゲーション動作確認

1. **ソフトナビゲーション**
   - 「ソフトナビゲーション」ボタンをクリック
   - Router Cacheの影響を確認

2. **ハードナビゲーション**
   - ブラウザのURL直接入力でアクセス
   - データの変化を確認

#### 3.3 キャッシュ操作確認

1. **RevalidateTag実行**
   - 「RevalidateTag」ボタンをクリック
   - ログに実行時刻が記録されることを確認

2. **RevalidateTag後の効果確認**
   - ページを更新
   - 新しいデータが取得されるかを確認

#### 3.4 API経由確認

1. **API経由データ取得**
   - 「API経由で取得」ボタンをクリック
   - Route Handler経由のデータを確認

## 📈 検証ポイント

### キャッシュ判定基準

- **キャッシュされている**: 複数回アクセスで同じUnix Time
- **キャッシュされていない**: アクセス毎に異なるUnix Time
- **RevalidateTag有効**: 実行後に新しいデータ取得
- **RevalidateTag無効**: 実行前後で変化なし

### ログ確認ポイント

1. **サーバーログ**
   ```
   [Case1] Fetched at 2025-01-XX...
   ```
   サーバー側でfetchが実行されたタイミング

2. **クライアントログ**  
   TestPanelの「ログ」セクションでクライアント側の動作確認

3. **ブラウザNetwork Tab**
   - リクエストの有無
   - レスポンスヘッダー
   - キャッシュステータス

## 📝 結果記録テンプレート

### 検証結果記録シート

```
検証日時: _______________
検証者: _______________
Next.jsバージョン: 15.5.2

【ビルド時確認】
Case 1: [ ] Static [ ] Dynamic
Case 2: [ ] Static [ ] Dynamic  
Case 3: [ ] Static [ ] Dynamic
Case 4: [ ] Static [ ] Dynamic
Case 5: [ ] Static [ ] Dynamic

【キャッシュ動作確認】
Case 1 (タグのみ):
- 初回Unix Time: _______________
- 更新後Unix Time: _______________  
- キャッシュ判定: [ ] あり [ ] なし
- RevalidateTag効果: [ ] あり [ ] なし
- 備考: _______________

Case 2 (force-cache + タグ):
- 初回Unix Time: _______________
- 更新後Unix Time: _______________
- キャッシュ判定: [ ] あり [ ] なし  
- RevalidateTag効果: [ ] あり [ ] なし
- 備考: _______________

Case 3 (revalidate + タグ):
- 初回Unix Time: _______________
- 更新後Unix Time: _______________
- キャッシュ判定: [ ] あり [ ] なし
- RevalidateTag効果: [ ] あり [ ] なし  
- 備考: _______________

Case 4 (デフォルト):
- 初回Unix Time: _______________
- 更新後Unix Time: _______________
- キャッシュ判定: [ ] あり [ ] なし
- 備考: _______________

Case 5 (no-store + タグ):  
- 初回Unix Time: _______________
- 更新後Unix Time: _______________
- キャッシュ判定: [ ] あり [ ] なし
- RevalidateTag効果: [ ] あり [ ] なし
- 警告表示: [ ] あり [ ] なし
- 備考: _______________

【総合判定】
Next.jsのタグのみでキャッシュは有効: [ ] YES [ ] NO
RevalidateTagが機能する条件: _______________
推奨設定: _______________
```

## 🔧 トラブルシューティング

### よくある問題と解決法

#### 1. キャッシュがクリアされない
```bash  
# .nextフォルダを削除して再ビルド
rm -rf .next
npm run build  
npm run start
```

#### 2. タイムスタンプが同じに見える
- Unix timeを正確に比較
- ミリ秒単位での差異も確認
- サーバーログと併せて確認

#### 3. RevalidateTagが効かない
- コンソールエラーをチェック
- Server ActionとRoute Handler両方で試行
- タグ名のタイポ確認（'time'で統一）

#### 4. 開発環境と本番環境で動作が異なる
- 必ず `npm run build && npm run start` で検証
- `NODE_ENV=production` を確認
- HMRキャッシュの影響を排除

#### 5. ビルドエラー
```bash
# TypeScriptエラーを無視してビルド
npm run build -- --no-lint

# メモリ不足の場合  
NODE_OPTIONS='--max_old_space_size=4096' npm run build
```

### デバッグ用コマンド

```bash
# 詳細なログ出力
DEBUG=* npm run start

# キャッシュ状態の確認
curl -I http://localhost:3000/api/test/case1

# プロセス確認
ps aux | grep next
```

## 🎯 期待される結果パターン

### パターンA: タグのみでキャッシュ有効
```
Case 1: キャッシュあり、RevalidateTag有効
→ Next.js 15でタグによる暗黙的キャッシュが機能
```

### パターンB: 明示的キャッシュが必要
```  
Case 1: キャッシュなし、RevalidateTag無効
Case 2: キャッシュあり、RevalidateTag有効
→ force-cacheまたはrevalidateの明示的指定が必要
```

### パターンC: 静的レンダリング依存
```
Static pages: キャッシュ有効
Dynamic pages: キャッシュ無効
→ Full Route Cacheの影響が支配的
```

## 📚 関連資料

- [Next.js 15 Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [fetch API Reference](https://nextjs.org/docs/app/api-reference/functions/fetch)  
- [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)

## ✅ チェックリスト

検証完了前に以下を確認：

- [ ] 本番環境でのテスト実行
- [ ] 5つのケース全て検証完了  
- [ ] ビルド時のレンダリング方式記録
- [ ] キャッシュ動作の詳細記録
- [ ] RevalidateTagの効果確認
- [ ] サーバーログとクライアントログの照合
- [ ] 結果記録シートの完成
- [ ] 推奨設定パターンの特定

---

**作成日**: 2025-01-XX  
**検証対象**: Next.js 15.5.2  
**最終更新**: 2025-01-XX