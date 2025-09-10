# プロジェクト概要

## プロジェクト名
cache-verification-app

## 目的
Next.js 15において、`fetch`の`next.tags`オプションを設定した際のキャッシュ動作を明確にする検証アプリケーション。

特に、ドキュメントの例では`cache: 'force-cache'`なしでタグが設定されているが、これが実際に機能するのかを検証することが主目的。

## 検証ケース
1. **Case 1**: タグのみ設定（ドキュメントの例）
2. **Case 2**: force-cache + タグ
3. **Case 3**: revalidate + タグ
4. **Case 4**: デフォルト（何も設定しない）
5. **Case 5**: no-store + タグ（競合するオプション）

## テスト用API
- 使用API: `https://worldtimeapi.org/api/timezone/Asia/Tokyo`
- レスポンスにタイムスタンプが含まれるため、キャッシュ確認が容易

## 期待される成果物
- 各ケースでのキャッシュ動作の検証結果
- Next.js 15のキャッシュ戦略の明確化
- ベストプラクティスの確立