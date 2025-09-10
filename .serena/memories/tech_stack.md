# 技術スタック

## フレームワーク・ライブラリ
- **Next.js**: 15.5.2 (App Router使用)
- **React**: 19.1.0
- **React DOM**: 19.1.0
- **TypeScript**: ^5

## 開発ツール
- **Biome**: 2.2.0 (リンター・フォーマッター)
- **Tailwind CSS**: ^4 (スタイリング)
- **PostCSS**: @tailwindcss/postcss ^4

## UI・スタイリング
- **Tailwind CSS**: ^4
- **class-variance-authority**: ^0.7.1 (スタイルバリアント管理)
- **clsx**: ^2.1.1 (条件付きクラス名)
- **tailwind-merge**: ^3.3.1 (Tailwindクラスのマージ)
- **lucide-react**: ^0.543.0 (アイコン)
- **tw-animate-css**: ^1.3.8 (アニメーション)

## フォント
- **Geist Sans** & **Geist Mono** (next/font経由)

## ビルドツール
- **Turbopack**: next devとnext buildで使用

## TypeScript設定
- **Target**: ES2017
- **Module**: ESNext
- **Path mapping**: `@/*` → `./src/*`
- **Strict**: true

## 特記事項
- App Routerを使用（Next.js 13+の新しいルーティング方式）
- Tailwind CSS v4（最新バージョン）
- Biome（Prettier + ESLintの代替として使用）