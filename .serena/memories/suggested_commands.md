# 推奨コマンド一覧

## 開発関連コマンド

### プロジェクト実行
```bash
# 開発サーバー起動 (Turbopack使用)
npm run dev

# 本番ビルド (Turbopack使用)
npm run build

# 本番サーバー起動
npm run start
```

### コード品質
```bash
# リントチェック
npm run lint

# コードフォーマット（自動修正）
npm run format
```

## システムコマンド (Darwin)

### ファイル操作
```bash
# ファイル一覧
ls

# ディレクトリ作成
mkdir <dirname>

# ファイル移動/リネーム
mv <source> <dest>
```

### 検索・分析
```bash
# ファイル検索
find <path> -name "<pattern>"

# テキスト検索
grep -r "<pattern>" <path>
```

### Git操作
```bash
# 状態確認
git status

# 変更をステージング
git add .

# コミット
git commit -m "message"

# ブランチ切り替え
git checkout <branch>
```

## Node.js環境
- Node.js: 24.4.1 (Volta経由で管理)
- npm: Volta経由で管理

## 検証用コマンド

### キャッシュ検証のための特別なコマンド
```bash
# クリーンビルド（.nextフォルダ削除後）
rm -rf .next && npm run build

# 本番環境でのキャッシュテスト
npm run build && npm run start

# 開発環境での動作確認
npm run dev
```

## 重要な注意事項
- 検証時は必ず本番ビルド（`npm run build && npm run start`）で行う
- 開発環境（`npm run dev`）はHMRキャッシュの影響があるため、キャッシュ検証には適さない
- Turbopackが有効になっているため、ビルド時間が短縮されている