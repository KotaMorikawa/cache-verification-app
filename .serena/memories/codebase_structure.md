# コードベース構造

## 現在のディレクトリ構造
```
cache-verification-app/
├── .serena/                 # Serenaの設定ファイル
├── .claude/                 # Claude設定
├── public/                  # 静的ファイル
├── src/
│   └── app/                # App Router ルートディレクトリ
│       ├── favicon.ico     # ファビコン
│       ├── globals.css     # グローバルCSS
│       ├── layout.tsx      # ルートレイアウト
│       └── page.tsx        # ホームページ
├── PRD.md                  # プロダクト要求仕様書（検証計画）
├── README.md               # プロジェクト説明
├── package.json            # 依存関係・スクリプト定義
├── package-lock.json       # 依存関係ロックファイル
├── tsconfig.json          # TypeScript設定
├── biome.json             # Biome設定
├── postcss.config.mjs     # PostCSS設定
├── next.config.ts         # Next.js設定
└── .gitignore             # Git無視ファイル設定
```

## 予定されている拡張構造（PRD.mdより）
```
src/app/
├── layout.tsx              # 共通レイアウト（ナビゲーション付き）
├── page.tsx               # ホームページ
├── dashboard/             # 統合ダッシュボード
│   ├── page.tsx          # ダッシュボードメイン
│   └── ComparisonTable.tsx # リアルタイム比較コンポーネント
├── case1/                 # ケース1: タグのみ
│   └── page.tsx
├── case2/                 # ケース2: force-cache + タグ
│   └── page.tsx
├── case3/                 # ケース3: revalidate + タグ
│   └── page.tsx
├── case4/                 # ケース4: デフォルト
│   └── page.tsx
├── case5/                 # ケース5: no-store + タグ
│   └── page.tsx
├── components/            # 共通コンポーネント
│   └── TestPanel.tsx     # テスト用パネルコンポーネント
├── actions.ts            # Server Actions
└── api/                  # API Routes
    ├── test/
    │   └── [case]/
    │       └── route.ts  # 各ケース用API
    └── revalidate/
        └── route.ts      # キャッシュ再検証API
```

## App Router の特徴
- **ファイルベースルーティング**: ディレクトリ構造がURLパスと対応
- **Server Components**: デフォルトでサーバーサイドレンダリング
- **Client Components**: 'use client' ディレクティブで明示的に指定
- **レイアウトシステム**: 各階層でlayout.tsxが共通レイアウトを提供
- **特殊ファイル**: page.tsx, layout.tsx, route.ts等の予約ファイル名

## 重要な設計パターン
- **テストケース分離**: 各ケースを独立したページとして実装
- **共通コンポーネント**: TestPanelで統一されたテストインターフェース
- **API統合**: Route HandlerとServer Actionsの両方でテスト
- **リアルタイム比較**: ダッシュボードで全ケースを一括確認