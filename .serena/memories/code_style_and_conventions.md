# コードスタイルと規約

## コード品質ツール
- **Biome**: リンター・フォーマッターとして使用
- **TypeScript**: 厳密な型チェック (strict: true)

## Biome設定
- **インデントスタイル**: スペース
- **インデント幅**: 2スペース
- **ルール**: recommended設定を使用
- **Domain設定**: Next.js、Reactの推奨ルールを適用

## TypeScript規約
- **厳密設定**: strict: true
- **型安全性**: 型注釈を適切に使用
- **インターフェース**: Readonlyを適用（例: `Readonly<{ children: React.ReactNode }>`）
- **Path mapping**: `@/*` を使用してsrcディレクトリからの相対パスを簡潔に

## Next.js App Router規約
- **ディレクトリ構造**: `src/app` ベース
- **ページコンポーネント**: default exportを使用
- **レイアウト**: layout.tsx で共通レイアウトを定義
- **メタデータ**: Metadata型を使用した型安全なメタデータ

## React規約
- **関数コンポーネント**: 関数宣言形式を使用
- **Props型定義**: インターフェースまたは型エイリアスで明確に定義
- **export**: default exportを使用

## CSS/スタイリング規約
- **Tailwind CSS**: v4を使用
- **クラス名**: tailwind-mergeでクラスの重複を管理
- **条件付きスタイリング**: clsxを使用
- **レスポンシブデザイン**: Tailwindのブレイクポイントを活用

## ファイル命名規約
- **ページファイル**: page.tsx
- **レイアウトファイル**: layout.tsx
- **コンポーネント**: PascalCase.tsx
- **スタイル**: globals.css

## Import/Export規約
- **相対パス**: `@/*` を使用してsrcからの絶対パス
- **組織化**: Biomeの自動インポート整理機能を活用