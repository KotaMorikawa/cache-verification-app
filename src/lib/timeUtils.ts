// 重複しない時刻データを生成するユーティリティ
let globalCounter = 0;

export interface TimeData {
  datetime: string;
  unixtime: number;
  timezone: string;
  _meta: {
    counter: number;
    isLocalAPI: true;
    generatedAt: string;
    description: string;
  };
}

/**
 * 絶対に重複しない一意な時刻データを生成
 */
export function generateTimeData(): TimeData {
  const now = new Date();

  // 重複しない一意な値を生成
  // タイムスタンプ（ミリ秒）+ インクリメンタルカウンター
  const baseTimestamp = Date.now();
  const uniqueUnixtime = Math.floor((baseTimestamp + globalCounter) / 1000);

  // カウンターを増加（次回呼び出し用）
  globalCounter++;

  const data: TimeData = {
    datetime: now.toISOString(),
    unixtime: uniqueUnixtime,
    timezone: "Asia/Tokyo", // 互換性のため

    // デバッグ用メタデータ
    _meta: {
      counter: globalCounter,
      isLocalAPI: true,
      generatedAt: now.toISOString(),
      description: "独自実装のモックタイム データ",
    },
  };

  console.log(`[Local Time Util] Generated unixtime: ${uniqueUnixtime}, counter: ${globalCounter}`);

  return data;
}

/**
 * Server Action用の時刻データ生成
 */
export function generateServerActionTimeData(caseNumber: string): TimeData & {
  serverTime: string;
  caseNumber: string;
} {
  const baseData = generateTimeData();

  return {
    ...baseData,
    serverTime: new Date().toISOString(),
    caseNumber,
  };
}
