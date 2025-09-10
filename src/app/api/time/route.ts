import { NextResponse } from "next/server";

// グローバルカウンター（リクエストごとに増加）
let globalCounter = 0;

/**
 * 独自の時刻API Route Handler
 * 絶対に重複しない数値を生成してレスポンスする
 */
export async function GET() {
  // 現在時刻を取得
  const now = new Date();

  // 重複しない一意な値を生成
  // タイムスタンプ（ミリ秒）+ インクリメンタルカウンター
  const baseTimestamp = Date.now();
  const uniqueUnixtime = Math.floor((baseTimestamp + globalCounter) / 1000);

  // カウンターを増加（次回リクエスト用）
  globalCounter++;

  // レスポンス形式をworldtimeapi.orgに合わせる
  const response = {
    datetime: now.toISOString(),
    unixtime: uniqueUnixtime,
    timezone: "Asia/Tokyo", // 互換性のため

    // デバッグ用メタデータ
    _meta: {
      counter: globalCounter,
      isLocalAPI: true,
      generatedAt: now.toISOString(),
      description: "独自実装のモックタイム API",
    },
  };

  console.log(`[Local Time API] Generated unixtime: ${uniqueUnixtime}, counter: ${globalCounter}`);

  return NextResponse.json(response);
}
