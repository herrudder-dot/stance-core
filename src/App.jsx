/**
 * STANCE CORE - Cycling Body Mechanics Analysis App
 * 
 * APAに基づいた身体タイプ診断アプリ
 * 8つのStance Type（F/R × I/O × X/II）を判定し、
 * 最適なフィッティングと機材を提案
 * 
 * @version 2.0.0
 * @license MIT
 */

import { useState, useEffect } from "react";

// グローバルスタイル（アニメーション）
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }
    @keyframes glow {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    * { 
      box-sizing: border-box;
      font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    }
    body { 
      margin: 0; 
      background: #FAFAFA;
      font-weight: 400;
      -webkit-font-smoothing: antialiased;
    }
  `}</style>
);

// ========================================
// テーマ設定（STANCE CORE Premium Design）
// ========================================
const THEMES = {
  // Light Glass UI: ライト背景 + ティールアクセント + 透過カード
  premium: {
    name: "premium",
    bg: "#F0F2F5",
    bgSolid: "#F0F2F5",
    aurora: null,
    startBg: null,
    startBgSolid: "#F0F2F5",
    
    // カード（半透明ガラス）
    card: "rgba(255, 255, 255, 0.65)",
    cardBorder: "rgba(255, 255, 255, 0.5)",
    cardHover: "rgba(255, 255, 255, 0.8)",
    
    // テキスト
    text: "#1a1a1a",
    textMuted: "#555555",
    textDim: "#999999",
    
    // アクセント（ティール）
    accent: "#1a7a7a",
    accentGradient: "linear-gradient(135deg, #1a8a8a, #4DB8B8)",
    accentLight: "#2a9a9a",
    accentDark: "#156e6e",
    
    // タイプ別カラー
    typeColors: {
      FIX:  { main: "#E8960C", gradient: "linear-gradient(135deg, #E8960C, #C67D08)", glow: "rgba(232, 150, 12, 0.12)" },
      FIII: { main: "#0891B2", gradient: "linear-gradient(135deg, #06B6D4, #0891B2)", glow: "rgba(6, 182, 212, 0.12)" },
      FOX:  { main: "#DC2626", gradient: "linear-gradient(135deg, #EF4444, #DC2626)", glow: "rgba(239, 68, 68, 0.12)" },
      FOII: { main: "#059669", gradient: "linear-gradient(135deg, #10B981, #059669)", glow: "rgba(16, 185, 129, 0.12)" },
      RIX:  { main: "#7C3AED", gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)", glow: "rgba(139, 92, 246, 0.12)" },
      RIII: { main: "#4F46E5", gradient: "linear-gradient(135deg, #6366F1, #4F46E5)", glow: "rgba(99, 102, 241, 0.12)" },
      ROX:  { main: "#DB2777", gradient: "linear-gradient(135deg, #EC4899, #DB2777)", glow: "rgba(236, 72, 153, 0.12)" },
      ROII: { main: "#475569", gradient: "linear-gradient(135deg, #64748B, #475569)", glow: "rgba(100, 116, 139, 0.12)" },
    },
    
    // セマンティック
    pink: "#EC4899",
    green: "#10B981",
    orange: "#E8960C",
    red: "#EF4444",
    cyan: "#1a7a7a",
    yellow: "#E8960C",
    
    // エフェクト
    shadow: "0 2px 16px rgba(0, 0, 0, 0.05)",
    shadowLg: "0 12px 40px rgba(0, 0, 0, 0.08)",
    shadowCard: "0 2px 20px rgba(0, 0, 0, 0.04)",
    glow: (color) => `0 0 30px ${color}18`,
    glassBg: "rgba(255, 255, 255, 0.5)",
    glassBorder: "rgba(255, 255, 255, 0.4)",
    blur: "blur(16px)",
  },
  
  premiumDark: {
    name: "premiumDark",
    bg: "#0a0a0a",
    bgSolid: "#0a0a0a",
    aurora: null,
    startBg: null,
    startBgSolid: "#0a0a0a",
    
    card: "rgba(255, 255, 255, 0.06)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    cardHover: "rgba(255, 255, 255, 0.1)",
    
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.65)",
    textDim: "rgba(255, 255, 255, 0.35)",
    
    accent: "#2a9a9a",
    accentGradient: "linear-gradient(135deg, #2a9a9a, #1a8a8a)",
    accentLight: "#3ab0b0",
    accentDark: "#1a7a7a",
    
    typeColors: {
      FIX:  { main: "#F59E0B", gradient: "linear-gradient(135deg, #F59E0B, #D97706)", glow: "rgba(245, 158, 11, 0.3)" },
      FIII: { main: "#06B6D4", gradient: "linear-gradient(135deg, #06B6D4, #0891B2)", glow: "rgba(6, 182, 212, 0.3)" },
      FOX:  { main: "#EF4444", gradient: "linear-gradient(135deg, #EF4444, #DC2626)", glow: "rgba(239, 68, 68, 0.3)" },
      FOII: { main: "#10B981", gradient: "linear-gradient(135deg, #10B981, #059669)", glow: "rgba(16, 185, 129, 0.3)" },
      RIX:  { main: "#8B5CF6", gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)", glow: "rgba(139, 92, 246, 0.3)" },
      RIII: { main: "#6366F1", gradient: "linear-gradient(135deg, #6366F1, #4F46E5)", glow: "rgba(99, 102, 241, 0.3)" },
      ROX:  { main: "#EC4899", gradient: "linear-gradient(135deg, #EC4899, #DB2777)", glow: "rgba(236, 72, 153, 0.3)" },
      ROII: { main: "#64748B", gradient: "linear-gradient(135deg, #64748B, #475569)", glow: "rgba(100, 116, 139, 0.3)" },
    },
    
    pink: "#EC4899",
    green: "#2a9a9a",
    orange: "#F59E0B",
    red: "#EF4444",
    cyan: "#2a9a9a",
    yellow: "#F59E0B",
    
    shadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
    shadowLg: "0 20px 50px rgba(0, 0, 0, 0.35)",
    shadowCard: "0 4px 30px rgba(0, 0, 0, 0.15)",
    glow: (color) => `0 0 40px ${color}40`,
    glassBg: "rgba(255, 255, 255, 0.04)",
    glassBorder: "rgba(255, 255, 255, 0.06)",
    blur: "blur(16px)",
  },
};

// 現在のテーマを選択
const CURRENT_THEME = "premium";
const theme = THEMES[CURRENT_THEME];

// テーマからカラーを取得
const C = {
  bg: theme.bgSolid,
  card: theme.card,
  cardBorder: theme.cardBorder,
  text: theme.text,
  textMuted: theme.textMuted,
  textDim: theme.textDim,
  accent: theme.accent,
  accentLight: theme.accentLight,
  accentDark: theme.accentDark,
  pink: theme.pink,
  green: theme.green,
  orange: theme.orange,
  red: theme.red,
  cyan: theme.cyan,
  yellow: theme.yellow,
  shadowLight: "#FFFFFF",
  shadowDark: "rgba(0,0,0,0.06)",
};

// スタイルヘルパー（Light Glass UIデザイン）
const styles = {
  card: {
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRadius: 20,
    padding: 24,
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.04)",
  },
  cardPressed: {
    background: "rgba(255, 255, 255, 0.45)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRadius: 16,
    padding: 20,
    border: "1px solid rgba(255, 255, 255, 0.35)",
    boxShadow: "none",
  },
  buttonPrimary: {
    background: theme.accentGradient,
    border: "none",
    borderRadius: 50,
    padding: "16px 36px",
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: `0 4px 20px ${theme.accent}35`,
  },
  buttonSecondary: {
    background: "rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderRadius: 50,
    padding: "14px 28px",
    color: theme.textMuted,
    fontWeight: 500,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  typeGlow: (type) => ({
    boxShadow: theme.typeColors[type]?.glow ? `0 0 40px ${theme.typeColors[type].glow}` : "none",
  }),
  auroraBg: {
    background: "rgba(255,255,255,0.35)",
    backgroundColor: theme.bgSolid,
    minHeight: "100vh",
  },
  gradientBg: {
    background: "rgba(255,255,255,0.35)",
    backgroundColor: theme.bgSolid,
    minHeight: "100vh",
  },
  fadeIn: {
    animation: "fadeIn 0.5s ease-out",
  },
  slideUp: {
    animation: "slideUp 0.5s ease-out",
  },
};

// Light Glass UIスタイル
const neu = {
  raised: { 
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)", 
    border: "1px solid rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  },
  raisedLg: { boxShadow: "0 8px 30px rgba(0,0,0,0.06)" },
  pressed: { boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.4)" },
  pressedSm: { boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)", background: "rgba(255,255,255,0.4)" },
  flat: { boxShadow: "none" },
  accentRaised: (color) => ({
    boxShadow: `0 4px 20px ${color}18`,
    border: `1.5px solid ${color}`,
  }),
};


// ========================================
// ========================================
// 機材傾向（タイプ別の抽象的ガイダンス）
// ========================================
const GEAR_TENDENCIES = {
  FIX:  { saddle: "ショートノーズ・フラット系", pedal: "高剛性でダイレクト感", shoes: "高剛性ソール", bartape: "薄手でハンドリング重視" },
  FIII: { saddle: "ショートノーズ・やや丸み", pedal: "剛性と回転効率のバランス", shoes: "剛性重視", bartape: "薄手でフィードバック重視" },
  FOX:  { saddle: "幅広め・前乗り対応", pedal: "プラットフォーム広め", shoes: "フィット感重視の高剛性", bartape: "薄手〜中厚" },
  FOII: { saddle: "中〜幅広・クッション適度", pedal: "バランス型", shoes: "快適性と剛性の両立", bartape: "中厚" },
  RIX:  { saddle: "フラット・やや幅広", pedal: "バランス型", shoes: "安定感ある剛性", bartape: "中厚で安定感" },
  RIII: { saddle: "フラット・中幅", pedal: "効率重視", shoes: "剛性と快適性の中間", bartape: "中厚" },
  ROX:  { saddle: "ラウンド形状・幅広め", pedal: "安定性重視", shoes: "快適性寄り", bartape: "厚手でクッション性" },
  ROII: { saddle: "ラウンド・幅広・クッション多め", pedal: "安定性重視", shoes: "快適フィット", bartape: "厚手で振動吸収" },
};

// コンプレッション・フィッティングガイド（タイプ別）
const COMPRESSION_FITTING = {
  FIX: {
    cleat: { position: "母指球よりやや前（1-2mm）", angle: "外にやや開く", qfactor: "狭め〜標準", compression: "外向き制約→内に集める力がペダル荷重に" },
    saddle: { height: "一般基準より-3〜5mm", position: "前乗り（KOPS+5-10mm前）", compression: "低めの制約→脚が伸ばしたい力を使う" },
    handlebar: { drop: "大きめ（深い前傾）", reach: "やや長め", width: "肩幅〜やや狭め", compression: "遠さの制約→体幹が安定" },
    brake: "人差し指・中指の2本がけ",
    grip: "手のひら内側（母指球側）で支える"
  },
  FIII: {
    cleat: { position: "母指球よりやや前（1-2mm）", angle: "外にやや開く", qfactor: "狭め〜標準", compression: "外向き制約→内に集める力がペダル荷重に" },
    saddle: { height: "一般基準より-3〜5mm", position: "前乗り（KOPS+5-10mm前）", compression: "低めの制約→脚が伸ばしたい力を使う" },
    handlebar: { drop: "大きめ（深い前傾）", reach: "やや短め", width: "肩幅〜やや狭め", compression: "短めの制約→押す力が集中" },
    brake: "人差し指・中指の2本がけ",
    grip: "手のひら内側で支える"
  },
  FOX: {
    cleat: { position: "母指球よりやや前（1-2mm）", angle: "内にやや絞る", qfactor: "標準〜やや広め", compression: "内向き制約→外に開く力がペダル荷重に" },
    saddle: { height: "一般基準より-3〜5mm", position: "前乗り（KOPS+5-10mm前）", compression: "低めの制約→脚が伸ばしたい力を使う" },
    handlebar: { drop: "大きめ（深い前傾）", reach: "やや長め", width: "肩幅〜やや広め", compression: "遠さの制約→捻りの空間が生まれる" },
    brake: "中指・薬指がけも自然",
    grip: "手のひら全体〜小指球側で包む"
  },
  FOII: {
    cleat: { position: "母指球よりやや前（1-2mm）", angle: "内にやや絞る", qfactor: "標準〜やや広め", compression: "内向き制約→外に開く力がペダル荷重に" },
    saddle: { height: "一般基準より-3〜5mm", position: "前乗り（KOPS+5-10mm前）", compression: "低めの制約→脚が伸ばしたい力を使う" },
    handlebar: { drop: "大きめ（深い前傾）", reach: "やや短め", width: "肩幅〜やや広め", compression: "短めの制約→直線的な力が集中" },
    brake: "中指・薬指がけも自然",
    grip: "手のひら全体で包む"
  },
  RIX: {
    cleat: { position: "母指球上〜やや後ろ", angle: "外にやや開く", qfactor: "狭め〜標準", compression: "外向き制約→内に集める力がペダル荷重に" },
    saddle: { height: "一般基準より+2〜3mm", position: "後ろ乗り（KOPS基準〜やや後ろ）", compression: "高めの制約→脚が引き込みたい力を使う" },
    handlebar: { drop: "小さめ（比較的アップライト）", reach: "やや長め", width: "肩幅〜やや狭め", compression: "遠さの制約→捻りの空間が生まれる" },
    brake: "人差し指・中指の2本がけ",
    grip: "手のひら内側で支える"
  },
  RIII: {
    cleat: { position: "母指球上〜やや後ろ", angle: "外にやや開く", qfactor: "狭め〜標準", compression: "外向き制約→内に集める力がペダル荷重に" },
    saddle: { height: "一般基準より+2〜3mm", position: "後ろ乗り（KOPS基準〜やや後ろ）", compression: "高めの制約→脚が引き込みたい力を使う" },
    handlebar: { drop: "小さめ（比較的アップライト）", reach: "やや短め", width: "肩幅〜やや狭め", compression: "短めの制約→押す力が集中" },
    brake: "人差し指・中指の2本がけ",
    grip: "手のひら内側で支える"
  },
  ROX: {
    cleat: { position: "母指球上〜やや後ろ", angle: "内にやや絞る", qfactor: "標準〜やや広め", compression: "内向き制約→外に開く力がペダル荷重に" },
    saddle: { height: "一般基準より+2〜3mm", position: "後ろ乗り（KOPS基準〜やや後ろ）", compression: "高めの制約→脚が引き込みたい力を使う" },
    handlebar: { drop: "小さめ（比較的アップライト）", reach: "やや長め", width: "肩幅〜やや広め", compression: "遠さの制約→捻りの空間が生まれる" },
    brake: "中指・薬指がけも自然",
    grip: "手のひら全体〜小指球側で包む"
  },
  ROII: {
    cleat: { position: "母指球上〜やや後ろ", angle: "内にやや絞る", qfactor: "標準〜やや広め", compression: "内向き制約→外に開く力がペダル荷重に" },
    saddle: { height: "一般基準より+2〜3mm", position: "後ろ乗り（KOPS基準〜やや後ろ）", compression: "高めの制約→脚が引き込みたい力を使う" },
    handlebar: { drop: "小さめ（比較的アップライト）", reach: "やや短め", width: "肩幅〜やや広め", compression: "短めの制約→直線的な力が集中" },
    brake: "中指・薬指がけも自然",
    grip: "手のひら全体で包む"
  },
};

// 動作ガイド（タイプ別）
const MOTION_GUIDE = (() => {
  const F = (t) => t.startsWith("F");
  const I = (t) => t.includes("I") && !t.endsWith("II") || t === "FIX" || t === "FIII" || t === "RIX" || t === "RIII";
  const X = (t) => t.endsWith("X") || t === "FIX" || t === "RIX" || t === "FOX" || t === "ROX";
  const gen = (type) => {
    const isF = F(type); const isI = I(type); const isX = X(type);
    return {
      dancing: {
        title: "ダンシング",
        moves: [
          isX ? "踏み込む足と反対の肩が前に出る。バイクは結果として振れる" : "身体とバイクが一体で左右に動く。同側が連動する",
          isF ? "骨盤前傾キープ。起き上がるとロスが大きい" : "比較的アップライトなダンシングが自然",
          isI ? "母指球でペダル軸を捉えて踏む" : "足裏全体〜外側でペダルを広く使う",
          isX ? "ハンドルは軽く引く程度。腕で振り回さない" : "ハンドルを前に押すイメージ",
        ],
        mistake: isX
          ? "「バイクを大きく振れ」→ 捻りで自然に振れるのが正解"
          : "「身体を捻ってダンシングしろ」→ パラレルは直線的に動く方が安定",
      },
      cornering: {
        title: "コーナリング",
        moves: [
          isX ? "上半身がコーナー内側を向く（クロス連動）" : "身体とバイクが一体でリーンする",
          isI ? "外足の母指球に荷重集中" : "外足は足裏全体で面で捉える",
          isF ? "やや前傾気味で攻める" : "やや上体を起こし気味で安定させる",
        ],
        mistake: isX
          ? "「上半身は正面を向いたまま」→ クロス連動を殺してしまう"
          : "「上半身をコーナー内側に向けろ」→ パラレルは一体で傾くのが自然",
      },
      hillclimb: {
        title: "ヒルクライム",
        moves: [
          isF ? "サドル前寄りに座り、骨盤前傾" : "サドル後方に座る。比較的アップライト",
          isI ? "母指球主導。「踏む」より「前に押し出す」" : "足裏全体で広くペダルを踏む",
          isF ? "前傾キープがペダリング効率を維持する" : "引き足も積極的に活用する",
          isX ? "勾配変化でダンシングへ自然に移行" : "一定リズムで安定したペダリングが得意",
        ],
        mistake: isF
          ? "「上体を起こして呼吸を楽に」→ 前体幹は前傾の方がペダリング効率が高い"
          : "「前乗りでパワーを出せ」→ 後体幹は後ろ乗りの方がトルクが出る",
      },
      braking: {
        title: "ブレーキング",
        moves: [
          isI ? "人差し指・中指の2本がけ" : "中指・薬指がけも自然",
          isF ? "腹筋で前方荷重を受け止める（前体幹の強み）" : "背筋で引いて重心を安定させる（後体幹の強み）",
          isI ? "指先のコントロールが得意" : "手のひら全体での操作が安定する",
        ],
        mistake: isF
          ? "「お尻を後ろに引いて重心を下げろ」→ 前体幹は腹筋で支える方が自然"
          : "「前荷重で止まれ」→ 後体幹は引いて支える方が安定する",
      },
      sprint: {
        title: "スプリント",
        moves: [
          isF ? "下ハン曲がり部分〜先端。ハンドルを押さえつける" : "下ハン上部。ハンドルを引き上げる",
          isX ? "踏む足と反対の腕に力。バイクが左右に振れる" : "両腕で均等に力。バイクと一体で揺れる",
          isF ? "前傾を深くして体重をペダルに預ける" : "上体をやや起こして引く力で荷重をかける",
          isI ? "母指球で踏み込む" : "足裏全体でペダルを捉える",
        ],
        mistake: isF
          ? "「ハンドルを引き上げろ」→ 前体幹は押す力の方が連動する"
          : "「ハンドルを押さえつけろ」→ 後体幹は引く力の方がペダルに伝わる",
      },
    };
  };
  const result = {};
  ["FIX","FIII","FOX","FOII","RIX","RIII","ROX","ROII"].forEach(t => { result[t] = gen(t); });
  return result;
})();
const generateShareImage = async (typeInfo, type, spectrum, confidence) => {
  const W = 1200, H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const color = typeInfo.color;
  
  // ── 白背景 ──
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);
  
  // ── 装飾：大きな円形シンボル（右側） ──
  const cx = W - 200, cy = H / 2;
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 260);
  glow.addColorStop(0, color + "18");
  glow.addColorStop(0.5, color + "08");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(cx - 260, cy - 260, 520, 520);
  
  // 同心円
  [200, 150, 100].forEach((r, i) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.06 + i * 0.03;
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
  
  // タイプシンボル（中央の大文字）
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.07;
  ctx.font = "900 180px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(type.charAt(0), cx, cy + 60);
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
  
  // ── 上部アクセントライン ──
  const lineGrad = ctx.createLinearGradient(0, 0, 400, 0);
  lineGrad.addColorStop(0, color);
  lineGrad.addColorStop(1, color + "00");
  ctx.fillStyle = lineGrad;
  ctx.fillRect(0, 0, 400, 3);
  
  // ── STANCE CORE ロゴ ──
  ctx.fillStyle = "#999";
  ctx.font = "700 13px sans-serif";
  ctx.fillText("S T A N C E   C O R E", 60, 48);
  
  // ── タイプ名（大） ──
  ctx.fillStyle = color;
  ctx.font = "900 80px sans-serif";
  ctx.fillText(type, 60, 150);
  
  // タイプ名の横にドット装飾
  const typeW = ctx.measureText(type).width;
  ctx.beginPath();
  ctx.arc(60 + typeW + 20, 130, 6, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  
  // ── サブタイトル ──
  ctx.fillStyle = "#777";
  ctx.font = "500 22px sans-serif";
  ctx.fillText(typeInfo.sub || "", 60, 190);
  
  // ── 3つの特性タグ ──
  const traits = typeInfo.traits || [];
  let tagX = 60;
  ctx.font = "600 14px sans-serif";
  traits.slice(0, 3).forEach(trait => {
    const tw = ctx.measureText(trait).width;
    // タグ背景
    ctx.fillStyle = color + "12";
    ctx.fillRect(tagX, 210, tw + 20, 28);
    // 左ボーダー
    ctx.fillStyle = color;
    ctx.fillRect(tagX, 210, 2, 28);
    // テキスト
    ctx.fillStyle = color;
    ctx.fillText(trait, tagX + 12, 229);
    tagX += tw + 32;
  });
  
  // ── 説明文 ──
  ctx.fillStyle = "#555";
  ctx.font = "400 18px sans-serif";
  const desc = typeInfo.description || "";
  const maxDescW = 640;
  let line = "", descY = 280;
  for (const ch of desc) {
    line += ch;
    if (ctx.measureText(line).width > maxDescW) {
      ctx.fillText(line.slice(0, -1), 60, descY);
      line = ch; descY += 28;
      if (descY > 330) break;
    }
  }
  if (line && descY <= 330) ctx.fillText(line, 60, descY);
  
  // ── スペクトラムバー（左半分） ──
  if (spectrum) {
    const bars = [
      { left: "F", right: "R", value: spectrum.fr, colors: ["#FF6B35", "#06B6D4"], full: ["前体幹", "後体幹"] },
      { left: "I", right: "O", value: spectrum.io, colors: ["#10B981", "#EC4899"], full: ["内側荷重", "外側荷重"] },
      { left: "X", right: "II", value: spectrum.xp, colors: ["#EC4899", "#3B82F6"], full: ["クロス", "パラレル"] },
    ];
    const barStartY = 380;
    const barW = 520;
    const barH = 12;
    
    bars.forEach((bar, i) => {
      const by = barStartY + i * 58;
      
      // ラベル（左）
      const isLeftDominant = bar.value >= 50;
      ctx.font = isLeftDominant ? "800 16px sans-serif" : "400 16px sans-serif";
      ctx.fillStyle = isLeftDominant ? bar.colors[0] : "#bbb";
      ctx.textAlign = "left";
      ctx.fillText(bar.left, 60, by - 6);
      ctx.font = "400 11px sans-serif";
      ctx.fillStyle = "#aaa";
      ctx.fillText(bar.full[0], 60 + ctx.measureText(bar.left + " ").width + 8, by - 6);
      
      // ラベル（右）
      ctx.textAlign = "right";
      ctx.font = !isLeftDominant ? "800 16px sans-serif" : "400 16px sans-serif";
      ctx.fillStyle = !isLeftDominant ? bar.colors[1] : "#bbb";
      ctx.fillText(bar.right, 60 + barW, by - 6);
      
      // バー背景
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(60, by + 2, barW, barH);
      
      // 左バー
      const leftW = barW * bar.value / 100;
      ctx.fillStyle = bar.colors[0];
      ctx.globalAlpha = 0.85;
      ctx.fillRect(60, by + 2, leftW, barH);
      
      // 右バー
      ctx.fillStyle = bar.colors[1];
      ctx.fillRect(60 + leftW, by + 2, barW - leftW, barH);
      ctx.globalAlpha = 1;
      
      // パーセント
      ctx.font = "700 12px sans-serif";
      ctx.textAlign = "left";
      ctx.fillStyle = isLeftDominant ? bar.colors[0] : "#ccc";
      ctx.fillText(bar.value + "%", 60, by + barH + 18);
      ctx.textAlign = "right";
      ctx.fillStyle = !isLeftDominant ? bar.colors[1] : "#ccc";
      ctx.fillText((100 - bar.value) + "%", 60 + barW, by + barH + 18);
      ctx.textAlign = "left";
    });
  }
  
  // ── 下部フッター ──
  ctx.fillStyle = "#e8e8e8";
  ctx.fillRect(60, H - 55, W - 120, 1);
  
  ctx.fillStyle = "#aaa";
  ctx.font = "500 14px sans-serif";
  ctx.fillText("stancecore.com", 60, H - 25);
  
  ctx.textAlign = "right";
  ctx.fillStyle = "#bbb";
  ctx.font = "400 13px sans-serif";
  ctx.fillText("Cyclist Body Type Diagnosis", W - 60, H - 25);
  ctx.textAlign = "left";
  
  return canvas.toDataURL("image/png");
};


// カスタムSVGアイコン（Premium Minimal Style - strokeWidth: 1.5）
const Icons = {
  // STANCE CORE ロゴ（同心円デザイン）
  stanceCore: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="coreGrad">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="20" fill="url(#coreGrad)"/>
      <circle cx="32" cy="32" r="24" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <circle cx="32" cy="32" r="17" fill="none" stroke={color} strokeWidth="1" opacity="0.4"/>
      <circle cx="32" cy="32" r="10" fill="none" stroke={color} strokeWidth="0.75" opacity="0.3"/>
      <circle cx="32" cy="32" r="4" fill={color} opacity="0.9"/>
    </svg>
  ),
  
  // STANCE CORE ロゴ（テキスト付きフル版）
  stanceCoreFull: (color = C.accent, size = 120) => (
    <svg width={size} height={size * 0.8} viewBox="0 0 350 280" fill="none">
      <defs>
        <radialGradient id="coreGradFull">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="175" cy="110" r="60" fill="url(#coreGradFull)"/>
      <circle cx="175" cy="110" r="70" fill="none" stroke={color} strokeWidth="2" opacity="0.6"/>
      <circle cx="175" cy="110" r="85" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <circle cx="175" cy="110" r="100" fill="none" stroke={color} strokeWidth="1" opacity="0.25"/>
      <circle cx="175" cy="110" r="10" fill={color} opacity="0.9"/>
      <text x="175" y="215" fontFamily="Inter, -apple-system, sans-serif" fontSize="28" fontWeight="600" letterSpacing="8" fill={color} textAnchor="middle">STANCE</text>
      <text x="175" y="245" fontFamily="Inter, -apple-system, sans-serif" fontSize="18" fontWeight="400" letterSpacing="6" fill="#666" textAnchor="middle">CORE</text>
    </svg>
  ),
  
  dna: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 15c6.667-6 13.333 0 20-6"/>
      <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/>
      <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/>
      <path d="M17 6l-2.5-2.5"/>
      <path d="M7 18l2.5 2.5"/>
    </svg>
  ),
  target: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  zap: (color = C.orange, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  mountain: (color = C.green, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
    </svg>
  ),
  wave: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    </svg>
  ),
  crosshair: (color = C.pink, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="22" y1="12" x2="18" y2="12"/>
      <line x1="6" y1="12" x2="2" y2="12"/>
      <line x1="12" y1="6" x2="12" y2="2"/>
      <line x1="12" y1="22" x2="12" y2="18"/>
    </svg>
  ),
  foot: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/>
      <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/>
    </svg>
  ),
  rotate: (color = C.cyan, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
    </svg>
  ),
  activity: (color = C.pink, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  user: (color = C.green, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  bike: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18.5" cy="17.5" r="3.5"/>
      <circle cx="5.5" cy="17.5" r="3.5"/>
      <circle cx="15" cy="5" r="1"/>
      <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
    </svg>
  ),
  trophy: (color = C.orange, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  lock: (color = C.textDim, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  check: (color = C.green, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  alertTriangle: (color = C.orange, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  sparkles: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  ),
  frame: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  wheel: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="8"/>
      <line x1="12" y1="16" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="8" y2="12"/>
      <line x1="16" y1="12" x2="22" y2="12"/>
    </svg>
  ),
  arrowRight: (color = C.text, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  refresh: (color = C.textDim, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
      <path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
    </svg>
  ),
  download: (color = C.textDim, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  road: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2l2 18"/><path d="M19 2l-2 18"/><path d="M12 6v4"/><path d="M12 14v4"/>
    </svg>
  ),
  saddle: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="10" rx="9" ry="4"/>
      <path d="M12 14v6"/>
      <path d="M8 20h8"/>
    </svg>
  ),
  shoe: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14h4l3-3 4 1 7 4v2H3z"/>
      <path d="M7 14v4"/>
    </svg>
  ),
  settings: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  book: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  x: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  save: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
    </svg>
  ),
  home: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  star: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  link: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  // ギアファインダー用アイコン
  pedal: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="16" height="8" rx="2"/>
      <line x1="12" y1="8" x2="12" y2="4"/>
      <circle cx="12" cy="3" r="1" fill={color}/>
      <line x1="8" y1="16" x2="8" y2="20"/>
      <line x1="16" y1="16" x2="16" y2="20"/>
    </svg>
  ),
  bartape: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>
      <path d="M4 6v12c0 1.1.9 2 2 2h2"/>
      <path d="M20 6v12c0 1.1-.9 2-2 2h-2"/>
      <line x1="8" y1="10" x2="8" y2="14"/>
      <line x1="12" y1="10" x2="12" y2="14"/>
      <line x1="16" y1="10" x2="16" y2="14"/>
    </svg>
  ),
  crank: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <circle cx="12" cy="12" r="7"/>
      <line x1="12" y1="15" x2="12" y2="22"/>
      <circle cx="12" cy="22" r="2" fill={color}/>
    </svg>
  ),
  powermeter: (color = C.accent, size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
      <circle cx="12" cy="12" r="2" fill={color}/>
    </svg>
  ),
};

// ピクトグラムコンポーネント（ニューモーフィズム対応）
const Pictograms = {
  // 荷重：内側 vs 外側
  balance: {
    front: (selected, color) => (
      <svg width="100" height="120" viewBox="0 0 100 120">
        {/* 地面 */}
        <line x1="10" y1="105" x2="90" y2="105" stroke={selected ? color : C.shadowDark} strokeWidth="2" strokeLinecap="round"/>
        {/* 人（前傾） */}
        <circle cx="52" cy="22" r="10" fill={selected ? color : C.textDim}/> {/* 頭 */}
        <line x1="52" y1="32" x2="48" y2="65" stroke={selected ? color : C.textDim} strokeWidth="6" strokeLinecap="round"/> {/* 胴体 */}
        <line x1="48" y1="65" x2="40" y2="103" stroke={selected ? color : C.textDim} strokeWidth="5" strokeLinecap="round"/> {/* 脚 */}
        <line x1="48" y1="65" x2="56" y2="103" stroke={selected ? color : C.textDim} strokeWidth="5" strokeLinecap="round"/>
        {/* 重心マーク */}
        <circle cx="48" cy="85" r="6" fill={selected ? `${color}40` : "transparent"} stroke={selected ? color : C.textDim} strokeWidth="2"/>
        {/* 矢印（前方向） */}
        <path d="M65 50 L78 50 L75 45 M78 50 L75 55" stroke={selected ? color : C.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    back: (selected, color) => (
      <svg width="100" height="120" viewBox="0 0 100 120">
        {/* 地面 */}
        <line x1="10" y1="105" x2="90" y2="105" stroke={selected ? color : C.shadowDark} strokeWidth="2" strokeLinecap="round"/>
        {/* 人（直立） */}
        <circle cx="50" cy="22" r="10" fill={selected ? color : C.textDim}/> {/* 頭 */}
        <line x1="50" y1="32" x2="50" y2="65" stroke={selected ? color : C.textDim} strokeWidth="6" strokeLinecap="round"/> {/* 胴体 */}
        <line x1="50" y1="65" x2="45" y2="103" stroke={selected ? color : C.textDim} strokeWidth="5" strokeLinecap="round"/> {/* 脚 */}
        <line x1="50" y1="65" x2="55" y2="103" stroke={selected ? color : C.textDim} strokeWidth="5" strokeLinecap="round"/>
        {/* 重心マーク */}
        <circle cx="50" cy="85" r="6" fill={selected ? `${color}40` : "transparent"} stroke={selected ? color : C.textDim} strokeWidth="2"/>
        {/* 矢印（下方向） */}
        <path d="M50 95 L50 112 L45 108 M50 112 L55 108" stroke={selected ? color : C.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  
  // 着地：つま先 vs 踵
  landing: {
    forefoot: (selected, color) => (
      <svg width="100" height="120" viewBox="0 0 100 120">
        {/* 地面 */}
        <line x1="10" y1="100" x2="90" y2="100" stroke={selected ? color : C.shadowDark} strokeWidth="2" strokeLinecap="round"/>
        {/* 足（横から） */}
        <path d="M30 95 Q35 80 50 75 Q70 72 80 78 L85 90 Q80 98 70 98 L30 98 Q25 98 25 95 Z" 
          fill={selected ? `${color}20` : C.bg} stroke={selected ? color : C.textDim} strokeWidth="2"/>
        {/* つま先ハイライト */}
        <circle cx="30" cy="92" r="8" fill={selected ? color : "transparent"} opacity="0.4"/>
        <circle cx="30" cy="92" r="4" fill={selected ? color : C.textDim}/>
        {/* 動きの軌跡 */}
        <path d="M30 70 Q25 80 30 92" stroke={selected ? color : C.textDim} strokeWidth="2" strokeDasharray="4" fill="none" opacity="0.6"/>
      </svg>
    ),
    heel: (selected, color) => (
      <svg width="100" height="120" viewBox="0 0 100 120">
        {/* 地面 */}
        <line x1="10" y1="100" x2="90" y2="100" stroke={selected ? color : C.shadowDark} strokeWidth="2" strokeLinecap="round"/>
        {/* 足（横から） */}
        <path d="M30 90 Q35 80 50 75 Q70 72 80 78 L85 95 Q80 98 70 98 L30 98 Q25 98 25 95 Z" 
          fill={selected ? `${color}20` : C.bg} stroke={selected ? color : C.textDim} strokeWidth="2"/>
        {/* 踵ハイライト */}
        <circle cx="80" cy="92" r="8" fill={selected ? color : "transparent"} opacity="0.4"/>
        <circle cx="80" cy="92" r="4" fill={selected ? color : C.textDim}/>
        {/* 動きの軌跡 */}
        <path d="M80 70 Q85 80 80 92" stroke={selected ? color : C.textDim} strokeWidth="2" strokeDasharray="4" fill="none" opacity="0.6"/>
      </svg>
    ),
  },
  
  // 走り方：ピッチ vs ストライド
  runStyle: {
    highPitch: (selected, color) => (
      <svg width="100" height="120" viewBox="0 0 100 120">
        {/* 地面 */}
        <line x1="5" y1="100" x2="95" y2="100" stroke={selected ? color : C.shadowDark} strokeWidth="2" strokeLinecap="round"/>
        {/* ランナー1 */}
        <g transform="translate(15, 0)">
          <circle cx="12" cy="45" r="6" fill={selected ? color : C.textDim}/>
          <line x1="12" y1="51" x2="12" y2="70" stroke={selected ? color : C.textDim} strokeWidth="4" strokeLinecap="round"/>
          <line x1="12" y1="70" x2="8" y2="98" stroke={selected ? color : C.textDim} strokeWidth="3" strokeLinecap="round"/>
          <line x1="12" y1="70" x2="18" y2="88" stroke={selected ? color : C.textDim} strokeWidth="3" strokeLinecap="round"/>
        </g>
        {/* ランナー2 */}
        <g transform="translate(45, 0)">
          <circle cx="12" cy="45" r="6" fill={selected ? color : C.textDim}/>
          <line x1="12" y1="51" x2="12" y2="70" stroke={selected ? color : C.textDim} strokeWidth="4" strokeLinecap="round"/>
          <line x1="12" y1="70" x2="6" y2="88" stroke={selected ? color : C.textDim} strokeWidth="3" strokeLinecap="round"/>
          <line x1="12" y1="70" x2="16" y2="98" stroke={selected ? color : C.textDim} strokeWidth="3" strokeLinecap="round"/>
        </g>
        {/* ランナー3 */}
        <g transform="translate(75, 0)">
          <circle cx="12" cy="45" r="6" fill={selected ? color : C.textDim}/>
          <line x1="12" y1="51" x2="12" y2="70" stroke={selected ? color : C.textDim} strokeWidth="4" strokeLinecap="round"/>
          <line x1="12" y1="70" x2="10" y2="98" stroke={selected ? color : C.textDim} strokeWidth="3" strokeLinecap="round"/>
          <line x1="12" y1="70" x2="20" y2="85" stroke={selected ? color : C.textDim} strokeWidth="3" strokeLinecap="round"/>
        </g>
        {/* リズムマーク */}
        <g transform="translate(0, 108)">
          {[15, 30, 45, 60, 75, 90].map((x, i) => (
            <circle key={i} cx={x} r="2" fill={selected ? color : C.textDim}/>
          ))}
        </g>
      </svg>
    ),
    longStride: (selected, color) => (
      <svg width="100" height="120" viewBox="0 0 100 120">
        {/* 地面 */}
        <line x1="5" y1="100" x2="95" y2="100" stroke={selected ? color : C.shadowDark} strokeWidth="2" strokeLinecap="round"/>
        {/* ランナー（大きなストライド） */}
        <g transform="translate(30, 0)">
          <circle cx="20" cy="40" r="8" fill={selected ? color : C.textDim}/>
          <line x1="20" y1="48" x2="20" y2="70" stroke={selected ? color : C.textDim} strokeWidth="5" strokeLinecap="round"/>
          <line x1="20" y1="70" x2="5" y2="98" stroke={selected ? color : C.textDim} strokeWidth="4" strokeLinecap="round"/>
          <line x1="20" y1="70" x2="45" y2="85" stroke={selected ? color : C.textDim} strokeWidth="4" strokeLinecap="round"/>
          {/* 腕 */}
          <line x1="20" y1="55" x2="35" y2="45" stroke={selected ? color : C.textDim} strokeWidth="3" strokeLinecap="round"/>
          <line x1="20" y1="55" x2="8" y2="70" stroke={selected ? color : C.textDim} strokeWidth="3" strokeLinecap="round"/>
        </g>
        {/* ストライドの矢印 */}
        <path d="M15 95 L85 95" stroke={selected ? color : C.textDim} strokeWidth="2" strokeDasharray="6" opacity="0.5"/>
        <polygon points="85,95 78,91 78,99" fill={selected ? color : C.textDim}/>
        {/* リズムマーク（少なめ） */}
        <g transform="translate(0, 108)">
          {[25, 50, 75].map((x, i) => (
            <circle key={i} cx={x} r="3" fill={selected ? color : C.textDim}/>
          ))}
        </g>
      </svg>
    ),
  },
  
  // 体幹：折る vs 一体
  trunk: {
    fold: (selected, color) => (
      <svg width="100" height="120" viewBox="0 0 100 120">
        {/* 人（折れ曲がる姿勢） */}
        <circle cx="50" cy="20" r="10" fill={selected ? color : C.textDim}/>
        {/* 上半身（前傾） */}
        <line x1="50" y1="30" x2="45" y2="55" stroke={selected ? color : C.textDim} strokeWidth="6" strokeLinecap="round"/>
        {/* 下半身 */}
        <line x1="45" y1="55" x2="50" y2="85" stroke={selected ? color : C.textDim} strokeWidth="6" strokeLinecap="round"/>
        <line x1="50" y1="85" x2="42" y2="110" stroke={selected ? color : C.textDim} strokeWidth="5" strokeLinecap="round"/>
        <line x1="50" y1="85" x2="58" y2="110" stroke={selected ? color : C.textDim} strokeWidth="5" strokeLinecap="round"/>
        {/* 折れ点マーク */}
        <circle cx="45" cy="55" r="5" fill={selected ? `${color}40` : "transparent"} stroke={selected ? color : C.textDim} strokeWidth="2"/>
        {/* 角度表示 */}
        <path d="M55 45 Q50 55 55 65" stroke={selected ? color : C.textDim} strokeWidth="1.5" fill="none" strokeDasharray="3"/>
      </svg>
    ),
    unified: (selected, color) => (
      <svg width="100" height="120" viewBox="0 0 100 120">
        {/* 人（一体の姿勢） */}
        <circle cx="50" cy="20" r="10" fill={selected ? color : C.textDim}/>
        {/* 上半身〜下半身（一直線） */}
        <line x1="50" y1="30" x2="50" y2="85" stroke={selected ? color : C.textDim} strokeWidth="6" strokeLinecap="round"/>
        <line x1="50" y1="85" x2="42" y2="110" stroke={selected ? color : C.textDim} strokeWidth="5" strokeLinecap="round"/>
        <line x1="50" y1="85" x2="58" y2="110" stroke={selected ? color : C.textDim} strokeWidth="5" strokeLinecap="round"/>
        {/* 一体マーク */}
        <line x1="60" y1="30" x2="60" y2="85" stroke={selected ? color : C.textDim} strokeWidth="2" strokeDasharray="4" opacity="0.6"/>
        <circle cx="60" cy="57" r="4" fill={selected ? color : "transparent"} stroke={selected ? color : C.textDim} strokeWidth="1.5"/>
      </svg>
    ),
  },
  
  // スポーツアイコン
  sports: {
    running: (selected, color) => (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="30" cy="10" r="5" fill={selected ? color : C.textDim}/>
        <path d="M25 15 L22 28 L12 35" stroke={selected ? color : C.textDim} strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M22 28 L32 38 L38 42" stroke={selected ? color : C.textDim} strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M25 15 L35 20" stroke={selected ? color : C.textDim} strokeWidth="3" strokeLinecap="round"/>
        <path d="M25 15 L18 8" stroke={selected ? color : C.textDim} strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    cycling: (selected, color) => (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="12" cy="32" r="8" fill="none" stroke={selected ? color : C.textDim} strokeWidth="2.5"/>
        <circle cx="36" cy="32" r="8" fill="none" stroke={selected ? color : C.textDim} strokeWidth="2.5"/>
        <path d="M12 32 L24 20 L36 32" stroke={selected ? color : C.textDim} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M24 20 L28 10" stroke={selected ? color : C.textDim} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="30" cy="8" r="4" fill={selected ? color : C.textDim}/>
      </svg>
    ),
    trail: (selected, color) => (
      <svg width="48" height="48" viewBox="0 0 48 48">
        {/* 山 */}
        <path d="M5 40 L20 15 L28 28 L35 20 L45 40 Z" fill={selected ? `${color}20` : `${C.textDim}15`} stroke={selected ? color : C.textDim} strokeWidth="2"/>
        {/* ランナー */}
        <circle cx="22" cy="25" r="3" fill={selected ? color : C.textDim}/>
        <path d="M20 28 L18 35 L14 38" stroke={selected ? color : C.textDim} strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M20 28 L24 34 L28 36" stroke={selected ? color : C.textDim} strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
};

// 後方互換のためのエイリアス
const Illustrations = {
  footPressure: {
    front: Pictograms.landing.forefoot,
    back: Pictograms.landing.heel,
  },
  standingSide: {
    forward: Pictograms.balance.front,
    back: Pictograms.balance.back,
  },
  carryBag: {
    close: Pictograms.trunk.fold,
    far: Pictograms.trunk.unified,
  },
};

// レーダーチャートコンポーネント
const RadarChart = ({ data, size = 200, color = C.accent }) => {
  const margin = 35; // ラベル用のマージン
  const chartSize = size - margin * 2;
  const center = size / 2;
  const radius = chartSize * 0.38;
  const labels = ["瞬発力", "持久力", "効率性", "適応力", "安定性"];
  const angles = labels.map((_, i) => (Math.PI * 2 * i) / labels.length - Math.PI / 2);
  
  // データポイントを計算
  const points = data.map((value, i) => {
    const r = radius * (value / 100);
    const x = center + r * Math.cos(angles[i]);
    const y = center + r * Math.sin(angles[i]);
    return { x, y };
  });
  
  // ポリゴンのパス
  const polygonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  
  // グリッド線
  const gridLevels = [20, 40, 60, 80, 100];
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      {/* 背景グリッド */}
      {gridLevels.map((level, i) => {
        const r = radius * (level / 100);
        const gridPoints = angles.map(angle => ({
          x: center + r * Math.cos(angle),
          y: center + r * Math.sin(angle)
        }));
        const path = gridPoints.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={i} d={path} fill="none" stroke={C.shadowDark} strokeWidth="1" opacity={0.3}/>;
      })}
      
      {/* 軸線 */}
      {angles.map((angle, i) => (
        <line 
          key={i}
          x1={center} 
          y1={center} 
          x2={center + radius * Math.cos(angle)} 
          y2={center + radius * Math.sin(angle)}
          stroke={C.shadowDark}
          strokeWidth="1"
          opacity={0.3}
        />
      ))}
      
      {/* データエリア */}
      <path 
        d={polygonPath} 
        fill={`${color}25`}
        stroke={color}
        strokeWidth="2.5"
      />
      
      {/* データポイント */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={color}/>
      ))}
      
      {/* ラベル */}
      {labels.map((label, i) => {
        const labelRadius = radius + 20;
        const x = center + labelRadius * Math.cos(angles[i]);
        const y = center + labelRadius * Math.sin(angles[i]);
        return (
          <text 
            key={i}
            x={x} 
            y={y} 
            textAnchor="middle" 
            dominantBaseline="middle"
            fill={C.text}
            fontSize="12"
            fontWeight="600"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

// テクニックガイド（8タイプ別）
const TECHNIQUE_GUIDE = {
  FIX: {
    riding: {
      flat: {
        style: "高回転で軽快に巡航。ケイデンス90rpm前後を維持",
        body: "みぞおちから前傾し、体幹で上半身を支える。腕はリラックス",
        tip: "風が強いときはフォームを小さく。対角連動を意識して左右交互にリズムを作る"
      },
      climbing: {
        sitting: { label: "前乗りで母指球荷重。腰の回旋を使ったペダリング", ng: "腰が固定されて脚だけで踏んでいる。太もも前側がすぐ売り切れる", ok: "踏み込むたびにおへそが左右に小さく回る。脚全体で踏めている", check: "片手をおへそに当てて登る。手が動いていればOK" },
        dancing: "積極的に使う。バイクを左右に振って対角に力を伝える",
        cadence: "85-95rpm。軽いギアで回して登る",
        gradient: {
          easy: { range: "3〜5%", tip: "ケイデンスを落とさず軽快にこなす" },
          mid: { range: "6〜9%", tip: "ダンシングを混ぜてリズムを作る" },
          steep: { range: "10%〜", tip: "ダンシング多めで短く踏む。長いと辛い" }
        }
      },
      descending: {
        position: "下ハン持ちで重心を低く。前乗り気味で荷重をかける",
        braking: "早めにブレーキを終えてコーナーに入る。ブレーキしながら曲がらない",
        tip: "対角連動が活きる場面。体をひねって進行方向を向く"
      },
      cornering: {
        entry: "ブレーキングは早めに終える。内側荷重の準備",
        mid: "内側の肩を落として体をひねる（クロス連動）。バイクを倒し込む",
        exit: "踏み込みで加速。体の回旋を使ってスムーズに立ち上がる"
      }
    },
    acceleration: {
      start: "腰のひねりを起点に対角線で力を伝える",
      gear: "やや軽めで回転を上げて加速",
      upper: { label: "対角連動で上半身を使う", ng: "両手で同時にハンドルを握りしめている。肩が上がっている", ok: "右足で踏むとき左手でブラケットを引く。対角線の力を感じる", check: "加速時に引いてる手と踏んでる脚が左右逆（対角）になっていればOK" },
      image: { label: "全身連動の加速", ng: "太もも前側だけで押している。4時以降に力が抜ける", ok: "踏み込みの瞬間、みぞおちが締まり→腰が回り→ペダルに体重が落ちる。3つが連動する", check: "加速時に腹筋に軽い張りを感じる＝全身連動。太ももだけの疲労なら脚単独" }
    },
    race: {
      crit: "コーナー立ち上がりの加速力で勝負。アタックは短く鋭く",
      enduro: "集団内で脚を溜め、勝負所でアタック。一定ペースより緩急で勝負",
      hillclimb: "変化をつけて攻める。ダンシングで揺さぶりをかける。後半型"
    },
    weakness: {
      problem: "長い一定ペースの登りが苦手",
      solutions: ["ペースの波を作る。少し上げて少し落とすを繰り返す", "勾配変化を利用してリズムを作る"]
    }
  },
  FIII: {
    riding: {
      flat: {
        style: "一定ペースの巡航が最大の武器。TTのように淡々と踏む",
        body: "骨盤を固定して上半身は一枚板。股関節だけが動く",
        tip: "パワーメーターがあるとペース管理しやすい。無駄なく走れるタイプ"
      },
      climbing: {
        sitting: { label: "前乗りで母指球荷重。骨盤固定でスムーズに", ng: "腰が左右に揺れてサドルの上でお尻が動く。効率が悪い", ok: "骨盤がサドルに固定され、股関節だけが動いている。上半身は一枚板", check: "後ろから撮影。肩のラインが水平のまま動かなければOK" },
        dancing: "控えめ。必要なときだけ短く使う",
        cadence: "80-90rpm。効率重視の回転数",
        gradient: {
          easy: { range: "3〜5%", tip: "最も得意。TTのように淡々と踏む" },
          mid: { range: "6〜9%", tip: "ペースを落とさず耐える。効率で勝負" },
          steep: { range: "10%〜", tip: "無理せずギアを落として回転キープ" }
        }
      },
      descending: {
        position: "フォームをコンパクトに。安定重視",
        braking: "スムーズにスピードをコントロール。急ブレーキは避ける",
        tip: "下りでも無駄な動きを減らす。省エネがこのタイプの強み"
      },
      cornering: {
        entry: "スピードをコントロールして安定して入る",
        mid: "バイクと体を一体で傾ける。無駄な動きを減らす",
        exit: "シッティングのまま徐々に加速。急がない"
      }
    },
    acceleration: {
      start: "脚の上下動を意識。体幹は固定",
      gear: "重すぎず軽すぎず。効率の良いギアを探す",
      upper: "安定させる。ブレない軸",
      image: { label: "途切れない円運動", ng: "ペダルを踏む感覚が強い。2時〜4時しか力がかからない", ok: "ペダルを12時→6時まで途切れなく押し続ける感覚。円を描いている", check: "片足ペダリングでカクカクしない＝OK。途中で力が抜ける箇所があればNG" }
    },
    race: {
      crit: "集団内で効率よく走り、消耗戦に持ち込む。スプリントは苦手",
      enduro: "序盤から安定ペースで刻む。後半の失速が少ない",
      hillclimb: "一定ペースで刻む。アタックには乗らず自分のペースを守る"
    },
    weakness: {
      problem: "急なアタックや勾配変化への対応",
      solutions: ["変化を予測して事前にギアとペースを調整", "ダンシングの練習を定期的に入れる"]
    }
  },
  FOX: {
    riding: {
      flat: {
        style: "トルクで巡航。やや重めのギアでグイグイ踏む",
        body: "足裏全体〜外側で踏む。膝はやや外向き。大腿四頭筋全体を使う",
        tip: "向かい風で強い。パワーを出し続けられる"
      },
      climbing: {
        sitting: { label: "前乗りで外側荷重。足裏全体でペダルを押す", ng: "母指球（内側）でだけ踏んで、パワーが出ない。膝が内に入る", ok: "足裏全体〜外側で踏み、膝がやや外を向く。大腿四頭筋全体で押せている", check: "ペダリング中に膝の軌道を確認。つま先〜やや外側を向いていればOK" },
        dancing: "ガンガン使う。バイクを大きく振ってパワーを出す",
        cadence: "75-85rpm。トルク重視",
        gradient: {
          easy: { range: "3〜5%", tip: "スピードで押し切る。踏み倒す" },
          mid: { range: "6〜9%", tip: "ダンシングを多用してパワーで勝負" },
          steep: { range: "10%〜", tip: "最も得意な勾配。パワーの見せ所" }
        }
      },
      descending: {
        position: "下ハンで攻める。体重を外脚に乗せて安定させる",
        braking: "遅めのブレーキでスピードを保つ",
        tip: "下りでもパワーをかけられる。ペダリングしながら下る"
      },
      cornering: {
        entry: "アウトから入って減速を最小限に",
        mid: "内側の肩を落として捻る。外側の脚でバイクを押さえる",
        exit: "ダンシングで爆発的に加速"
      }
    },
    acceleration: {
      start: "腰のひねりを使い、対角線に体重を乗せる",
      gear: "重めでトルクをガツンとかける",
      upper: "ハンドルを強く引いて反対脚に力を伝える",
      image: { label: "腰連動のトルク加速", ng: "脚を真下に踏み込むだけ。3時の位置でしか力がかからない", ok: "腰のねじり→踏み込みが連動して、体重ごとペダルに乗る。2時〜5時まで力が続く", check: "重めのギアで加速。腹斜筋（脇腹）に張りを感じれば全身連動OK" }
    },
    race: {
      crit: "コーナー立ち上がりの爆発力が武器。逃げに乗るのが得意",
      enduro: "後半勝負。序盤は集団に潜んで脚を溜め、ラストで仕掛ける",
      hillclimb: "急勾配で勝負。ダンシングでパワーを叩き込む"
    },
    weakness: {
      problem: "集団内での位置取り、一定ペースの維持",
      solutions: ["単独で逃げる展開を作る", "パワーメーターでペース管理を覚える"]
    }
  },
  FOII: {
    riding: {
      flat: {
        style: "マイペースで淡々と。安定したペース維持が得意",
        body: "サドル座面全体にお尻を乗せ、骨盤安定。じわじわ力をかけ続ける",
        tip: "ロングライドで真価を発揮。100km超えても失速しにくい"
      },
      climbing: {
        sitting: { label: "前乗り〜中央で外側荷重。座面全体を使う", ng: "サドルの一点にお尻が集中して痛い。安定しない", ok: "サドルの座面全体にお尻が乗り、骨盤が安定。じわじわと力をかけ続けられる", check: "5分以上同じペースで登れる＝OK。お尻が痛くなるならサドル位置を見直す" },
        dancing: "控えめ。長い登りはシッティング中心",
        cadence: "75-85rpm。やや低めで安定",
        gradient: {
          easy: { range: "3〜5%", tip: "淡々と効率よく消化" },
          mid: { range: "6〜9%", tip: "得意ゾーン。粘り強く登る" },
          steep: { range: "10%〜", tip: "ペース落としても粘る。垂れない強さ" }
        }
      },
      descending: {
        position: "安定重視。無理にスピードを出さない",
        braking: "十分な余裕を持ってブレーキ",
        tip: "下りは安全第一。登りの粘りで稼いだ貯金を守る"
      },
      cornering: {
        entry: "十分に減速して安全に",
        mid: "バイクと一体で傾く。急な動きは避ける",
        exit: "シッティングで徐々に加速"
      }
    },
    acceleration: {
      start: "脚全体で踏み込む。足裏全体で",
      gear: "重めでゆっくりトルクをかける",
      upper: "ブラケットをしっかり握って安定",
      image: { label: "途切れない圧力", ng: "ペダルを踏み込む感覚が強く、力のON/OFFが激しい", ok: "体重をじわじわとペダルにかけ続ける。途切れない圧力", check: "ケイデンスを変えずにギアを1枚重くする。同じ感覚で回せればOK" }
    },
    race: {
      crit: "消耗戦に持ち込む。スプリントは避けて早めに仕掛ける",
      enduro: "最初からマイペース。後半に周りが垂れてきたら勝負",
      hillclimb: "自分のリズムを崩さない。序盤から淡々とペースを刻む"
    },
    weakness: {
      problem: "スプリント、急加速",
      solutions: ["勝負所を見極めて早めに仕掛ける", "ダンシングでのパワー練習を追加"]
    }
  },
  RIX: {
    riding: {
      flat: {
        style: "リズミカルに巡航。強弱をつけて楽しむ",
        body: "胸を開いて肩甲骨を寄せる。呼吸が楽なポジション",
        tip: "音楽のリズムに合わせるイメージ。単調にならないのがコツ"
      },
      climbing: {
        sitting: { label: "後ろ乗りで内側荷重。胸を開いてペダリング", ng: "サドル後方で背中が丸まり、呼吸が浅い。肩が上がっている", ok: "サドル中央〜やや後ろで、肩甲骨が軽く寄っている。胸が開いて呼吸が楽", check: "深呼吸してみる。胸が楽に膨らめばポジションOK" },
        dancing: "適度に使う。リズムを変えるアクセントとして",
        cadence: "80-90rpm。リズミカルに",
        gradient: {
          easy: { range: "3〜5%", tip: "リズムよくこなす" },
          mid: { range: "6〜9%", tip: "得意ゾーン。変化に対応しながら登る" },
          steep: { range: "10%〜", tip: "ダンシングとシッティングを切り替えながら" }
        }
      },
      descending: {
        position: "リラックスして体の力を抜く。視線を遠くに",
        braking: "リズムよくブレーキ。握りっぱなしにしない",
        tip: "下りでも上半身のリズムを意識。体がほぐれた状態がベスト"
      },
      cornering: {
        entry: "リズムを保ちながらスムーズに",
        mid: "体をひねって内側に重心移動",
        exit: "ダンシングでリズムよく加速"
      }
    },
    acceleration: {
      start: "腰のひねりを使うが、大げさにならない",
      gear: "状況に応じて柔軟に",
      upper: "リズムに合わせて自然に動く",
      image: { label: "リズムのあるペダリング", ng: "一定のリズムで踏み続けようとして、脚が重い。単調", ok: "踏み込みに強弱のリズムがあり、タン・タタンのようにアクセントが入る", check: "音楽のリズムに合わせてペダリングしてみる。自然に合わせられればOK" }
    },
    race: {
      crit: "リズムの変化に強い。コーナーごとの加減速を楽しめる",
      enduro: "自分でリズムを作りながら走る。単調にならないよう工夫",
      hillclimb: "変化のあるコースが得意。ダンシングを混ぜてリズムで登る"
    },
    weakness: {
      problem: "単調な平坦区間、TTポジション",
      solutions: ["自分でリズムを作る工夫（ペダリングにアクセント）", "変化のあるコースを選ぶ"]
    }
  },
  RIII: {
    riding: {
      flat: {
        style: "メトロノームのように一定ペース。効率の鬼",
        body: "肩甲骨を軽く寄せて上半身を安定。脚だけが動くイメージ",
        tip: "ロングライドの後半で真価発揮。ペースが落ちにくい"
      },
      climbing: {
        sitting: { label: "後ろ乗りで内側荷重。肩甲骨で安定を作る", ng: "体幹を固めようとして肩首に力が入る。息が苦しい", ok: "肩甲骨を軽く寄せるだけで上半身が安定。脚の動きに影響されない", check: "走行中に肩をストンと落とす。上半身の安定が変わらなければOK" },
        dancing: "ほぼ使わない。使っても短く",
        cadence: "85-95rpm。高め安定",
        gradient: {
          easy: { range: "3〜5%", tip: "最も得意。効率で圧倒" },
          mid: { range: "6〜9%", tip: "ペースを落としすぎず耐える" },
          steep: { range: "10%〜", tip: "軽いギアで回転キープ。粘り勝負" }
        }
      },
      descending: {
        position: "コンパクトなフォームで空気抵抗を減らす",
        braking: "スムーズで一定。急操作は苦手なので余裕を持って",
        tip: "下りは無理しない。登りで稼いだアドバンテージを守る走り"
      },
      cornering: {
        entry: "スピードを保ちながらスムーズに",
        mid: "バイクと一体で傾く。最小限の動き",
        exit: "シッティングのまま滑らかに加速"
      }
    },
    acceleration: {
      start: "脚の回転を意識。上下動の効率",
      gear: "軽めで回転数を維持",
      upper: "固定。ブレない",
      image: { label: "360度均一なペダリング", ng: "2時〜4時だけ力を入れて、残りは惰性。カクカクする", ok: "360度どこでも同じ力加減。ペダルが勝手に回り続ける感覚", check: "片足ペダリング30秒。引っかかりなく回ればOK" }
    },
    race: {
      crit: "集団内で効率よく走る。消耗戦に持ち込む",
      enduro: "超一定ペース。メトロノームのように刻んで後半勝負",
      hillclimb: "一定ペースで刻み続ける。アタックには乗らず自分を信じる"
    },
    weakness: {
      problem: "ダンシング、急な地形変化",
      solutions: ["勾配変化を事前に把握してギアを準備", "週1でダンシング練習を入れる"]
    }
  },
  ROX: {
    riding: {
      flat: {
        style: "状況を読んで臨機応変に。どんなペースにも対応できる",
        body: "後ろ乗りで安定しつつ、状況変化に合わせて体を動かす",
        tip: "グループライドのペースメーカーに向いている。周りをよく見て走る"
      },
      climbing: {
        sitting: { label: "後ろ乗りで外側荷重。変化に対応するペダリング", ng: "腰が固まってしまい、コースの変化についていけない", ok: "サドル後方で安定しつつ、勾配変化に合わせて腰が自然と動く", check: "勾配が変わる箇所で自然にギア＆ポジションを変えられていればOK" },
        dancing: "必要に応じて使う。バランス良く",
        cadence: "75-85rpm。状況に応じて調整",
        gradient: {
          easy: { range: "3〜5%", tip: "どんなペースにも対応" },
          mid: { range: "6〜9%", tip: "バランスよくこなす" },
          steep: { range: "10%〜", tip: "粘り強く対応。状況判断で乗り切る" }
        }
      },
      descending: {
        position: "状況を見ながら柔軟に。体のひねりで微調整",
        braking: "状況判断で最適なタイミングを選ぶ",
        tip: "テクニカルな下りが得意。判断力が活きる"
      },
      cornering: {
        entry: "状況判断で最適なラインを選ぶ",
        mid: "体をひねりながらも安定感を保つ",
        exit: "状況に応じてダンシングかシッティングか判断"
      }
    },
    acceleration: {
      start: "腰のひねりを使いつつ安定感も保つ",
      gear: "その場で最適なギアを選ぶ判断力",
      upper: "状況に応じて柔軟に",
      image: { label: "状況適応の加速", ng: "1つのパターンに固定されて、変化に対応できない", ok: "勾配・風・ペースに応じてダンシング/シッティング/ギアを無意識に切り替えている", check: "走行後に振り返っていろいろ変えたなと思えればOK。ずっと同じだったらNG" }
    },
    race: {
      crit: "状況判断で立ち回る。逃げにも集団にも対応できるオールラウンダー",
      enduro: "バランスよくこなす。弱点が少ないのが最大の強み",
      hillclimb: "コース全体を読んでペース配分。変化に柔軟に対応"
    },
    weakness: {
      problem: "突出した武器がない（でもこれが強み）",
      solutions: ["オールラウンダーとして立ち回る", "どんな状況でも80点を出せる安定感を磨く"]
    }
  },
  ROII: {
    riding: {
      flat: {
        style: "重いギアでじっくり巡航。体重を乗せて安定したペースで",
        body: "坐骨でサドルにしっかり座る。上半身はリラックス",
        tip: "追い風や緩い下りで真価発揮。体重を活かしてスピードに乗る"
      },
      climbing: {
        sitting: { label: "後ろ乗りで外側荷重。坐骨でサドルに安定", ng: "サドル前方に座って力が入らない。又はサドル後方すぎて腕が伸びきっている", ok: "坐骨がサドル後方にしっかり乗り、体重がペダルに自然に伝わる。上半身はリラックス", check: "手放しで5秒座れる安定感があればOK" },
        dancing: "ほぼ使わない。座って踏む",
        cadence: "70-80rpm。低めトルク型",
        gradient: {
          easy: { range: "3〜5%", tip: "マイペースで消化" },
          mid: { range: "6〜9%", tip: "粘り強く。垂れない" },
          steep: { range: "10%〜", tip: "ペース落としても最後まで踏める" }
        }
      },
      descending: {
        position: "どっしり座って重心を安定。無理にスピードは出さない",
        braking: "十分な余裕を持って。安全第一",
        tip: "体重がある分、下りのスピードは自然に出る。ブレーキコントロールが大事"
      },
      cornering: {
        entry: "十分に減速して安全第一",
        mid: "バイクと一体で傾く。急な動きは避ける",
        exit: "シッティングで徐々に加速"
      }
    },
    acceleration: {
      start: "足裏全体でじわっと踏む",
      gear: "重めでトルクをかける",
      upper: "どっしり構える",
      image: { label: "体重を乗せる加速", ng: "ペダルを踏みつける感覚。膝に衝撃がくる", ok: "体重をゆっくりペダルに乗せていく。衝撃なく、じわーっと重さが伝わる", check: "膝に衝撃を感じない＝OK。ガツンと踏んでいたらNG" }
    },
    race: {
      crit: "消耗戦で後半勝負。スプリントは避けて早めにじわじわ上げる",
      enduro: "超マイペース。周りに惑わされず淡々と。後半に強い",
      hillclimb: "自分のペースを守る。前半は省エネ、後半に力を残す"
    },
    weakness: {
      problem: "瞬発力、急なペース変化への対応",
      solutions: ["変化を予測して早めに準備", "後半勝負に持ち込む。前半は省エネ"]
    }
  }
};

// セルフチェック（タイプ別確認テスト）
const SELF_CHECK = {
  FIX: {
    checks: [
      { name: "対角連動チェック", how: "その場で軽くジョギングの動き。右脚を上げたとき、左腕が自然に前に出る？", good: "対角線で連動 → クロス型OK", bad: "腕が動かない → パラレル寄り" },
      { name: "ダンシングチェック", how: "ダンシングで30秒。バイクを左右に振ってみて", good: "振った方が踏みやすい → OK", bad: "振らない方が安定 → パラレル寄り" },
      { name: "みぞおちチェック", how: "ペダリング中、力の起点はどこ？", good: "みぞおち〜股関節 → Fタイプ OK", bad: "背中・肩甲骨 → Rタイプ寄り" },
    ]
  },
  FIII: {
    checks: [
      { name: "体幹固定チェック", how: "シッティングで1分、上半身を動かさずペダリング", good: "楽に回せる → パラレル型OK", bad: "窮屈 → クロス寄り" },
      { name: "高回転チェック", how: "100rpm以上で30秒回してみて", good: "お尻が跳ねない → 効率型OK", bad: "すぐバタつく → 踏み込み派" },
      { name: "みぞおちチェック", how: "力の起点はどこ？", good: "みぞおち〜お腹 → Fタイプ OK", bad: "背中・腰 → Rタイプ寄り" },
    ]
  },
  FOX: {
    checks: [
      { name: "パワーダンシング", how: "坂でダンシング30秒全力。バイクを大きく振って", good: "パワーが出る → FOX型OK", bad: "シッティングの方が楽 → 別タイプ" },
      { name: "外側荷重チェック", how: "ペダリング中、足裏のどこで踏んでる？", good: "小指側も使う → 外側荷重OK", bad: "親指の付け根だけ → 内側荷重" },
      { name: "トルク型チェック", how: "重めギアで70rpm、しっくりくる？", good: "踏み応えが好き → トルク型OK", bad: "軽くして回したい → 高回転型" },
    ]
  },
  FOII: {
    checks: [
      { name: "安定シッティング", how: "長い登りを一定ペースで5分以上シッティング", good: "淡々と踏める → FOII型OK", bad: "ダンシング入れたい → クロス寄り" },
      { name: "外側荷重チェック", how: "立った状態で足裏を確認。体重は？", good: "足裏全体〜外側 → 外側荷重OK", bad: "親指側に集中 → 内側荷重" },
      { name: "マイペースチェック", how: "集団のペース変化に惑わされる？", good: "自分のペース守れる → OK", bad: "つい反応する → 別タイプ" },
    ]
  },
  RIX: {
    checks: [
      { name: "リズムチェック", how: "ペダリングのリズム変化を楽しめる？", good: "変化が気持ちいい → RIX型OK", bad: "一定の方が楽 → パラレル寄り" },
      { name: "内側荷重チェック", how: "ペダリング中、膝の軌道は？", good: "まっすぐ〜やや内側 → 内側荷重OK", bad: "外に開く → 外側荷重" },
      { name: "後体幹チェック", how: "力を入れるとき、意識が向くのは？", good: "背中・肩甲骨・腰 → Rタイプ OK", bad: "お腹・みぞおち → Fタイプ寄り" },
    ]
  },
  RIII: {
    checks: [
      { name: "超安定チェック", how: "平地を一定ペースで10分。上半身は完全固定", good: "楽、自然にできる → RIII型OK", bad: "窮屈、動かしたい → 別タイプ" },
      { name: "高回転チェック", how: "90-100rpmで長時間回せる？", good: "むしろ得意 → 効率型OK", bad: "すぐ疲れる → トルク型" },
      { name: "集団走行チェック", how: "ドラフティングで省エネ走行、得意？", good: "集団の中が落ち着く → OK", bad: "前に出たい → 別タイプ" },
    ]
  },
  ROX: {
    checks: [
      { name: "適応力チェック", how: "コースの変化への対応は？", good: "自然に合わせられる → ROX型OK", bad: "自分のスタイル貫きたい → 別タイプ" },
      { name: "ひねりチェック", how: "コーナーで体をひねる動き、自然？", good: "できる → クロス型OK", bad: "一体で傾く方が楽 → パラレル寄り" },
      { name: "オールラウンドチェック", how: "登り/平地/下り、どれも80点出せる？", good: "特に苦手がない → ROX型OK", bad: "得意不得意がはっきり → 別タイプ" },
    ]
  },
  ROII: {
    checks: [
      { name: "どっしりチェック", how: "サドルにしっかり座って後ろ乗り", good: "安定する → ROII型OK", bad: "前に座りたい → 別タイプ" },
      { name: "低回転チェック", how: "70-80rpmでゆっくり踏む", good: "トルクかけやすい → OK", bad: "軽くして回したい → 別タイプ" },
      { name: "ロングライドチェック", how: "100km以上の後半、まだ踏める？", good: "垂れない → ROII型OK", bad: "後半キツい → 別タイプ" },
    ]
  },
};

// 体感ワード変換表（タイプ別解説付き）
const BODY_FEEL_DICT = [
  { vague: "骨盤を立てる",
    general: "坐骨をサドルに感じるように座る",
    byType: {
      F: { fit: "△", advice: "Fタイプはこの指示に従いすぎると逆効果。みぞおちから自然に前傾すると骨盤は適度に寝る。無理に立てると股関節の動きが制限される" },
      R: { fit: "◎", advice: "Rタイプにはぴったりの指示。肩甲骨を軽く寄せると骨盤が自然に立つ。坐骨の2点でサドルに座る感覚を大事に" },
    },
    check: "座面の後ろ半分にお尻が乗ってる？",
    ng: "お尻がサドルの前にズレて股間が圧迫される",
  },
  { vague: "骨盤を寝かせる",
    general: "サドルの前側に荷重し、股関節が使いやすい角度にする",
    byType: {
      F: { fit: "◎", advice: "Fタイプの自然な姿勢。みぞおちから折りたたむように前傾すれば、骨盤は勝手に最適な角度になる" },
      R: { fit: "△", advice: "Rタイプが無理に寝かせると腰を痛めやすい。肩甲骨主導で前傾をコントロールして" },
    },
    check: "みぞおちから前傾できてる？腰から曲げてない？",
    ng: "腰を丸めて無理に前傾している。腰痛の原因",
  },
  { vague: "体幹を使う",
    general: "お腹に力を入れた状態でペダルを踏む",
    byType: {
      F: { fit: "◎", advice: "Fタイプはみぞおち〜股関節が体幹の起点。おへそ周りの締まりを意識するとペダリングが安定する" },
      R: { fit: "◎", advice: "Rタイプは肩甲骨〜背中が体幹の起点。肩甲骨を軽く寄せるだけで上半身が安定する。お腹を固めすぎない" },
    },
    check: "咳をするときに力が入る場所を意識できる？",
    ng: "手脚だけで漕いでいて、お腹に力が入っていない",
  },
  { vague: "腰を入れる",
    general: "骨盤を安定させてペダリングの土台を作る",
    byType: {
      F: { fit: "○", advice: "Fタイプは「おへそを前に突き出す」イメージが近い。腰の回旋を使ってペダリングするので、固めすぎない" },
      R: { fit: "○", advice: "Rタイプは「坐骨でサドルに根を張る」イメージ。腰を前に押すより、お尻をサドルに安定させる意識" },
    },
    check: "ペダリング中に腰が安定してる？",
    ng: "腰が丸まって後ろに引けている。猫背になっている",
  },
  { vague: "肩の力を抜く",
    general: "上半身をリラックスさせて効率よく走る",
    byType: {
      F: { fit: "◎", advice: "Fタイプは肩を落として、肘を軽く曲げる。上半身の力は体幹（みぞおち）で支えて腕はリラックス" },
      R: { fit: "◎", advice: "Rタイプは肩甲骨を軽く寄せてからストンと落とす。背中で支える感覚ができると肩が自然に下がる" },
    },
    check: "ハンドルを握りしめてない？指に隙間ある？",
    ng: "肩が耳に近づいている。首が短く見える",
  },
  { vague: "引き足を使う",
    general: "上死点〜引き上げ局面でも力を加える",
    byType: {
      F: { fit: "○", advice: "Fタイプは「引く」より「みぞおちで脚を持ち上げる」意識が効く。股関節の屈曲を使う" },
      R: { fit: "△", advice: "Rタイプは引き足より「踏み込みの質」に集中したほうが効率的。無理に引くとフォームが崩れやすい" },
    },
    check: "上死点で靴の中で足の甲がシューズに当たる？",
    ng: "下死点でペダルを踏み切って終わり。6時以降は惰性",
  },
  { vague: "踏む",
    general: "ペダルに体重を乗せて推進力を生む基本動作",
    byType: {
      I: { fit: "◎", advice: "内側荷重(I)は母指球で真下に踏む。膝がまっすぐ前を向いた状態で、2時〜4時の区間に集中" },
      O: { fit: "◎", advice: "外側荷重(O)は足裏全体〜外側で踏む。膝がやや外を向くのが自然。大腿四頭筋全体を使う感覚" },
    },
    check: "3時の位置で体重がペダルに乗ってる？",
    ng: "つま先だけで押している。ふくらはぎが先に疲れる",
  },
  { vague: "回す",
    general: "ペダルを円運動として途切れなく動かす",
    byType: {
      X: { fit: "◎", advice: "クロス(X)タイプは対角連動を使って「回す」のが自然。腰のひねりがペダリングのリズムを作る" },
      II: { fit: "◎", advice: "パラレル(II)タイプは上下動の効率で「回す」。体幹を固定して脚だけを綺麗に回す意識が合う" },
    },
    check: "足首がクニャクニャ動いてない？",
    ng: "足首を上下に動かしてギクシャクしている",
  },
  { vague: "ハンドルを引く",
    general: "上半身の力をペダリングに伝える動作",
    byType: {
      X: { fit: "◎", advice: "クロス(X)タイプは「右足で踏むとき左手で引く」対角線の動き。自然にやっているはず" },
      II: { fit: "△", advice: "パラレル(II)タイプはハンドルを引くより「体幹で安定させる」方が効率的。引きすぎるとフォームが崩れる" },
    },
    check: "肘を脇腹に近づける動き？肘が外に開いてない？",
    ng: "手首で手前に引いている。手首が痛い",
  },
  { vague: "前乗り",
    general: "サドルの前方に座るポジション",
    byType: {
      F: { fit: "◎", advice: "Fタイプの基本ポジション。みぞおし主導の前傾と合わせると股関節が使いやすくなる" },
      R: { fit: "△", advice: "Rタイプには不向きなことが多い。無理に前乗りすると肩甲骨の安定が崩れ、手に荷重がかかりすぎる" },
    },
    check: "サドルの先端から5cm以内に座ってる？",
    ng: "サドルの後ろに座って腕が伸びきっている",
  },
  { vague: "後ろ乗り",
    general: "サドルの後方に座るポジション",
    byType: {
      F: { fit: "△", advice: "Fタイプが後ろ乗りすると股関節の可動域が制限される。ただし僅差でR寄りなら試す価値あり" },
      R: { fit: "◎", advice: "Rタイプの基本ポジション。坐骨でどっしり座り、肩甲骨で上半身を安定させる" },
    },
    check: "坐骨がサドルの後方に乗ってる？",
    ng: "サドルの前に座ってハンドルが近すぎる",
  },
  { vague: "ケイデンスを上げる",
    general: "ペダルの回転数を増やして軽快に走る",
    byType: {
      F: { fit: "○", advice: "Fタイプは高回転と相性がいいことが多い。特にF-Iタイプは90rpm+が得意ゾーン" },
      R: { fit: "○", advice: "R-IIタイプは高回転が得意。R-Oタイプは無理に上げず、自分のリズムで" },
    },
    check: "お尻がサドルから浮いてない？",
    ng: "お尻がバウンドしている。体幹が使えてないサイン",
  },
  { vague: "トルクをかける",
    general: "重めのギアで力強く踏み込む",
    byType: {
      I: { fit: "○", advice: "内側荷重(I)は母指球でダイレクトにトルクをかける。膝をまっすぐ保つことが大事" },
      O: { fit: "◎", advice: "外側荷重(O)の得意技。足裏全体で体重を乗せるようにトルクをかけると膝への負担が少ない" },
    },
    check: "ペダルを踏んだとき重みを感じる？",
    ng: "ギアが軽すぎて空回り。脚は速いが進まない",
  },
];

// 質問プール
// 軸1: AかBか（体幹タイプ） - A=みぞおち・股関節主導 / B=首・肩甲骨・腰主導
// 軸2: Inner/Outer（荷重タイプ） - I=内側荷重 / O=外側荷重
// APA: ケイデンス（高回転/トルク）、姿勢（胸開き/前傾）
// type: "text"（テキスト2択）, "action"（体験型）, "quad"（4択）
const QUESTION_POOL = [
  // === 基本質問（体幹タイプ） ===
  { id: "carry_bag_basic", cat: "trunk", type: "text",
    q: "重い荷物を持つとき、楽なのは？", 
    a: "体に近づけて抱えるように持つ", 
    b: "腕を伸ばして体から離して持つ",
    weight: { typeA: [1, 0], typeB: [0, 1] } },
  
  // === 体験型質問 ===
  { id: "action_push", cat: "trunk", type: "action",
    q: "壁を両手で押してみて",
    instruction: "グッと力を入れるとき、意識が向くのはどこ？",
    a: "お腹・みぞおちに力が入る", b: "背中・肩甲骨に力が入る",
    weight: { typeA: [1, 0], typeB: [0, 1] } },

  // === AかBか（体幹タイプ）===
  // A/B選択肢の順序をバランスよく混ぜる
  { id: "lift_heavy", cat: "trunk", q: "重いものを持ち上げるとき、力を入れるのは？", a: "お腹〜みぞおちあたり", b: "背中〜腰あたり", weight: { typeA: [1, 0], typeB: [0, 1] } },
  { id: "power_source", cat: "trunk", q: "グッと踏ん張るとき、意識が向くのは？", a: "背中・肩甲骨まわり", b: "お腹・丹田あたり", weight: { typeA: [0, 1], typeB: [1, 0] } },
  { id: "carry_bag", cat: "trunk", q: "重いカバンを持つとき楽なのは？", a: "体に近づけて持つ", b: "腕を伸ばして持つ", weight: { typeA: [1, 0], typeB: [0, 1] } },
  { id: "stand_stable", cat: "trunk", q: "安定して立つとき意識するのは？", a: "腰と肩のライン", b: "みぞおちと股関節", weight: { typeA: [0, 1], typeB: [1, 0] } },
  { id: "push_wall", cat: "trunk", q: "壁を思いっきり押すとき、力の起点は？", a: "お腹から押す感じ", b: "背中で押す感じ", weight: { typeA: [1, 0], typeB: [0, 1] } },
  { id: "body_twist", cat: "trunk", q: "体をねじるとき、動きの起点は？", a: "腰・肩甲骨から", b: "みぞおち・股関節から", weight: { typeA: [0, 1], typeB: [1, 0] } },
  { id: "sit_relax", cat: "trunk", q: "椅子でリラックスするとき", a: "骨盤を立てて、みぞおちの力を抜く", b: "背もたれに寄りかかり、腰を預ける", weight: { typeA: [1, 0], typeB: [0, 1] } },
  { id: "arm_swing", cat: "trunk", q: "歩くときの腕振りは？", a: "肩甲骨から大きく振る", b: "自然に小さく振る程度", weight: { typeA: [0, 1], typeB: [1, 0] } },
  { id: "jump_prep", cat: "trunk", q: "ジャンプするとき、力を溜めるのは？", a: "お腹にグッと力を入れる", b: "背中・腰をバネのように使う", weight: { typeA: [1, 0], typeB: [0, 1] } },
  { id: "catch_ball", cat: "trunk", q: "飛んできたボールをキャッチするとき", a: "体に引き寄せるように", b: "手を伸ばして前で取る", weight: { typeA: [1, 0], typeB: [0, 1] } },
  // 追加：体幹タイプ質問
  { id: "swing_bat", cat: "trunk", q: "バットやラケットを振るとき、意識は？", a: "腰の回転から", b: "みぞおちのひねりから", weight: { typeA: [0, 1], typeB: [1, 0] } },
  { id: "throw_power", cat: "trunk", q: "ボールを遠くに投げるとき、力の源は？", a: "肩甲骨〜背中", b: "みぞおち〜股関節", weight: { typeA: [0, 1], typeB: [1, 0] } },
  { id: "push_car", cat: "trunk", q: "重いものを押すとき、体のどこを使う感じ？", a: "体幹の前側で押す", b: "背中側で押し込む", weight: { typeA: [1, 0], typeB: [0, 1] } },
  { id: "pull_rope", cat: "trunk", q: "綱引きで引っ張るとき、力を入れるのは？", a: "腰を落として背中で引く", b: "お腹に力を入れて引く", weight: { typeA: [0, 1], typeB: [1, 0] } },
  { id: "dance_move", cat: "trunk", q: "ダンスや体を動かすとき、動きの起点は？", a: "みぞおち・胸のあたり", b: "腰・肩甲骨のあたり", weight: { typeA: [1, 0], typeB: [0, 1] } },
  { id: "sneeze", cat: "trunk", q: "くしゃみをするとき、体は？", a: "背中が丸まる感じ", b: "お腹がギュッと縮む", weight: { typeA: [0, 1], typeB: [1, 0] } },
  { id: "laugh_hard", cat: "trunk", q: "大笑いするとき、力が入るのは？", a: "背中を反らす感じ", b: "お腹を抱える感じ", weight: { typeA: [0, 1], typeB: [1, 0] } },
  { id: "yawn", cat: "trunk", q: "あくびをするとき、伸びるのは？", a: "背中〜肩甲骨", b: "お腹〜胸", weight: { typeA: [0, 1], typeB: [1, 0] } },
  { id: "cough", cat: "trunk", q: "咳をするとき、力が入るのは？", a: "背中が丸まる", b: "お腹が収縮する", weight: { typeA: [0, 1], typeB: [1, 0] } },
  { id: "stretch_morning", cat: "trunk", q: "朝の伸びで気持ちいいのは？", a: "両手を上げて背中を伸ばす", b: "体を丸めてから伸ばす", weight: { typeA: [0, 1], typeB: [1, 0] } },
  
  // === Inner/Outer（荷重タイプ）===
  // num1 = Inner（内側荷重）, num2 = Outer（外側荷重）
  { id: "shoe_wear", cat: "balance", q: "靴底の減り、気になるのは？", a: "内側（親指側）が減る", b: "外側（小指側）が減る", weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "knee_direction", cat: "balance", q: "スクワットすると膝は？", a: "外に開きやすい", b: "内側に入りやすい", weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "one_leg_balance", cat: "balance", q: "片足立ちで踏ん張る場所は？", a: "親指の付け根あたり", b: "小指側〜外側", weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "sit_legs", cat: "balance", q: "電車で座ると、膝は自然と…", a: "開く", b: "閉じる", weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "stand_feet", cat: "balance", q: "リラックスして立つと、つま先は？", a: "まっすぐ〜やや内向き", b: "やや外向き（ガニ股気味）", weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "walk_width", cat: "balance", q: "歩くとき、左右の足の幅は？", a: "広め", b: "狭め（一直線に近い）", weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "pedal_push", cat: "balance", q: "ペダルを踏む感覚は？", a: "親指の付け根で踏む", b: "足裏全体で踏む", weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "leg_cross", cat: "balance", q: "脚を組むとき、しっくりくるのは？", a: "ゆったり外に開く", b: "ギュッと内側に締める", weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "squat_knee", cat: "balance", q: "深くしゃがむと、膝は？", a: "つま先より内側に入る", b: "つま先と同じか外に開く", weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "ankle_injury", cat: "balance", q: "足首を捻るとしたら、どっち？", a: "内側にグキッ（よくある捻挫）", b: "外側にグキッ", weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "heel_wear", cat: "balance", q: "靴の踵、減りやすいのは？", a: "外側", b: "内側", weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "toe_power", cat: "balance", q: "地面を蹴るとき、力が入るのは？", a: "親指側", b: "小指側も使う", weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "calf_shape", cat: "balance", q: "ふくらはぎ、張ってるのは？", a: "外側", b: "内側", weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "thigh_shape", cat: "balance", q: "太もも、発達してるのは？", a: "内もも", b: "外もも", weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "arch_height", cat: "balance", q: "土踏まずの高さは？", a: "高め（アーチがある）", b: "低め（偏平足気味）", weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "stand_weight", cat: "balance", q: "長時間立つと、体重がかかるのは？", a: "足の内側", b: "足の外側", weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "jump_land", cat: "balance", q: "ジャンプして着地、最初に着くのは？", a: "足の外側（小指側）", b: "足の内側（親指側）", weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "turn_pivot", cat: "balance", q: "くるっと振り向くとき、軸足は？", a: "内側に体重をかける", b: "外側に体重をかける", weight: { num1: [1, 0], num2: [0, 1] } },
  
  // === 客観的事実（ブレにくい） ===
  { id: "leg_shape", cat: "balance", q: "脚の形、近いのは？", a: "O脚気味（膝が外に開く）", b: "X脚気味（膝が内に入る）", weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "shoe_width", cat: "balance", q: "靴選びで困るのは？", a: "幅が狭くて入らない", b: "幅が広くてブカブカ", weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "pants_fit", cat: "balance", q: "パンツ・ズボンで気になるのは？", a: "太もも外側がキツい", b: "太もも内側が余る", weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "flat_foot", cat: "balance", q: "偏平足って言われたことある？", a: "ある / 土踏まず低め", b: "ない / アーチしっかり", weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "knock_knee", cat: "balance", q: "立ったとき、膝同士は？", a: "くっつく", b: "離れてる", weight: { num1: [1, 0], num2: [0, 1] } },
  
  // === 体験型（今すぐ確認） ===
  { id: "action_stand_now", cat: "balance", type: "action",
    q: "今、立ってみて",
    instruction: "足元を見て。つま先はどっち向いてる？",
    a: "内向き or まっすぐ", b: "外向き（ハの字）",
    weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "action_squat_now", cat: "balance", type: "action",
    q: "その場でスクワット！",
    instruction: "しゃがんだとき、膝はどう動く？",
    a: "内側に入る", b: "外に開く",
    weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "action_one_leg", cat: "balance", type: "action",
    q: "片足で10秒立ってみて",
    instruction: "グラついたら、どっちに倒れそうになった？",
    a: "内側（親指側）に倒れそう", b: "外側（小指側）に倒れそう",
    weight: { num1: [0, 1], num2: [1, 0] } },
  { id: "action_tiptoe", cat: "balance", type: "action",
    q: "つま先立ちしてみて",
    instruction: "体重がかかってるのは？",
    a: "親指の付け根", b: "小指側も使ってる",
    weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "action_heel_stand", cat: "balance", type: "action",
    q: "かかと立ちしてみて",
    instruction: "バランス取りやすいのは？",
    a: "かかとの内側に体重", b: "かかとの外側に体重",
    weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "action_walk_line", cat: "balance", type: "action",
    q: "まっすぐ線の上を歩くイメージで",
    instruction: "自然に歩くと、足は線に対して？",
    a: "線の上 or 内側に着地", b: "線の外側に着地しがち",
    weight: { num1: [1, 0], num2: [0, 1] } },
  
  // === サイクリング特化 ===
  { id: "pedal_knee", cat: "balance", q: "ペダリング中、膝の動きは？", a: "内に入りやすい", b: "外に逃げやすい", weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "cleat_position", cat: "balance", q: "クリート位置、しっくりくるのは？（未経験ならイメージで）", a: "内寄り / 狭いスタンス", b: "外寄り / 広いスタンス", weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "qfactor_pref", cat: "balance", q: "ペダルの幅（Qファクター）、好みは？", a: "狭め（脚がまっすぐ）", b: "広め（自然に開く）", weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "pedal_pace", cat: "cadence", q: "ペダリングで楽なのは？", a: "ケイデンスを上げて軽く回す", b: "重いギアでゆっくり踏む", weight: { high: [1, 0], low: [0, 1] } },
  { id: "walk_pace", cat: "cadence", q: "歩くペースは？", a: "大股でゆったり", b: "小股で速く", weight: { high: [0, 1], low: [1, 0] } },
  { id: "ride_style", cat: "cadence", q: "ペダリングのイメージ", a: "高回転で軽快に", b: "重めギアで力強く", weight: { high: [1, 0], low: [0, 1] } },
  { id: "stair_up", cat: "cadence", q: "階段を登るとき", a: "二段飛ばしもあり", b: "一段ずつテンポよく", weight: { high: [0, 1], low: [1, 0] } },
  { id: "music_tempo", cat: "cadence", q: "運動するときの音楽は？", a: "BPM高めが好き", b: "ゆったりめでも集中できる", weight: { high: [1, 0], low: [0, 1] } },
  // 追加：テンポ質問
  { id: "typing_speed", cat: "cadence", q: "タイピングするとき", a: "速く細かく打つ", b: "ゆっくり確実に打つ", weight: { high: [1, 0], low: [0, 1] } },
  { id: "chew_speed", cat: "cadence", q: "食事で噛むペースは？", a: "速めにテンポよく", b: "ゆっくりじっくり", weight: { high: [1, 0], low: [0, 1] } },
  { id: "talk_speed", cat: "cadence", q: "話すスピードは？", a: "早口気味", b: "ゆっくり落ち着いて", weight: { high: [1, 0], low: [0, 1] } },
  { id: "blink_rate", cat: "cadence", q: "瞬きの頻度は？（自覚あれば）", a: "多い方かも", b: "少ない方かも", weight: { high: [1, 0], low: [0, 1] } },
  { id: "heart_feel", cat: "cadence", q: "運動中の心拍、楽なのは？", a: "高めをキープ", b: "低めで長く", weight: { high: [1, 0], low: [0, 1] } },
  { id: "drum_tap", cat: "cadence", q: "指でリズムを取るとき", a: "速いテンポが心地いい", b: "ゆったりが心地いい", weight: { high: [1, 0], low: [0, 1] } },
  { id: "jump_rope", cat: "cadence", q: "縄跳びするなら", a: "速く軽く跳ぶ", b: "ゆっくり高く跳ぶ", weight: { high: [1, 0], low: [0, 1] } },
  { id: "swim_stroke", cat: "cadence", q: "泳ぐとき（イメージでOK）", a: "速いストロークで回転", b: "大きなストロークでゆったり", weight: { high: [1, 0], low: [0, 1] } },
  
  // === APA: 姿勢傾向 ===
  { id: "desk_posture", cat: "posture", q: "デスクワーク中の姿勢", a: "前のめりになりがち", b: "背もたれに寄りかかる", weight: { open: [0, 1], forward: [1, 0] } },
  { id: "breath_feel", cat: "posture", q: "深呼吸するとき楽なのは", a: "胸を開いて吸う", b: "お腹を膨らませて吸う", weight: { open: [1, 0], forward: [0, 1] } },
  { id: "sleep_position", cat: "posture", q: "寝るとき楽な姿勢", a: "横向き・うつ伏せが多い", b: "仰向けが多い", weight: { open: [0, 1], forward: [1, 0] } },
  { id: "shoulder_relax", cat: "posture", q: "肩の力を抜くと", a: "後ろに引く感じ", b: "前に落ちる感じ", weight: { open: [1, 0], forward: [0, 1] } },
  // 追加：姿勢質問
  { id: "phone_look", cat: "posture", q: "スマホを見るとき", a: "顔を近づける", b: "スマホを顔の高さに上げる", weight: { open: [0, 1], forward: [1, 0] } },
  { id: "tv_watch", cat: "posture", q: "テレビを見るとき", a: "前のめりで見入る", b: "背もたれにもたれて見る", weight: { open: [0, 1], forward: [1, 0] } },
  { id: "read_book", cat: "posture", q: "本を読むとき", a: "本に顔を近づける", b: "本を顔の前に持ってくる", weight: { open: [0, 1], forward: [1, 0] } },
  { id: "drive_posture", cat: "posture", q: "運転するとき（イメージでOK）", a: "ハンドルに近づく", b: "シートにもたれる", weight: { open: [0, 1], forward: [1, 0] } },
  { id: "photo_pose", cat: "posture", q: "写真を撮られるとき", a: "胸を張る", b: "自然体で猫背気味", weight: { open: [1, 0], forward: [0, 1] } },
  { id: "meeting_sit", cat: "posture", q: "会議や授業で座るとき", a: "背筋を伸ばす", b: "リラックスして座る", weight: { open: [1, 0], forward: [0, 1] } },
  { id: "concentrate", cat: "posture", q: "集中するとき、体は？", a: "前のめりになる", b: "姿勢を正す", weight: { open: [0, 1], forward: [1, 0] } },
  
  // === メンタルAPA: 攻撃性（アグレッシブ vs ステディ）===
  { id: "janken", cat: "mental_agg", q: "じゃんけんで最初に出しがちなのは？", a: "グー", b: "パー", weight: { aggressive: [1, 0], steady: [0, 1] } },
  { id: "game_style", cat: "mental_agg", q: "ゲームや勝負ごとで好きなのは？", a: "コツコツ積み上げ", b: "一発逆転", weight: { aggressive: [0, 1], steady: [1, 0] } },
  { id: "lost_road", cat: "mental_agg", q: "知らない道で迷ったら？", a: "直感で進む", b: "一旦戻って確認", weight: { aggressive: [1, 0], steady: [0, 1] } },
  { id: "task_start", cat: "mental_agg", q: "仕事やタスクの進め方は？", a: "計画してから始める", b: "まずやってみる", weight: { aggressive: [0, 1], steady: [1, 0] } },
  { id: "risk_take", cat: "mental_agg", q: "チャンスがあったとき", a: "リスク覚悟で飛び込む", b: "確実なときまで待つ", weight: { aggressive: [1, 0], steady: [0, 1] } },
  { id: "deadline", cat: "mental_agg", q: "締め切りがあるとき", a: "ギリギリに集中して仕上げる", b: "余裕をもって早めに終わらせる", weight: { aggressive: [1, 0], steady: [0, 1] } },
  // 追加：攻撃性質問
  { id: "first_move", cat: "mental_agg", q: "勝負事で先手を取る？", a: "先に仕掛ける", b: "相手の出方を見る", weight: { aggressive: [1, 0], steady: [0, 1] } },
  { id: "new_restaurant", cat: "mental_agg", q: "新しいレストランで", a: "冒険メニューを頼む", b: "定番を選ぶ", weight: { aggressive: [1, 0], steady: [0, 1] } },
  { id: "conversation", cat: "mental_agg", q: "会話では", a: "自分から話しかける", b: "話しかけられるのを待つ", weight: { aggressive: [1, 0], steady: [0, 1] } },
  { id: "queue_cut", cat: "mental_agg", q: "行列で割り込まれたら", a: "すぐ注意する", b: "我慢するか様子見", weight: { aggressive: [1, 0], steady: [0, 1] } },
  { id: "opinion_share", cat: "mental_agg", q: "意見を求められたとき", a: "すぐ言う", b: "考えてから言う", weight: { aggressive: [1, 0], steady: [0, 1] } },
  { id: "deal_nego", cat: "mental_agg", q: "値段交渉は", a: "積極的にする", b: "あまりしない", weight: { aggressive: [1, 0], steady: [0, 1] } },
  { id: "volunteer", cat: "mental_agg", q: "誰かやる人？と聞かれたら", a: "手を挙げる", b: "様子を見る", weight: { aggressive: [1, 0], steady: [0, 1] } },
  { id: "challenge_accept", cat: "mental_agg", q: "難しい挑戦を振られたら", a: "とりあえずやる", b: "できるか考える", weight: { aggressive: [1, 0], steady: [0, 1] } },
  
  // === メンタルAPA: 集団性（ソロ vs チーム）===
  { id: "travel_style", cat: "mental_team", q: "旅行するなら？", a: "一人旅", b: "グループで", weight: { solo: [1, 0], team: [0, 1] } },
  { id: "sports_watch", cat: "mental_team", q: "スポーツで注目するのは？", a: "個人の活躍・エース", b: "チーム戦術・連携", weight: { solo: [1, 0], team: [0, 1] } },
  { id: "work_focus", cat: "mental_team", q: "作業に集中できるのは？", a: "誰かと一緒のとき", b: "一人のとき", weight: { solo: [0, 1], team: [1, 0] } },
  { id: "achieve_joy", cat: "mental_team", q: "達成感を感じるのは？", a: "チームで成し遂げたとき", b: "自分の力で成し遂げたとき", weight: { solo: [0, 1], team: [1, 0] } },
  { id: "problem_solve", cat: "mental_team", q: "問題にぶつかったとき", a: "まず自分で考える", b: "すぐ誰かに相談する", weight: { solo: [1, 0], team: [0, 1] } },
  // 追加：集団性質問
  { id: "lunch_style", cat: "mental_team", q: "ランチは？", a: "一人でサクッと", b: "誰かと一緒に", weight: { solo: [1, 0], team: [0, 1] } },
  { id: "movie_watch", cat: "mental_team", q: "映画を見るなら", a: "一人で没頭", b: "誰かと感想を言い合う", weight: { solo: [1, 0], team: [0, 1] } },
  { id: "study_style", cat: "mental_team", q: "勉強・学習するとき", a: "一人で集中", b: "誰かと教え合う", weight: { solo: [1, 0], team: [0, 1] } },
  { id: "karaoke", cat: "mental_team", q: "カラオケは？", a: "ヒトカラもあり", b: "大勢で盛り上がる", weight: { solo: [1, 0], team: [0, 1] } },
  { id: "game_prefer", cat: "mental_team", q: "ゲームするなら", a: "ソロプレイ", b: "マルチプレイ", weight: { solo: [1, 0], team: [0, 1] } },
  { id: "hobby_share", cat: "mental_team", q: "趣味は", a: "一人で楽しむ派", b: "仲間と楽しむ派", weight: { solo: [1, 0], team: [0, 1] } },
  { id: "decision_make", cat: "mental_team", q: "大事な決断は", a: "自分で決める", b: "誰かに相談してから", weight: { solo: [1, 0], team: [0, 1] } },
  { id: "celebration", cat: "mental_team", q: "うれしいことがあったら", a: "一人で噛みしめる", b: "誰かに報告したい", weight: { solo: [1, 0], team: [0, 1] } },
  
  // === 追加体験型質問 ===
  { id: "action_squat", cat: "balance", type: "action",
    q: "軽くスクワットしてみて",
    instruction: "しゃがんだとき、体重はどこにかかってる？",
    a: "つま先〜母指球", b: "踵〜足裏全体",
    weight: { num1: [1, 0], num2: [0, 1] } },
  { id: "action_reach", cat: "trunk", type: "action",
    q: "両手を上に伸ばしてみて",
    instruction: "伸びるとき、意識が向くのは？",
    a: "みぞおちが伸びる感じ", b: "背中が伸びる感じ",
    weight: { typeA: [1, 0], typeB: [0, 1] } },
  { id: "action_twist", cat: "trunk", type: "action",
    q: "上半身を左右にひねってみて",
    instruction: "ひねりの起点はどこ？",
    a: "みぞおち・お腹", b: "腰・背中",
    weight: { typeA: [1, 0], typeB: [0, 1] } },
  { id: "action_balance", cat: "balance", type: "action",
    q: "片足で立ってみて",
    instruction: "バランスを取るとき、体重は？",
    a: "つま先側でバランス", b: "足裏全体でバランス",
    weight: { num1: [1, 0], num2: [0, 1] } },
    
  // === クロス/パラレル判定（連動パターン） ===
  // クロス = 対角線の連動（右手-左足）、腰をひねって力を伝える
  // パラレル = 同側の連動、体幹を固定して安定
  
  // --- 日常動作 ---
  { id: "cross_walk", cat: "movement", q: "歩くとき、腕の振りは？", 
    a: "脚と反対の腕が大きく出る（右足と左腕）", b: "腕はあまり振らない / 意識しない", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "cross_throw", cat: "movement", q: "ボールを投げるとき、体の使い方は？", 
    a: "腰をひねって、対角線に体重移動", b: "腕中心で投げる、体幹は安定", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "cross_kick", cat: "movement", q: "ボールを蹴るとき、自然なのは？", 
    a: "蹴る脚と反対の腕を大きく振る", b: "両腕でバランスを取る程度", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "cross_punch", cat: "movement", q: "パンチを打つイメージは？", 
    a: "腰を回転させて対角線に体重を乗せる", b: "肩から腕を押し出す感じ", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "cross_twist", cat: "movement", q: "体をひねる動きは？", 
    a: "得意、自然にできる", b: "あまり得意じゃない、硬い感じ", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "cross_turn", cat: "movement", q: "後ろを振り向くとき、どう動く？", 
    a: "腰からひねって振り向く", b: "体全体を回す or 首だけで振り向く", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "cross_reach", cat: "movement", q: "右側のものを取るとき、自然なのは？", 
    a: "右手を伸ばしながら左足に体重を乗せる", b: "右手と右足側に体重を乗せる", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "cross_run", cat: "movement", q: "歩いたり走ったりするとき、腕と脚の連動は？", 
    a: "対角線（右脚と左腕）が自然に連動", b: "あまり意識しない、腕は添える程度", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  
  // --- スポーツ動作 ---
  { id: "cross_swing", cat: "movement", q: "ゴルフや野球のスイングをイメージすると？", 
    a: "腰の回転が先で、腕がついてくる", b: "腕と体が一緒に動く感じ", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "parallel_swim", cat: "movement", q: "泳ぎで得意（または得意そう）なのは？", 
    a: "クロール（左右交互の動き）", b: "平泳ぎ・バタフライ（左右対称）", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "parallel_squat", cat: "movement", q: "スクワットするとき、自然なのは？", 
    a: "まっすぐ上下に動く", b: "少し体をひねりながら", 
    weight: { cross: [0, 1], parallel: [1, 0] } },
  { id: "parallel_jump", cat: "movement", q: "その場でジャンプするとき、腕は？", 
    a: "両腕一緒に振り上げる", b: "左右バラバラに動くこともある", 
    weight: { cross: [0, 1], parallel: [1, 0] } },
  { id: "cross_dance", cat: "movement", q: "踊るとき、得意な動きは？", 
    a: "ツイスト、ひねりを使った動き", b: "ステップ、左右対称の動き", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "parallel_climb", cat: "movement", q: "はしごを登るイメージで近いのは？", 
    a: "手と足が対角線で交互に動く", b: "同じ側の手足が一緒に動きやすい", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  
  // --- サイクリング特化 ---
  { id: "cross_bike_stand", cat: "movement", q: "自転車でダンシングするとき、近いのは？", 
    a: "バイクを左右に振りながら体をひねる", b: "バイクをあまり振らず体幹で踏む", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "cross_pedal", cat: "movement", q: "ペダリングの感覚で近いのは？", 
    a: "腰のひねりを使って回す感じ", b: "上下にまっすぐ踏み込む感じ", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "parallel_cornering", cat: "movement", q: "コーナリングで自然なのは？", 
    a: "内側の肩を落として体をひねる", b: "バイクと一体になって傾く", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "cross_sprint", cat: "movement", q: "スプリントで全力を出すとき？", 
    a: "腕を引くと反対の脚に力が入る感じ", b: "両脚で交互に踏み下ろす感じ", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
  { id: "parallel_climb_bike", cat: "movement", q: "ヒルクライムでシッティングのとき？", 
    a: "微妙に体をひねりながらペダリング", b: "体幹を固定してまっすぐ踏む", 
    weight: { cross: [1, 0], parallel: [0, 1] } },
];

// 精度レベル
const ACCURACY_LEVELS = [
  { min: 0, label: "未診断", stars: 0, color: C.textDim },
  { min: 5, label: "おおまか", stars: 1, color: C.textMuted },
  { min: 10, label: "ある程度", stars: 2, color: C.orange },
  { min: 15, label: "かなり正確", stars: 3, color: C.green },
  { min: 18, label: "高精度", stars: 4, color: C.accent },
  { min: 20, label: "完全解析", stars: 5, color: C.pink },
];

// タイプ定義（サイクリング用）
// ============================================
// 8タイプ構成（3軸独立）:
//   体幹: F (Front/前) / R (Rear/後)
//   荷重: I (Inner/内) / O (Outer/外)
//   連動: X (Cross/クロス) / II (Parallel/パラレル)
// 
// 内部キー → 表示名:
//   FIX  = F-I-X   前体幹 × 内側荷重 × クロス
//   FIII = F-I-II  前体幹 × 内側荷重 × パラレル
//   FOX  = F-O-X   前体幹 × 外側荷重 × クロス
//   FOII = F-O-II  前体幹 × 外側荷重 × パラレル
//   RIX  = R-I-X   後体幹 × 内側荷重 × クロス
//   RIII = R-I-II  後体幹 × 内側荷重 × パラレル
//   ROX  = R-O-X   後体幹 × 外側荷重 × クロス
//   ROII = R-O-II  後体幹 × 外側荷重 × パラレル
// ============================================
const TYPE_INFO_CYCLING = {
  FIX: {
    name: "F-I-X",
    sub: "前体幹 × 内側 × クロス",
    icon: "zap",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #ea580c)",
    traits: ["捻りながら内側で踏む", "みぞおち主導で対角連動", "ダンシングでバイクを振る"],
    description: "身体を捻じりながら内側で踏み込むタイプ。瞬発力とキレのある加速が武器。",
    strengths: ["スプリント", "アタック", "ダンシング"],
    weaknesses: ["長時間の一定ペース"],
    radarData: [95, 50, 60, 55, 50],
    bodyMechanics: {
      trunk: { type: "Fタイプ（前体幹）", description: "みぞおち・股関節主導", detail: "みぞおちと股関節の2点を支点にして、上半身と下半身が別々に動く。",
        ng: "背中全体が一枚板のように固まって、脚だけで漕いでいる",
        ok: "みぞおちの下で身体が「折れ目」になっていて、脚が軽く動く",
        check: "ブラケットを持ったまま片手をみぞおちに当てる。踏み込みで腹筋の収縮を感じればOK" },
      movement: { 
        type: "クロス（対角連動）", 
        description: "捻じりの動きが自然", 
        detail: "右腕と左脚、左腕と右脚が連動する。",
        感覚: [
          { ng: "腰が固まって左右対称のまま。太もも前側だけが疲れる", ok: "右を踏むとき、おへそがわずかに右を向く。左右交互に小さく回る", check: "軽いギアで片手をおへそに当てて10回ペダリング。手が左右に動けばOK" },
          { ng: "ダンシング中にバイクを真っ直ぐ保とうとして、肩と腕に力が入る", ok: "右足を踏むときバイクが左に傾き、左手のブラケットを引いている", check: "ダンシング10回。ハンドルを引く手と踏む脚が対角（右足＝左手）ならOK" },
          { ng: "コーナーで身体全体をバイクと一緒に倒している。怖い", ok: "左コーナーなら左肩が下がり、右腰が外に出る。上半身と下半身が逆にねじれる", check: "低速で緩いカーブを走る。内側の肘が曲がって脇腹に近づいていればOK" }
        ],
        荷重バランス: {
          ペダル: { label: "母指球中心、内側で踏む", ng: "小指側やかかとに体重が逃げる。足の外側がシューズに当たる", ok: "親指の付け根（母指球）にペダル軸の圧を感じる", check: "クリート位置を確認。ペダル軸が母指球の真下に来ていればOK" },
          ハンドル: { label: "下ハンで引きつける", ng: "手のひら全体でブラケットを握りしめている。手首が痛い", ok: "指を引っかけるように持ち、肘を曲げて脇腹方向に引く力がある", check: "ブラケットから小指を離せる＝握りしめてない。肘が外に開いてなければOK" },
          サドル: { label: "前寄りに座る", ng: "お尻の後ろ（坐骨）でサドル後方に座っている。ハンドルが遠い", ok: "股の付け根（恥骨枝あたり）がサドルの前半分に当たっている", check: "サドルの先端から5cm以内にお尻の前端があればOK" }
        }
      },
      balance: { type: "内側荷重（Inner）", description: "母指球・内側で踏む", detail: "膝がまっすぐ〜やや内向き。" }
    },
    fitting: {
      saddle: {
        height: { formula: "股下 × 0.865〜0.875", detail: "やや低め — 脚が伸ばしたい力を使う（コンプレッション）" },
        setback: { position: "前寄り（0〜-10mm）", detail: "前体幹の重心に合わせる" },
        tilt: { angle: "水平〜やや前下がり", detail: "骨盤前傾を促す" },
      },
      handlebar: {
        drop: { range: "大きめ（-40〜-60mm）", detail: "深い前傾" },
        reach: { range: "やや長め", detail: "クロス連動の捻り空間を確保" },
        width: { guide: "肩幅〜やや狭め", detail: "内側荷重と相性良い" },
      },
      cleat: {
        position: { fore_aft: "母指球よりやや前（1-2mm）", detail: "前体幹は踏み込みポイントが前寄り" },
        angle: { rotation: "つま先がやや外向き", detail: "内側荷重の力を引き出すコンプレッション。外向き制約→内に集まる力がペダル荷重に" },
        float: { degree: "少なめ（0〜4.5°）", detail: "ダイレクト感" },
        qFactor: { guide: "狭め（146〜150mm）", detail: "内側荷重が表現しやすいQ factor" },
      },
      crank: { length: { guide: "股下 × 0.195〜0.200", detail: "短めで高回転" } },
    },
    selfCheck: [
      { name: "股関節屈曲", method: "仰向けで膝を胸に", good: "120°以上", action: "深い前傾OK" },
    ],
    form: {
      landing: { title: "ペダリング", type: "高回転型（90rpm+）", detail: "軽いギアで回す" },
      posture: { title: "ポジション", type: "前乗り", detail: "サドル前方" },
      armSwing: { title: "ダンシング", type: "積極的", detail: "バイクを振る" },
      cadence: { title: "ケイデンス", type: "85-100rpm", detail: "高回転維持" }
    },
    guide: {
      fiveK: { title: "ヒルクライム", tips: ["後半ビルドアップ", "ダンシング活用"], avoid: "序盤飛ばしすぎ" },
      training: { title: "トレーニング", tips: ["インターバル", "スプリント"], avoid: "LSDのみ" }
    }
  },
  
  FIII: {
    name: "F-I-II",
    sub: "前体幹 × 内側 × パラレル",
    icon: "activity",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    traits: ["安定して内側で踏む", "みぞおち主導で同側連動", "効率的なペダリング"],
    description: "前体幹を使いながら内側で安定して踏む。効率重視のスムーズな走り。",
    strengths: ["ペダリング効率", "平地巡航", "TTポジション"],
    weaknesses: ["急なダンシング", "テクニカルコース"],
    radarData: [60, 70, 95, 65, 75],
    bodyMechanics: {
      trunk: { type: "Fタイプ（前体幹）", description: "みぞおち・股関節主導", detail: "みぞおちから折りたたむように前傾し、股関節で脚を回す。",
        ng: "背中を丸めて前傾している。腰が痛い",
        ok: "みぞおちの位置で前傾が決まり、腰は平らなまま",
        check: "横から見て腰が丸まっていない＝OK。みぞおちから上だけが前に倒れている" },
      movement: { 
        type: "パラレル（同側連動）", 
        description: "平行の動きが自然", 
        detail: "上半身固定で脚を回す。",
        感覚: [
          { ng: "ペダリング中に腰が左右に揺れる。サドルの上でお尻が動く", ok: "腰の位置が変わらず、太ももだけが上下している感覚", check: "後ろから撮影。肩のラインが水平のまま＝OK" },
          { ng: "ダンシング中にバイクが左右に大きく振れて、ふらつく", ok: "バイクのヘッドチューブがほぼ垂直のまま、体重移動だけでペダルを押している", check: "白線の上でダンシング10回。白線から外れなければOK" },
          { ng: "コーナーで上半身をねじろうとして、肩に力が入る", ok: "バイクと身体が同じ角度で傾き、視線だけが出口を見ている", check: "コーナリング中、内側のペダルが上・外側が下で体重が外脚に乗っていればOK" }
        ],
        荷重バランス: {
          ペダル: { label: "母指球中心、まっすぐ踏む", ng: "小指側に荷重が逃げている。足の外側がシューズに当たる", ok: "母指球の真下にペダル軸を感じる。まっすぐ下に踏んでいる", check: "ペダリング中に膝を正面から撮影。膝がつま先とまっすぐ同じ方向ならOK" },
          ハンドル: { label: "ブラケットで安定", ng: "ブラケットを強く握っている。手のひらが痛い", ok: "手のひらをブラケットに乗せている感じ。力は体幹で支えている", check: "走行中に指を2本浮かせられる＝握りしめてない" },
          サドル: { label: "前寄り〜中央", ng: "お尻がサドルの後端に来ている", ok: "サドルの前方〜中央に座り、ハンドルとの距離に余裕がある", check: "サドルの前端から10cm以内にお尻の前端があればOK" }
        }
      },
      balance: { type: "内側荷重（Inner）", description: "母指球・内側で踏む", detail: "膝がまっすぐ。" }
    },
    fitting: {
      saddle: {
        height: { formula: "股下 × 0.865〜0.875", detail: "やや低め — 脚が伸ばしたい力を使う（コンプレッション）" },
        setback: { position: "前寄り〜中央（-5〜+5mm）", detail: "前体幹の重心に合わせる" },
        tilt: { angle: "水平", detail: "安定性重視" },
      },
      handlebar: {
        drop: { range: "大きめ（-35〜-55mm）", detail: "深い前傾" },
        reach: { range: "やや短め", detail: "パラレル連動 — 短めの制約→押す力が集中" },
        width: { guide: "肩幅〜やや狭め", detail: "内側荷重と相性良い" },
      },
      cleat: {
        position: { fore_aft: "母指球よりやや前（1-2mm）", detail: "前体幹は踏み込みポイントが前寄り" },
        angle: { rotation: "つま先がやや外向き", detail: "内側荷重コンプレッション。外向き制約→内に集まる力がペダル荷重に" },
        float: { degree: "標準（4.5°）", detail: "適度な自由度" },
        qFactor: { guide: "狭め（146〜150mm）", detail: "内側荷重が表現しやすいQ factor" },
      },
      crank: { length: { guide: "股下 × 0.195〜0.200", detail: "短め" } },
    },
    selfCheck: [
      { name: "片足ペダリング", method: "30秒スムーズに", good: "カクつかない", action: "効率型" },
    ],
    form: {
      landing: { title: "ペダリング", type: "効率型（85-95rpm）", detail: "円運動を意識" },
      posture: { title: "ポジション", type: "前乗り", detail: "エアロ姿勢" },
      armSwing: { title: "ダンシング", type: "控えめ", detail: "シッティング中心" },
      cadence: { title: "ケイデンス", type: "85-95rpm", detail: "一定リズム" }
    },
    guide: {
      fiveK: { title: "ヒルクライム", tips: ["シッティング中心", "一定ペース"], avoid: "無駄なダンシング" },
      training: { title: "トレーニング", tips: ["ペダリングドリル", "テンポ走"], avoid: "フォーム崩す追い込み" }
    }
  },
  
  FOX: {
    name: "F-O-X",
    sub: "前体幹 × 外側 × クロス",
    icon: "flame",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    traits: ["捻りながら外側で踏む", "みぞおち主導で対角連動", "パワフルなダンシング"],
    description: "前体幹と外側荷重でパワーを出しながら、クロス連動でダイナミックに攻める。",
    strengths: ["パワー系クライム", "アタック", "独走"],
    weaknesses: ["集団走行", "一定ペース維持"],
    radarData: [85, 75, 55, 70, 55],
    bodyMechanics: {
      trunk: { type: "Fタイプ（前体幹）", description: "みぞおち・股関節主導", detail: "みぞおちと股関節を支点にして、上半身と下半身をダイナミックに使い分ける。",
        ng: "上半身が固まってしまい、脚の力だけで押している。膝に負担を感じる",
        ok: "踏み込むときにみぞおちが締まり、上半身の力が脚に伝わる感覚がある",
        check: "全力ダンシング10回。腹筋に疲れを感じればOK（脚だけなら身体が使えていない）" },
      movement: { 
        type: "クロス（対角連動）", 
        description: "捻じりの動きが自然", 
        detail: "対角で連動、ダイナミック。",
        感覚: [
          { ng: "腰が動いているが、力がペダルに伝わらず空回りする", ok: "右を踏むとき右の腰が前に出て、体重がペダルに乗る重さを感じる", check: "重めのギアで低速ペダリング。腰の動きとペダルの重さが連動していればOK" },
          { ng: "バイクを振っているが、ハンドルをこじっているだけ。手首が痛い", ok: "踏み込む脚と反対側にバイクが傾き、体重がそのまま落ちる感覚", check: "ダンシングで手を軽く添えるだけにする。それでもバイクが振れるなら体重移動OK" },
          { ng: "上半身は正面を向いたまま、バイクだけ傾けている", ok: "左コーナーなら左肩が前に出て、胸が少しコーナーの内側を向く", check: "コーナリング中に内側の肘が曲がっている＝肩が入っている" }
        ],
        荷重バランス: {
          ペダル: { label: "足裏全体〜外側", ng: "親指の付け根にだけ荷重が集中。母指球が痛い", ok: "足裏全体、特に小指球（小指の付け根）にも荷重を感じる", check: "ペダリング中に意識を足裏に向ける。小指側にも圧を感じられればOK" },
          ハンドル: { label: "下ハンで引く", ng: "ブラケットの上に手を置いているだけ。引く力がない", ok: "下ハン or ブラケット下部を握り、引く力が背中まで伝わる", check: "登りで下ハンを握ったとき、肩甲骨の間に張りを感じればOK" },
          サドル: { label: "前寄り", ng: "サドル後方に座り、ハンドルが遠く腕が伸びきっている", ok: "サドル前方に座り、股関節の屈曲（折れ曲がり）を感じる", check: "サドル先端から5cm以内にお尻の前端がある" }
        }
      },
      balance: { type: "外側荷重（Outer）", description: "足裏全体・外側", detail: "膝やや外向き。" }
    },
    fitting: {
      saddle: {
        height: { formula: "股下 × 0.865〜0.875", detail: "やや低め — 脚が伸ばしたい力を使う（コンプレッション）" },
        setback: { position: "前寄り〜中央（-5〜+5mm）", detail: "前体幹の重心に合わせる" },
        tilt: { angle: "水平", detail: "安定性" },
      },
      handlebar: {
        drop: { range: "大きめ（-35〜-55mm）", detail: "深い前傾" },
        reach: { range: "やや長め", detail: "クロス連動の捻り空間を確保" },
        width: { guide: "肩幅〜やや広め", detail: "外側荷重と相性良い" },
      },
      cleat: {
        position: { fore_aft: "母指球よりやや前（1-2mm）", detail: "前体幹は踏み込みポイントが前寄り" },
        angle: { rotation: "つま先がやや内向き", detail: "外側荷重コンプレッション。内向き制約→外に開く力がペダル荷重に" },
        float: { degree: "多め（6°）", detail: "膝の自由度" },
        qFactor: { guide: "標準〜広め（150〜156mm）", detail: "外側荷重が表現しやすい幅を確保" },
      },
      crank: { length: { guide: "股下 × 0.197〜0.203", detail: "標準" } },
    },
    selfCheck: [
      { name: "ダンシングテスト", method: "1分全力", good: "バイク振れる", action: "クロス型確定" },
    ],
    form: {
      landing: { title: "ペダリング", type: "トルク型（75-90rpm）", detail: "力強く踏む" },
      posture: { title: "ポジション", type: "前乗り", detail: "攻撃的姿勢" },
      armSwing: { title: "ダンシング", type: "積極的", detail: "大きく振る" },
      cadence: { title: "ケイデンス", type: "75-90rpm", detail: "トルク重視" }
    },
    guide: {
      fiveK: { title: "ヒルクライム", tips: ["ダンシングでアタック", "独走で逃げる"], avoid: "集団待機" },
      training: { title: "トレーニング", tips: ["SFR", "坂道ダンシング"], avoid: "軽すぎるギア" }
    }
  },
  
  FOII: {
    name: "F-O-II",
    sub: "前体幹 × 外側 × パラレル",
    icon: "mountain",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    traits: ["安定して外側で踏む", "みぞおち主導で同側連動", "粘り強いクライム"],
    description: "前体幹を使いながら外側で安定。パラレル連動で効率よく登る。",
    strengths: ["ヒルクライム", "ロングライド", "一定ペース"],
    weaknesses: ["スプリント", "急加速"],
    radarData: [50, 95, 70, 65, 85],
    bodyMechanics: {
      trunk: { type: "Fタイプ（前体幹）", description: "みぞおち・股関節主導", detail: "みぞおちから前傾し、股関節で脚を回す。上半身は安定させたまま。",
        ng: "背中全体を丸めて前傾。腰がつらい",
        ok: "みぞおちで折れていて、腰は反ってもなく丸まってもない",
        check: "横からの撮影で、腰が平ら＋みぞおちから上が前に倒れていればOK" },
      movement: { 
        type: "パラレル（同側連動）", 
        description: "平行の動きが自然", 
        detail: "腰を固定して脚を回す。",
        感覚: [
          { ng: "ペダリング中に腰がぐらぐら動く。サドル上でお尻がズレる", ok: "骨盤がサドルに固定され、脚だけが動く。お尻の位置が変わらない", check: "サドルにビニールテープを十字に貼る。走行後テープがずれていなければOK" },
          { ng: "ダンシングでバイクが左右に振れて不安定。肩に力が入る", ok: "バイクがほぼ垂直のまま、体重を交互のペダルに乗せるだけで進む", check: "ダンシング中にボトルが揺れない程度の安定感があればOK" },
          { ng: "コーナーで身体だけが立ってしまい、バイクだけ寝ている", ok: "肩・腰・バイクが同じ角度で傾いている。一枚板のような感覚", check: "コーナリング中に外脚に体重を感じ、内側のペダルが上にあればOK" }
        ],
        荷重バランス: {
          ペダル: { label: "足裏全体で安定", ng: "母指球だけに集中。内側に荷重が偏って膝が内に入る", ok: "足裏全体でペダルを踏んでいる。特に小指側にも圧を感じる", check: "スクワットの姿勢で足裏を確認。外側にも荷重があればOK" },
          ハンドル: { label: "ブラケットで押す", ng: "ハンドルを引いている。肩が上がっている", ok: "ブラケットを前方に押す感覚。肩は下がっている", check: "走行中に肩をすくめて→ストンと落とす。落とした位置が正しいポジション" },
          サドル: { label: "前寄り〜中央", ng: "サドル後端に座り、ハンドルに手が届きにくい", ok: "サドル前方〜中央で、股関節の折れ曲がりを感じる", check: "サドル先端から10cm以内にお尻の前端がある" }
        }
      },
      balance: { type: "外側荷重（Outer）", description: "足裏全体・外側", detail: "膝やや外向き。" }
    },
    fitting: {
      saddle: {
        height: { formula: "股下 × 0.865〜0.875", detail: "やや低め — 脚が伸ばしたい力を使う（コンプレッション）" },
        setback: { position: "前寄り〜中央（-5〜+10mm）", detail: "前体幹の重心に合わせる" },
        tilt: { angle: "水平", detail: "安定性" },
      },
      handlebar: {
        drop: { range: "大きめ（-30〜-50mm）", detail: "深い前傾" },
        reach: { range: "やや短め", detail: "パラレル連動 — 短めの制約→直線的な力が集中" },
        width: { guide: "肩幅〜やや広め", detail: "外側荷重と相性良い" },
      },
      cleat: {
        position: { fore_aft: "母指球よりやや前（1-2mm）", detail: "前体幹は踏み込みポイントが前寄り" },
        angle: { rotation: "つま先がやや内向き", detail: "外側荷重コンプレッション。内向き制約→外に開く力がペダル荷重に" },
        float: { degree: "多め（6°）", detail: "長時間の快適性" },
        qFactor: { guide: "標準〜広め（150〜156mm）", detail: "外側荷重が表現しやすい幅を確保" },
      },
      crank: { length: { guide: "股下 × 0.197〜0.203", detail: "標準" } },
    },
    selfCheck: [
      { name: "片足ペダリング", method: "30秒", good: "スムーズ", action: "効率型" },
    ],
    form: {
      landing: { title: "ペダリング", type: "効率型（80-90rpm）", detail: "安定して回す" },
      posture: { title: "ポジション", type: "前乗り〜中央", detail: "効率重視" },
      armSwing: { title: "ダンシング", type: "控えめ", detail: "シッティング中心" },
      cadence: { title: "ケイデンス", type: "80-90rpm", detail: "安定リズム" }
    },
    guide: {
      fiveK: { title: "ヒルクライム", tips: ["自分のペース維持", "シッティング中心"], avoid: "周りに惑わされない" },
      training: { title: "トレーニング", tips: ["テンポ走", "ロングライド"], avoid: "スピード練も忘れず" }
    }
  },
  
  RIX: {
    name: "R-I-X",
    sub: "後体幹 × 内側 × クロス",
    icon: "shuffle",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    traits: ["捻りながら内側で踏む", "肩甲骨・腰主導で対角連動", "リズミカルな走り"],
    description: "後体幹で身体を一体に使いながら、クロス連動でリズムよく漕ぐ。",
    strengths: ["リズム感", "テクニカルコース", "変化への対応"],
    weaknesses: ["単調な平地", "TTポジション"],
    radarData: [70, 60, 70, 85, 70],
    bodyMechanics: {
      trunk: { type: "Rタイプ（後体幹）", description: "首・肩甲骨・腰主導", detail: "首・肩甲骨・腰をつないで、背中側から動きを生み出す。",
        ng: "お腹側（みぞおち）に力を入れようとして、呼吸が苦しい",
        ok: "肩甲骨を寄せる→腰が安定する、という背中から始まる感覚",
        check: "軽く肩甲骨を寄せてペダリング。呼吸が楽になればRタイプの使い方ができている" },
      movement: { 
        type: "クロス（対角連動）", 
        description: "捻じりの動きが自然", 
        detail: "対角線の連動が得意。",
        感覚: [
          { ng: "腰を意識的に動かそうとして、ぎこちない", ok: "肩甲骨を意識すると、その結果として腰が左右にわずかに動く", check: "背中に意識を置いてペダリング10回。腰の動きが勝手に出ていればOK" },
          { ng: "腕でハンドルを引いてバイクを振っている。肩が凝る", ok: "体重移動でバイクが傾き、踏む脚と反対側の肩甲骨が寄る", check: "ダンシング中に肩の力を抜いてみる。それでもバイクが振れればOK" },
          { ng: "歩くとき腕を意識的に振ろうとしている", ok: "肩甲骨から腕が振り子のように動く。腕の力は抜けている", check: "歩行中に肩の力を抜く。腕が勝手に振れるならクロス連動OK" }
        ],
        荷重バランス: {
          ペダル: { label: "母指球中心", ng: "足の外側でペダルを踏んでいる。小指側が痛い", ok: "母指球の真下にペダル軸。内くるぶし方向に軽い張りがある", check: "ペダリング中に膝が正面〜やや内側を向いていればOK" },
          ハンドル: { label: "下ハンも使える", ng: "ブラケットの上部だけを握っている。手のひらが浮いている", ok: "ブラケット全体を包むように握り、下ハンにも自然に移行できる", check: "ブラケットから下ハンへの持ち替えがスムーズならOK" },
          サドル: { label: "中央〜後ろ", ng: "サドルの先端に座っていて、股間が圧迫される", ok: "サドルの中央〜やや後ろ。坐骨がサドルにしっかり乗っている", check: "手放しで5秒座れる安定感があればOK" }
        }
      },
      balance: { type: "内側荷重（Inner）", description: "母指球・内側", detail: "膝まっすぐ。" }
    },
    fitting: {
      saddle: {
        height: { formula: "股下 × 0.875〜0.885", detail: "やや高め — 脚が引き込みたい力を使う（コンプレッション）" },
        setback: { position: "中央〜後ろ寄り（0〜+10mm）", detail: "後体幹の重心に合わせる" },
        tilt: { angle: "水平", detail: "安定性" },
      },
      handlebar: {
        drop: { range: "小さめ（-15〜-35mm）", detail: "比較的アップライト" },
        reach: { range: "やや長め", detail: "クロス連動の捻り空間を確保" },
        width: { guide: "肩幅〜やや狭め", detail: "内側荷重と相性良い" },
      },
      cleat: {
        position: { fore_aft: "母指球上〜やや後ろ", detail: "後体幹は踏み込みポイントが中央寄り" },
        angle: { rotation: "つま先がやや外向き", detail: "内側荷重コンプレッション。外向き制約→内に集まる力がペダル荷重に" },
        float: { degree: "標準（4.5°）", detail: "適度な自由度" },
        qFactor: { guide: "狭め（146〜150mm）", detail: "内側荷重が表現しやすいQ factor" },
      },
      crank: { length: { guide: "股下 × 0.197〜0.200", detail: "標準〜短め" } },
    },
    selfCheck: [
      { name: "腰回旋", method: "座って左右に捻る", good: "スムーズ", action: "クロス型" },
    ],
    form: {
      landing: { title: "ペダリング", type: "リズム型（80-95rpm）", detail: "リズムよく回す" },
      posture: { title: "ポジション", type: "ニュートラル", detail: "状況に応じて" },
      armSwing: { title: "ダンシング", type: "適度に", detail: "リズムに合わせて" },
      cadence: { title: "ケイデンス", type: "80-95rpm", detail: "リズム重視" }
    },
    guide: {
      fiveK: { title: "ヒルクライム", tips: ["リズムを崩さない", "ダンシング活用"], avoid: "単調になりすぎ" },
      training: { title: "トレーニング", tips: ["変化のあるコース", "テンポ走"], avoid: "同じ練習ばかり" }
    }
  },
  
  RIII: {
    name: "R-I-II",
    sub: "後体幹 × 内側 × パラレル",
    icon: "wave",
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
    traits: ["安定して内側で踏む", "肩甲骨・腰主導で同側連動", "効率的で滑らか"],
    description: "身体全体を一体で使い、流れるように前へ進む。効率的。",
    strengths: ["ペダリング効率", "平地巡航", "集団走行"],
    weaknesses: ["ダンシング", "急な地形変化"],
    radarData: [55, 70, 95, 75, 70],
    bodyMechanics: {
      trunk: { type: "Rタイプ（後体幹）", description: "首・肩甲骨・腰主導", detail: "肩甲骨と腰を連動させて、背中全体で安定を作る。上半身は動かさない。",
        ng: "上半身を固めようとして肩に力が入り、呼吸が浅い",
        ok: "肩甲骨を軽く寄せるだけで上半身が安定する。力まずに固定できている",
        check: "片手をハンドルから離して5秒。上半身がブレなければOK" },
      movement: { 
        type: "パラレル（同側連動）", 
        description: "平行の動きが自然", 
        detail: "捻じらず安定。",
        感覚: [
          { ng: "上半身を固めようとして肩が上がっている。首が痛い", ok: "肩は落ちたまま、骨盤から上が一つのブロックのように安定している", check: "走行中に肩をすくめて→ストンと落とす。落とした状態で上半身が安定すればOK" },
          { ng: "ダンシングでバイクが左右にふらつく。上半身が揺れる", ok: "バイクのヘッドチューブがほぼ垂直。体重を真下にかけている", check: "緩い登りでダンシング10回。ハンドルから手を軽くしても進めればOK" },
          { ng: "ハンドルを左右に引っ張っている。腕が疲れる", ok: "ハンドルに手を置いているだけ。推進力は脚と体幹から", check: "ブラケットを握る力を半分にしてみる。走りが変わらなければOK" }
        ],
        荷重バランス: {
          ペダル: { label: "母指球中心、まっすぐ", ng: "つま先で踏んでいる。ふくらはぎが先に疲れる", ok: "母指球中心に、ペダル軸をまっすぐ真下に押している", check: "膝がまっすぐ前を向き、つま先と同じ方向ならOK" },
          ハンドル: { label: "ブラケットに添える", ng: "ブラケットを強く握り、手のひらに圧がかかっている", ok: "指をブラケットに添えているだけ。手のひらに体重をかけていない", check: "走行中に指を2本浮かせて3秒維持できればOK" },
          サドル: { label: "中央にどっしり", ng: "サドルの前に座りすぎて股間が痛い", ok: "サドル中央にどっしり。坐骨の2点がサドルに乗っている感覚", check: "お尻を左右に振ってみる。坐骨がサドルの座面にハマる位置が正解" }
        }
      },
      balance: { type: "内側荷重（Inner）", description: "母指球・内側", detail: "膝まっすぐ。" }
    },
    fitting: {
      saddle: {
        height: { formula: "股下 × 0.875〜0.885", detail: "やや高め — 脚が引き込みたい力を使う（コンプレッション）" },
        setback: { position: "ニュートラル〜後ろ寄り（0〜+10mm）", detail: "後体幹の重心に合わせる" },
        tilt: { angle: "完全水平", detail: "骨盤安定" },
      },
      handlebar: {
        drop: { range: "小さめ（-15〜-35mm）", detail: "比較的アップライト" },
        reach: { range: "やや短め", detail: "パラレル連動 — 短めの制約→押す力が集中" },
        width: { guide: "肩幅〜やや狭め", detail: "内側荷重と相性良い" },
      },
      cleat: {
        position: { fore_aft: "母指球上〜やや後ろ", detail: "後体幹は踏み込みポイントが中央寄り" },
        angle: { rotation: "つま先がやや外向き", detail: "内側荷重コンプレッション。外向き制約→内に集まる力がペダル荷重に" },
        float: { degree: "標準（4.5°）", detail: "適度" },
        qFactor: { guide: "狭め（146〜150mm）", detail: "内側荷重が表現しやすいQ factor" },
      },
      crank: { length: { guide: "股下 × 0.197〜0.200", detail: "標準〜短め" } },
    },
    selfCheck: [
      { name: "片足立ち", method: "30秒", good: "ほぼ動かない", action: "体幹安定" },
      { name: "スムーズペダリング", method: "片足30秒", good: "カクつかない", action: "効率型" },
    ],
    form: {
      landing: { title: "ペダリング", type: "高効率型（85-95rpm）", detail: "綺麗な円運動" },
      posture: { title: "ポジション", type: "ニュートラル", detail: "効率重視" },
      armSwing: { title: "ダンシング", type: "あまり使わない", detail: "シッティング中心" },
      cadence: { title: "ケイデンス", type: "90rpm前後", detail: "一定リズム" }
    },
    guide: {
      fiveK: { title: "ヒルクライム", tips: ["一定ペース", "シッティング"], avoid: "無駄なダンシング" },
      training: { title: "トレーニング", tips: ["テンポ走", "ペダリングドリル"], avoid: "フォーム崩す追い込み" }
    }
  },
  
  ROX: {
    name: "R-O-X",
    sub: "後体幹 × 外側 × クロス",
    icon: "crosshair",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899, #db2777)",
    traits: ["捻りながら外側で踏む", "肩甲骨・腰主導で対角連動", "適応力が高い"],
    description: "身体全体を使いながらクロス連動。あらゆる状況に対応できる。",
    strengths: ["適応力", "安定感", "レース全般"],
    weaknesses: ["突出した武器がない（逆に強み）"],
    radarData: [70, 75, 75, 95, 80],
    bodyMechanics: {
      trunk: { type: "Rタイプ（後体幹）", description: "首・肩甲骨・腰主導", detail: "肩甲骨と腰を起点に、背中側からねじりの動きを生み出す。",
        ng: "お腹側で体をねじろうとして窮屈。肩が突っ張る",
        ok: "肩甲骨を起点にねじると、腰まで連動して動く。背中側が主役",
        check: "椅子に座って上半身を左右にねじる。背中から動き始める感覚があればOK" },
      movement: { 
        type: "クロス（対角連動）", 
        description: "捻じりの動きが自然", 
        detail: "対角線の動きが得意。",
        感覚: [
          { ng: "意識的に腰を動かそうとして、サドルの上でお尻が滑る", ok: "踏み込みに合わせて腰が結果として左右に動く。お尻はサドルに安定", check: "サドルの上で骨盤を左右に動かしてみる。動きが自然で力まなければOK" },
          { ng: "腕でバイクを振っている。手首や前腕が疲れる", ok: "体重移動でバイクが傾き、肩甲骨〜腰のねじりが脚に伝わる", check: "ダンシング中に握力を緩める。それでもバイクが振れれば体幹主導OK" },
          { ng: "歩くとき同じ側の手脚が一緒に出る（ナンバ歩きっぽい）", ok: "右脚が出ると左腕が前に出る。胸〜腰にかけて軽いねじりがある", check: "大股で10歩歩く。腕が自然に対角で振れていればOK" }
        ],
        荷重バランス: {
          ペダル: { label: "足裏外側も使う", ng: "母指球だけに荷重が集中して、足の内側が疲れる", ok: "足裏全体、特に小指球（外側）にも荷重を感じる", check: "ペダリング中に足の小指を意識してみる。圧を感じればOK" },
          ハンドル: { label: "下ハンで引く", ng: "ブラケットの上に手を置いているだけ。加速時に力が逃げる", ok: "下ハンで引くと背中まで力が伝わる。肩甲骨の間に張りがある", check: "加速時に下ハンを握る。肩甲骨が寄る感覚があればOK" },
          サドル: { label: "後方、左右に動く", ng: "サドル前方に座って股間が圧迫される", ok: "サドルのやや後方で、ねじりの動きに対応できるスペースがある", check: "ペダリング中にお尻が左右に動ける余裕がサドル上にあればOK" }
        }
      },
      balance: { type: "外側荷重（Outer）", description: "足裏全体・外側", detail: "膝やや外向き。" }
    },
    fitting: {
      saddle: {
        height: { formula: "股下 × 0.875〜0.885", detail: "やや高め — 脚が引き込みたい力を使う（コンプレッション）" },
        setback: { position: "やや後ろ（+5〜+15mm）", detail: "後体幹の重心に合わせる" },
        tilt: { angle: "水平〜やや後ろ上がり", detail: "長時間快適" },
      },
      handlebar: {
        drop: { range: "小さめ（-10〜-30mm）", detail: "比較的アップライト" },
        reach: { range: "やや長め", detail: "クロス連動の捻り空間を確保" },
        width: { guide: "肩幅〜やや広め", detail: "外側荷重と相性良い" },
      },
      cleat: {
        position: { fore_aft: "母指球上〜やや後ろ", detail: "後体幹は踏み込みポイントが中央寄り" },
        angle: { rotation: "つま先がやや内向き", detail: "外側荷重コンプレッション。内向き制約→外に開く力がペダル荷重に" },
        float: { degree: "多め（6°）", detail: "膝保護と腰の回旋" },
        qFactor: { guide: "標準〜広め（150〜156mm）", detail: "外側荷重が表現しやすい幅を確保" },
      },
      crank: { length: { guide: "股下 × 0.197〜0.203", detail: "標準" } },
    },
    selfCheck: [
      { name: "スクワット", method: "ゆっくり10回", good: "膝がつま先方向", action: "安定型" },
    ],
    form: {
      landing: { title: "ペダリング", type: "適応型（75-90rpm）", detail: "状況に応じて" },
      posture: { title: "ポジション", type: "やや後ろ乗り", detail: "安定重視" },
      armSwing: { title: "ダンシング", type: "適度に", detail: "バイクを振る" },
      cadence: { title: "ケイデンス", type: "75-90rpm", detail: "適応的" }
    },
    guide: {
      fiveK: { title: "ヒルクライム", tips: ["ペース配分", "ダンシング活用"], avoid: "得意に頼りすぎ" },
      training: { title: "トレーニング", tips: ["様々なメニュー", "弱点克服"], avoid: "得意ばかり" }
    }
  },
  
  ROII: {
    name: "R-O-II",
    sub: "後体幹 × 外側 × パラレル",
    icon: "anchor",
    color: "#64748b",
    gradient: "linear-gradient(135deg, #64748b, #475569)",
    traits: ["安定して外側で踏む", "肩甲骨・腰主導で同側連動", "どっしり安定"],
    description: "後体幹と外側荷重でどっしり安定。パラレル連動で効率よく踏む。",
    strengths: ["安定感", "ロングライド", "悪条件"],
    weaknesses: ["瞬発力", "急なペース変化"],
    radarData: [45, 85, 80, 80, 95],
    bodyMechanics: {
      trunk: { type: "Rタイプ（後体幹）", description: "首・肩甲骨・腰主導", detail: "肩甲骨と腰を固定して、背中全体で安定を作る。どっしりとした土台。",
        ng: "上半身がふらつく。体重がハンドルに逃げて手が痛い",
        ok: "肩甲骨を寄せると腰が安定し、体重がサドルに乗る。手が軽い",
        check: "走行中に両手を軽く浮かせる。3秒以上できればOK（体幹で支えられている）" },
      movement: { 
        type: "パラレル（同側連動）", 
        description: "平行の動きが自然", 
        detail: "捻じらず安定。",
        感覚: [
          { ng: "上半身を固めようとして肩や首に力が入る。息が詰まる", ok: "背中が壁のように安定して、その下で脚だけが動いている", check: "10分間走行中に肩が上がっていないか確認。下がったままならOK" },
          { ng: "ダンシングでバイクが左右に振れる。ハンドル操作で疲れる", ok: "バイクを真っ直ぐ保ったまま、体重を左右のペダルに交互に乗せる", check: "白線の上でダンシング10回。白線から外れなければOK" },
          { ng: "ハンドルを左右に引いて推進力を作ろうとしている。腕が疲れる", ok: "ハンドルは安定のための支え。推進力は脚のみ", check: "ブラケットの握りを半分に緩めて走る。速度が変わらなければOK" }
        ],
        荷重バランス: {
          ペダル: { label: "足裏全体でどっしり", ng: "親指の付け根だけに荷重。ペダルの内側を踏んでいる", ok: "足裏全体でペダルを包むように踏む。特にかかと寄り〜外側にも圧がある", check: "ペダリング中に足裏全体の接地感を確認。偏りなく踏めていればOK" },
          ハンドル: { label: "ブラケットで安定", ng: "ブラケットに体重がかかって手のひらが痺れる", ok: "ブラケットに手を添えているだけ。体重はサドルと脚で支えている", check: "走行中に手のひらを開いても安定して走れればOK" },
          サドル: { label: "後方にどっしり", ng: "サドルの前に座って、ハンドルが近すぎる。窮屈", ok: "サドル後方に坐骨が乗り、腕はリラックスして伸びている", check: "サドルの後ろ半分にお尻の重心がある。手放しで安定すればOK" }
        }
      },
      balance: { type: "外側荷重（Outer）", description: "足裏全体・外側", detail: "膝やや外向き。" }
    },
    fitting: {
      saddle: {
        height: { formula: "股下 × 0.875〜0.885", detail: "やや高め — 脚が引き込みたい力を使う（コンプレッション）" },
        setback: { position: "後ろ寄り（+10〜+20mm）", detail: "後体幹の重心に合わせる" },
        tilt: { angle: "やや後ろ上がり", detail: "快適性" },
      },
      handlebar: {
        drop: { range: "小さめ（-5〜-25mm）", detail: "比較的アップライト" },
        reach: { range: "やや短め", detail: "パラレル連動 — 短めの制約→直線的な力が集中" },
        width: { guide: "肩幅〜やや広め", detail: "外側荷重と相性良い" },
      },
      cleat: {
        position: { fore_aft: "母指球上〜やや後ろ", detail: "後体幹は踏み込みポイントが中央寄り" },
        angle: { rotation: "つま先がやや内向き", detail: "外側荷重コンプレッション。内向き制約→外に開く力がペダル荷重に" },
        float: { degree: "多め（6°）", detail: "快適性" },
        qFactor: { guide: "標準〜広め（150〜156mm）", detail: "外側荷重が表現しやすい幅を確保" },
      },
      crank: { length: { guide: "股下 × 0.200〜0.207", detail: "標準〜やや長め" } },
    },
    selfCheck: [
      { name: "長時間立ち", method: "5分", good: "楽に立てる", action: "安定型" },
    ],
    form: {
      landing: { title: "ペダリング", type: "安定型（70-85rpm）", detail: "どっしり踏む" },
      posture: { title: "ポジション", type: "後ろ乗り", detail: "安定重視" },
      armSwing: { title: "ダンシング", type: "控えめ", detail: "シッティング中心" },
      cadence: { title: "ケイデンス", type: "70-85rpm", detail: "低め安定" }
    },
    guide: {
      fiveK: { title: "ヒルクライム", tips: ["マイペース", "シッティング"], avoid: "無理なアタック" },
      training: { title: "トレーニング", tips: ["ロングライド", "耐久走"], avoid: "短時間高強度のみ" }
    }
  },
};

// スポーツ別TYPE_INFOを取得
const getTypeInfo = (sport, type) => {
  const sportData = TYPE_INFO_CYCLING;
  return sportData[type];
};

// Premium Card コンポーネント
const Card = ({ children, style = {}, pressed = false }) => (
  <div style={{ 
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRadius: 20, 
    padding: 24,
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease",
    ...style 
  }}>
    {children}
  </div>
);

// Light Glass UIボタン
const NeuButton = ({ children, onClick, active = false, color = C.accent, style = {} }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? color : "rgba(255, 255, 255, 0.55)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: active ? `1px solid ${color}` : "1px solid rgba(255, 255, 255, 0.4)",
      borderRadius: 16,
      padding: "14px 28px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: active ? `0 4px 20px ${color}25` : "0 1px 8px rgba(0,0,0,0.04)",
      color: active ? "#fff" : C.text,
      fontWeight: 500,
      fontSize: 14,
      ...style
    }}
  >
    {children}
  </button>
);

// 星評価コンポーネント
const StarRating = ({ stars, maxStars = 5, color = C.accent, size = 14 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {Array.from({ length: maxStars }, (_, i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < stars ? color : C.shadowDark} stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

export default function App() {
  // URLパラメータチェック（初期値に使用）
  const getInitialFromURL = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlType = params.get("t");
      if (urlType && TYPE_INFO.cycling[urlType]) {
        return {
          type: urlType,
          spectrum: {
            fr: parseInt(params.get("fr")) || 50,
            io: parseInt(params.get("io")) || 50,
            xp: parseInt(params.get("xp")) || 50,
          },
          confidence: {
            fr: (parseInt(params.get("fr")) || 50) >= 65 || (parseInt(params.get("fr")) || 50) <= 35 ? "clear" : "leaning",
            io: (parseInt(params.get("io")) || 50) >= 65 || (parseInt(params.get("io")) || 50) <= 35 ? "clear" : "leaning",
            xp: (parseInt(params.get("xp")) || 50) >= 65 || (parseInt(params.get("xp")) || 50) <= 35 ? "clear" : "leaning",
          },
        };
      }
    } catch (e) {}
    return null;
  };
  const _urlResult = getInitialFromURL();
  
  const [mode, setMode] = useState(_urlResult ? "result" : "start");
  const [sport, setSport] = useState("cycling"); // "cycling" only
  const [questions, setQuestions] = useState([]);
  const [extraQuestionPool, setExtraQuestionPool] = useState([]); // 僅差時の追加質問用
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState(new Set());
  const [scores, setScores] = useState({
    typeA: 0, typeB: 0, num1: 0, num2: 0, high: 0, low: 0, open: 0, forward: 0,
    aggressive: 0, steady: 0, solo: 0, team: 0,
    cross: 0, parallel: 0, // クロス/パラレル（横の動き）
  });
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [result, setResult] = useState(_urlResult);
  const [isPro, setIsPro] = useState(false);
  const [savedResult, setSavedResult] = useState(null);
  
  // フィッティング計算用state
  const [bodyMetrics, setBodyMetrics] = useState({
    height: "", // 身長(cm)
    inseam: "", // 股下(cm)
    armSpan: "", // 腕の長さ(cm) - オプション
    shoulderWidth: "", // 肩幅(cm) - オプション
    bodyType: "", // 体型タイプ: "long" | "standard" | "short" | ""
    shoulderType: "standard", // 肩幅タイプ: "wide" | "standard" | "narrow"
  });
  const [showFittingCalc, setShowFittingCalc] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [resultHistory, setResultHistory] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [extraRoundDone, setExtraRoundDone] = useState(false);
  const [openChecks, setOpenChecks] = useState({});
  const [showHistory, setShowHistory] = useState(false); // 回答履歴表示
  const [showAllBodyFeel, setShowAllBodyFeel] = useState(false);
  const [openSections, setOpenSections] = useState({ body: true, fitting: true, selfCheck: true, hill: false, ride: false, feel: false, gear: false, motion: false, compress: false });
  const tog = (k) => setOpenSections(s => ({ ...s, [k]: !s[k] }));
  
  const [stageUp, setStageUp] = useState(null); // ステージアップ演出 { level, message }
  const [prevAccuracyLevel, setPrevAccuracyLevel] = useState(0); // 前回の精度レベル
  const [fitterSearchArea, setFitterSearchArea] = useState("");
  const [showPartners, setShowPartners] = useState(true);
  const [typeDistribution, setTypeDistribution] = useState(null); // { FIX: 123, FIII: 98, ... , total: 800 }
  
  // ============================================
  // 質問出題設定
  // - コア質問は必ず出題（判定に重要な質問）
  // - それ以外からランダムに追加 = 約25問で判定
  // - 僅差時のみ該当カテゴリから追加2問
  // ============================================
  const RANDOM_PER_CATEGORY = 1;  // コア以外からランダム追加する数
  const EXTRA_ON_TIE = 2;         // 僅差時に追加する問数
  
  // コア質問ID（必ず出題する質問）
  const CORE_QUESTIONS = {
    trunk: ["lift_heavy", "power_source", "push_wall"],  // 体幹判定
    balance: ["leg_shape", "action_squat_now", "shoe_wear", "action_one_leg"],  // 荷重判定（客観+体験型）
    movement: ["cross_walk", "cross_throw", "parallel_swim"],  // 連動判定
    cadence: ["pedal_pace", "ride_style"],  // ケイデンス
    posture: ["desk_posture", "breath_feel"],  // 姿勢
    mental_agg: ["game_style", "risk_take"],  // メンタル攻撃性
    mental_team: ["travel_style", "work_focus"],  // チーム性
  };
  
  // 初期化：コア質問 + ランダム追加
  useEffect(() => {
    document.title = "STANCE CORE - サイクリスト身体タイプ診断";
    
    // カテゴリごとにグループ化
    const byCategory = {};
    QUESTION_POOL.forEach(q => {
      if (!byCategory[q.cat]) byCategory[q.cat] = [];
      byCategory[q.cat].push(q);
    });
    
    const selected = [];
    const extra = [];
    
    Object.keys(byCategory).forEach(cat => {
      const coreIds = CORE_QUESTIONS[cat] || [];
      const catQuestions = byCategory[cat];
      
      // コア質問を選択
      const coreQuestions = catQuestions.filter(q => coreIds.includes(q.id));
      selected.push(...coreQuestions);
      
      // 残りをシャッフルしてランダム追加
      const nonCore = catQuestions.filter(q => !coreIds.includes(q.id));
      const shuffled = nonCore.sort(() => Math.random() - 0.5);
      selected.push(...shuffled.slice(0, RANDOM_PER_CATEGORY));
      extra.push(...shuffled.slice(RANDOM_PER_CATEGORY));
    });
    
    // 選択した質問をシャッフルしてセット
    setQuestions(selected.sort(() => Math.random() - 0.5));
    setExtraQuestionPool(extra);
    
    // 旧タイプキー → 新タイプキーのマッピング（互換性のため）
    const migrateTypeKey = (oldKey) => {
      const mapping = {
        "A1": "FIX",   // 旧: 前体幹×内側 → 新: クロスをデフォルト
        "A2": "FOII",  // 旧: 前体幹×外側 → 新: パラレルをデフォルト
        "B1": "RIII",  // 旧: 後体幹×内側 → 新: パラレルをデフォルト
        "B2": "ROX",   // 旧: 後体幹×外側 → 新: クロスをデフォルト
      };
      return mapping[oldKey] || oldKey;
    };
    
    // LocalStorageから保存された結果を読み込み（URLパラメータがない場合のみ）
    if (!_urlResult) {
    try {
      const saved = localStorage.getItem("stancecore_result");
      if (saved) {
        const parsed = JSON.parse(saved);
        // 旧キーの場合はマイグレーション
        if (parsed.type && ["A1", "A2", "B1", "B2"].includes(parsed.type)) {
          parsed.type = migrateTypeKey(parsed.type);
          // 更新したデータを保存し直す
          localStorage.setItem("stancecore_result", JSON.stringify(parsed));
        }
        setSavedResult(parsed);
      }
      const savedMetrics = localStorage.getItem("stancecore_metrics");
      if (savedMetrics) {
        const parsedMetrics = JSON.parse(savedMetrics);
        setBodyMetrics(prev => ({ ...prev, ...parsedMetrics }));
      }
      // 履歴読み込み
      const savedHistory = JSON.parse(localStorage.getItem("stancecore_history") || "[]");
      setResultHistory(savedHistory);
    } catch (e) {
      console.log("No saved result");
    }
    } // end if (!_urlResult)
  }, []);
  
  // bodyMetricsが変更されたら保存
  useEffect(() => {
    if (bodyMetrics.height || bodyMetrics.inseam) {
      try {
        localStorage.setItem("stancecore_metrics", JSON.stringify(bodyMetrics));
      } catch (e) {
        console.log("Failed to save metrics");
      }
    }
  }, [bodyMetrics]);
  
  const getAccuracyLevel = () => {
    const count = Object.keys(answers).length;
    let level = ACCURACY_LEVELS[0];
    for (const l of ACCURACY_LEVELS) {
      if (count >= l.min) level = l;
    }
    return { ...level, count };
  };
  
  // ステージアップチェック（約20問で完了想定）
  const STAGE_THRESHOLDS = [
    { min: 5, level: 1, label: "基本解析", message: "基本解析モード突入" },
    { min: 10, level: 2, label: "標準解析", message: "標準解析モードへ" },
    { min: 15, level: 3, label: "高精度", message: "高精度モードへ" },
    { min: 18, level: 4, label: "完全解析", message: "完全解析達成" },
  ];
  
  const checkStageUp = (answerCount, newScores) => {
    const newStage = STAGE_THRESHOLDS.filter(s => answerCount >= s.min).pop();
    const newLevel = newStage?.level || 0;
    
    if (newLevel > prevAccuracyLevel) {
      setPrevAccuracyLevel(newLevel);
      
      // 僅差チェック
      const typeABDiff = Math.abs(newScores.typeA - newScores.typeB);
      const num12Diff = Math.abs(newScores.num1 - newScores.num2);
      const isClose = typeABDiff <= 2 || num12Diff <= 2;
      
      // 完全解析達成時
      if (newLevel === 4) {
        if (isClose) {
          // 僅差の場合は警告付きで表示、自動遷移しない
          setStageUp({
            ...newStage,
            isClose: true,
            message: "完全解析達成！でも判定が僅差..."
          });
          setTimeout(() => setStageUp(null), 2500);
        } else {
          // 僅差でなければ自動で結果画面へ
          setStageUp(newStage);
          setTimeout(() => {
            setStageUp(null);
            calculateResult();
          }, 2500);
        }
      } else {
        setStageUp(newStage);
        setTimeout(() => setStageUp(null), 2000);
      }
    }
  };
  
  const handleAnswer = (choice) => {
    // 処理中または回答済みならスキップ
    if (showingAnswer) return;
    
    const q = questions[currentIndex];
    if (!q) return;
    if (answers[q.id] !== undefined) return;
    
    setShowingAnswer(true);
    
    const newAnswers = { ...answers, [q.id]: choice };
    setAnswers(newAnswers);
    
    const newScores = { ...scores };
    Object.entries(q.weight).forEach(([key, values]) => {
      newScores[key] = (newScores[key] || 0) + values[choice === "a" ? 0 : 1];
    });
    setScores(newScores);
    
    // ステージアップチェック（newScoresを渡す）
    checkStageUp(Object.keys(newAnswers).length, newScores);
    
    setTimeout(() => {
      setShowingAnswer(false);
      goToNext(newAnswers, newScores);
    }, 250);
  };
  
  const handleSkip = () => {
    const q = questions[currentIndex];
    const newSkipped = new Set([...skipped, q.id]);
    setSkipped(newSkipped);
    setShowingAnswer(true);
    setTimeout(() => {
      setShowingAnswer(false);
      // newSkippedを使って次の質問を探す
      const unanswered = questions.filter(qu => !answers[qu.id] && !newSkipped.has(qu.id));
      if (unanswered.length > 0) {
        const nextIndex = questions.findIndex(qu => qu.id === unanswered[0].id);
        if (nextIndex >= 0) setCurrentIndex(nextIndex);
      }
    }, 200);
  };
  
  // 回答を削除（履歴から修正）
  const removeAnswer = (questionId) => {
    const newAnswers = { ...answers };
    delete newAnswers[questionId];
    setAnswers(newAnswers);
    
    // スコアを再計算
    const newScores = { typeA: 0, typeB: 0, num1: 0, num2: 0, high: 0, low: 0, open: 0, forward: 0, aggressive: 0, steady: 0, solo: 0, team: 0 };
    Object.entries(newAnswers).forEach(([qId, ans]) => {
      const q = questions.find(q => q.id === qId);
      if (!q || !q.weight) return;
      
      Object.entries(q.weight).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          newScores[key] += val[ans === "a" ? 0 : 1];
        }
      });
    });
    setScores(newScores);
    
    // その質問に移動
    const qIndex = questions.findIndex(q => q.id === questionId);
    if (qIndex >= 0) {
      setCurrentIndex(qIndex);
      setShowHistory(false);
    }
  };
  
  const goToNext = (latestAnswers, latestScores) => {
    // 未回答・未スキップの質問を取得
    const currentAnswers = latestAnswers || answers;
    const currentScores = latestScores || scores;
    const unanswered = questions.filter(q => !currentAnswers[q.id] && !skipped.has(q.id));
    
    // 3軸それぞれの僅差チェック
    const frDiff = Math.abs(currentScores.typeA - currentScores.typeB);
    const ioDiff = Math.abs(currentScores.num1 - currentScores.num2);
    const xpDiff = Math.abs(currentScores.cross - currentScores.parallel);
    const frClose = frDiff <= 2;
    const ioClose = ioDiff <= 2;
    const xpClose = xpDiff <= 2;
    
    // 質問が残っていない＆僅差 → 追加質問を投入（1回のみ）
    if (unanswered.length === 0 && (frClose || ioClose || xpClose) && extraQuestionPool.length > 0 && !extraRoundDone) {
      const extraToAdd = [];
      
      if (frClose) {
        const trunkExtras = extraQuestionPool.filter(q => q.cat === "trunk" && !currentAnswers[q.id]);
        extraToAdd.push(...trunkExtras.slice(0, EXTRA_ON_TIE));
      }
      
      if (ioClose) {
        const balanceExtras = extraQuestionPool.filter(q => q.cat === "balance" && !currentAnswers[q.id]);
        extraToAdd.push(...balanceExtras.slice(0, EXTRA_ON_TIE));
      }
      
      if (xpClose) {
        const movementExtras = extraQuestionPool.filter(q => q.cat === "movement" && !currentAnswers[q.id]);
        extraToAdd.push(...movementExtras.slice(0, EXTRA_ON_TIE));
      }
      
      if (extraToAdd.length > 0) {
        const newQuestions = [...questions, ...extraToAdd];
        setQuestions(newQuestions);
        setExtraQuestionPool(prev => prev.filter(q => !extraToAdd.find(e => e.id === q.id)));
        setCurrentIndex(questions.length);
        setExtraRoundDone(true); // 追加は1回のみ
        return;
      }
    }
    
    if (unanswered.length === 0) return;
    
    // 優先すべきカテゴリを決定（僅差の軸から優先）
    let priorityCat = null;
    if (frClose) priorityCat = "trunk";
    else if (ioClose) priorityCat = "balance";
    else if (xpClose) priorityCat = "movement";
    
    // 優先カテゴリの質問を探す
    let nextQuestion = null;
    if (priorityCat) {
      nextQuestion = unanswered.find(q => q.cat === priorityCat);
    }
    
    // なければ順番通り
    if (!nextQuestion) {
      nextQuestion = unanswered[0];
    }
    
    // 質問のインデックスを取得して移動
    const nextIndex = questions.findIndex(q => q.id === nextQuestion.id);
    if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
    }
  };
  
  // 残り質問数
  const remainingQuestions = questions.filter(q => !answers[q.id] && !skipped.has(q.id)).length;
  const isAllDone = remainingQuestions === 0;
  

  const calculateResult = () => {
    // 3軸それぞれ独立判定
    const isF = scores.typeA >= scores.typeB;  // F(前) or R(後)
    const isI = scores.num1 >= scores.num2;    // I(内) or O(外)
    const isX = scores.cross >= scores.parallel; // X(クロス) or II(パラレル)
    
    // 僅差判定
    const frDiff = Math.abs(scores.typeA - scores.typeB);
    const ioDiff = Math.abs(scores.num1 - scores.num2);
    const xpDiff = Math.abs(scores.cross - scores.parallel);
    
    // スペクトラム比率（各軸の優勢側を%で表現）
    const pct = (a, b) => (a + b) === 0 ? 50 : Math.round(a / (a + b) * 100);
    const conf = (a, b) => {
      const total = a + b;
      if (total === 0) return "mixed";
      const ratio = Math.max(a, b) / total;
      if (ratio >= 0.65) return "clear";
      if (ratio >= 0.55) return "leaning";
      return "mixed";
    };
    
    // 8タイプ判定
    let type;
    if (isF && isI && isX) type = "FIX";
    else if (isF && isI && !isX) type = "FIII";
    else if (isF && !isI && isX) type = "FOX";
    else if (isF && !isI && !isX) type = "FOII";
    else if (!isF && isI && isX) type = "RIX";
    else if (!isF && isI && !isX) type = "RIII";
    else if (!isF && !isI && isX) type = "ROX";
    else type = "ROII";
    
    const cadence = scores.high > scores.low ? "high" : "low";
    const posture = scores.open > scores.forward ? "open" : "forward";
    const aggression = scores.aggressive > scores.steady ? "aggressive" : "steady";
    const teamwork = scores.team > scores.solo ? "team" : "solo";
    
    const resultData = {
      type,
      cadence,
      posture,
      aggression,
      teamwork,
      scores: { ...scores },
      answerCount: Object.keys(answers).length,
      savedAt: new Date().toISOString(),
      // 僅差フラグ（3軸それぞれ）— 後方互換
      isClose: {
        fr: frDiff <= 2,
        io: ioDiff <= 2,
        xp: xpDiff <= 2,
        any: frDiff <= 2 || ioDiff <= 2 || xpDiff <= 2,
      },
      scoreDiff: {
        fr: frDiff,
        io: ioDiff,
        xp: xpDiff,
      },
      // NEW: スペクトラム（各軸の比率%）
      spectrum: {
        fr: pct(scores.typeA, scores.typeB),     // F側の%（高い=F寄り）
        io: pct(scores.num1, scores.num2),       // I側の%（高い=I寄り）
        xp: pct(scores.cross, scores.parallel),  // X側の%（高い=X寄り）
      },
      // NEW: 確信度
      confidence: {
        fr: conf(scores.typeA, scores.typeB),
        io: conf(scores.num1, scores.num2),
        xp: conf(scores.cross, scores.parallel),
      },
    };
    
    setResult(resultData);
    
    // LocalStorageに保存
    try {
      localStorage.setItem("stancecore_result", JSON.stringify(resultData));
      setSavedResult(resultData);
      
      // 履歴に追加（Before/After用）
      const historyEntry = {
        ...resultData,
        date: new Date().toISOString(),
      };
      const existingHistory = JSON.parse(localStorage.getItem("stancecore_history") || "[]");
      // 同日の重複回避（同じ日は最新で上書き）
      const today = new Date().toDateString();
      const filtered = existingHistory.filter(h => new Date(h.date).toDateString() !== today);
      filtered.push(historyEntry);
      // 最大10件保持
      const trimmed = filtered.slice(-10);
      localStorage.setItem("stancecore_history", JSON.stringify(trimmed));
      setResultHistory(trimmed);
    } catch (e) {
      console.log("Failed to save result");
    }
    
    // Persistent Storage: タイプ分布に記録 & 取得
    (async () => {
      try {
        // 現在の分布を取得
        let dist = {};
        try {
          const raw = await window.storage.get("type-distribution", true);
          dist = raw ? JSON.parse(raw.value) : {};
        } catch (e) {
          dist = {};
        }
        // このセッションで既に記録済みか確認（重複防止）
        const sessionKey = `voted-${Date.now().toString(36)}`;
        let alreadyVoted = false;
        try {
          const voted = await window.storage.get("my-vote-id");
          if (voted) alreadyVoted = true;
        } catch (e) {}
        
        if (!alreadyVoted) {
          dist[type] = (dist[type] || 0) + 1;
          await window.storage.set("type-distribution", JSON.stringify(dist), true);
          await window.storage.set("my-vote-id", sessionKey);
        }
        
        // 分布データをstateに
        const total = Object.values(dist).reduce((s, v) => s + v, 0);
        setTypeDistribution({ ...dist, total });
      } catch (e) {
        console.log("Storage unavailable, using fallback");
      }
    })();
    
    setMode("result");
  };

  // スタート画面
  if (mode === "start") {
    // 前回の結果を使う関数
    const useSavedResult = () => {
      if (savedResult) {
        setResult(savedResult);
        setMode("result");
        // 分布データも取得
        (async () => {
          try {
            const raw = await window.storage.get("type-distribution", true);
            const dist = raw ? JSON.parse(raw.value) : {};
            const total = Object.values(dist).reduce((s, v) => s + v, 0);
            setTypeDistribution({ ...dist, total });
          } catch (e) {}
        })();
      }
    };
    
    return (
      <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: theme.bg, backgroundColor: theme.bgSolid, padding: "32px 20px" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", animation: "fadeIn 0.5s ease-out" }}>
          {/* ロゴ・ヘッダー */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ 
              display: "inline-flex", 
              padding: 12, 
              borderRadius: 24, 
              background: `${theme.accent}10`,
              border: `1px solid ${theme.accent}15`,
              boxShadow: `0 8px 24px ${theme.accent}15`,
              marginBottom: 20 
            }}>
              {Icons.stanceCore(theme.accent, 64)}
            </div>
            <h1 style={{ color: theme.accent, fontSize: 28, fontWeight: 600, margin: "0 0 4px", letterSpacing: "6px", textTransform: "uppercase" }}>
              STANCE
            </h1>
            <p style={{ color: C.text, fontSize: 18, fontWeight: 500, margin: "0 0 8px", letterSpacing: "4px" }}>
              CORE
            </p>
            <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 500, margin: 0, letterSpacing: "2px", textTransform: "uppercase" }}>
              Body Type Diagnosis
            </p>
          </div>
          
          {/* ストーリーセクション */}
          <Card style={{ marginBottom: 24 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: C.orange, fontSize: 15, fontWeight: 600, margin: "0 0 16px", lineHeight: 1.8 }}>
                「踏め」「いや、回せ」<br/>
                <span style={{ color: C.textMuted, fontSize: 13, fontWeight: 400 }}>
                  人によって真逆のアドバイス...
                </span>
              </p>
              
              <div style={{ 
                width: 40, 
                height: 1, 
                background: theme.cardBorder,
                margin: "0 auto 16px"
              }}/>
              
              <p style={{ color: C.text, fontSize: 14, margin: "0 0 12px", lineHeight: 1.8 }}>
                実は<span style={{ color: C.green, fontWeight: 600 }}>どちらも正解</span>。<br/>
                ただし「その人にとって」は。
              </p>
              
              <p style={{ color: C.textMuted, fontSize: 13, margin: 0, lineHeight: 1.8 }}>
                人には生まれ持った<span style={{ color: C.text, fontWeight: 500 }}>身体の使い方</span>がある。<br/>
                自分のタイプを知れば、もう迷わない。
              </p>
            </div>
          </Card>
          
          {/* STANCE TYPE 理論説明 */}
          <Card style={{ marginBottom: 24, background: `${theme.accent}05`, border: `1px solid ${theme.accent}20` }}>
            <p style={{ 
              color: theme.accent, 
              fontSize: 11, 
              fontWeight: 600, 
              margin: "0 0 16px", 
              letterSpacing: "2px", 
              textTransform: "uppercase",
              textAlign: "center"
            }}>
              Stance Type Theory
            </p>
            
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.9 }}>
              <p style={{ margin: "0 0 12px" }}>
                人は動作の直前、無意識に姿勢を調整している。
                この<span style={{ color: theme.accent, fontWeight: 500 }}>予測的姿勢制御（APA）</span>の傾向は、
                足裏や足首に現れやすい。
              </p>
              
              <p style={{ margin: 0, color: C.textMuted }}>
                STANCE COREは、APAの傾向を4つのタイプに分類し、
                あなたに合った身体の使い方を導き出します。
              </p>
            </div>
          </Card>
          
          {/* リピーター向け：前回の結果カード */}
          {savedResult && (() => {
            const savedTypeInfo = getTypeInfo("cycling", savedResult.type);
            if (!savedTypeInfo) return null;
            return (
            <Card style={{ marginBottom: 20, background: `linear-gradient(135deg, ${savedTypeInfo.color}15, ${savedTypeInfo.color}05)`, border: `1px solid ${savedTypeInfo.color}30` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ 
                  padding: 12, 
                  borderRadius: 14, 
                  background: savedTypeInfo.color + "20",
                  boxShadow: `0 0 15px ${savedTypeInfo.color}30`,
                }}>
                  {Icons.save(savedTypeInfo.color, 20)}
                </div>
                <div>
                  <p style={{ color: C.textDim, fontSize: 10, fontWeight: 600, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Previous Result</p>
                  <p style={{ color: savedTypeInfo.color, fontSize: 18, fontWeight: 800, margin: 0, textShadow: `0 0 10px ${savedTypeInfo.color}50` }}>{savedTypeInfo.name}</p>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={useSavedResult}
                  style={{
                    flex: 1, padding: "14px", borderRadius: 14, border: "none",
                    background: `linear-gradient(135deg, ${savedTypeInfo.color}, ${savedTypeInfo.color}cc)`,
                    color: "#fff",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    boxShadow: `4px 4px 12px ${savedTypeInfo.color}40`,
                  }}
                >
                  結果を見る
                </button>
                <button
                  onClick={() => setMode("quiz")}
                  style={{
                    padding: "14px 20px", borderRadius: 14,
                    border: "none",
                    background: C.bg,
                    color: C.textMuted,
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    ...neu.raised
                  }}
                >
                  再診断
                </button>
              </div>
            </Card>
          );})()}
          
          {/* 初回ユーザー向け */}
          {!savedResult && (
          <>
          <div style={{ textAlign: "center", marginBottom: 20, marginTop: 8 }}>
            <h2 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>この診断でわかること</h2>
            <p style={{ color: theme.accent, fontSize: 12, fontWeight: 500, margin: 0, letterSpacing: "1px" }}>What You'll Discover</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { num: "01", icon: Icons.user, color: "#EC8B8B", label: "体幹タイプ", desc: "F or R" },
              { num: "02", icon: Icons.foot, color: "#7EC8C8", label: "荷重タイプ", desc: "Inner or Outer" },
              { num: "03", icon: Icons.activity, color: "#E8A87C", label: "連動パターン", desc: "クロス or パラレル" },
              { num: "04", icon: Icons.zap, color: "#7EC8A0", label: "メンタル", desc: "攻撃性 & チーム性" },
            ].map(item => (
              <Card key={item.num} style={{ padding: 20, textAlign: "center" }}>
                <p style={{ color: theme.accent, fontSize: 28, fontWeight: 800, margin: "0 0 4px", opacity: 0.7 }}>{item.num}</p>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>{item.label}</p>
                <div style={{ 
                  display: "inline-flex", 
                  padding: 12, 
                  borderRadius: 16, 
                  background: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  marginBottom: 10,
                }}>
                  {item.icon(item.color, 24)}
                </div>
                <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>{item.desc}</p>
              </Card>
            ))}
          </div>
          </>
          )}
          
          {/* 精度説明カード */}
          <Card style={{ marginTop: 4, border: `1.5px solid ${theme.accent}40` }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: C.text, fontSize: 14, fontWeight: 500, margin: "0 0 10px" }}>
                質問に答えるほど精度が上がります
              </p>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <StarRating stars={3} color={C.orange} size={18} />
              </div>
              <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>
                最低5問〜 / 20問で高精度 / いつでも結果を見れます
              </p>
            </div>
          </Card>
          
          {/* 初回ユーザー向けボタン */}
          {!savedResult && (
          <button
            onClick={() => setMode("quiz")}
            style={{
              width: "100%", 
              marginTop: 24, 
              padding: "18px 24px", 
              borderRadius: 50, 
              border: "none",
              background: theme.accentGradient,
              color: "#fff", 
              fontSize: 16, 
              fontWeight: 700, 
              cursor: "pointer",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 10,
              boxShadow: `0 6px 20px ${theme.accent}35`,
              transition: "all 0.3s ease",
            }}
          >
            診断スタート {Icons.stanceCore("#fff", 22)}
          </button>
          )}
        </div>
      </div>
      </>
    );
  }
  
  // クイズ画面
  if (mode === "quiz" && questions.length > 0) {
    const q = questions[currentIndex];
    const accuracy = getAccuracyLevel();
    const progress = Math.min(100, (accuracy.count / 30) * 100);
    const canShowResult = accuracy.count >= 5;
    
    // 全問終了時
    if (isAllDone && canShowResult) {
      return (
        <div style={{ minHeight: "100vh", background: theme.aurora || theme.bg, backgroundColor: theme.bgSolid, padding: "24px 16px" }}>
          <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
            <div style={{ marginBottom: 32, paddingTop: 40 }}>
              <div style={{ display: "inline-flex", padding: 20, borderRadius: "50%", background: `${C.green}15`, marginBottom: 20 }}>
                {Icons.sparkles(C.green, 56)}
              </div>
              <h2 style={{ color: C.text, fontSize: 24, fontWeight: 800, margin: "0 0 8px" }}>
                診断完了！
              </h2>
              <p style={{ color: C.textMuted, fontSize: 15, margin: 0 }}>
                全{QUESTION_POOL.length}問中 {accuracy.count}問に回答しました
              </p>
            </div>
            
            <Card>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <StarRating stars={accuracy.stars} color={accuracy.color} size={24} />
              </div>
              <p style={{ color: accuracy.color, fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{accuracy.label}</p>
              <p style={{ color: C.textDim, fontSize: 13, margin: 0 }}>
                この精度であなたのタイプを診断しました
              </p>
            </Card>
            
            <button
              onClick={calculateResult}
              style={{
                width: "100%", marginTop: 24, padding: "16px", borderRadius: 12, border: "none",
                background: `linear-gradient(135deg, ${C.accent}, ${C.pink})`,
                color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}
            >
              {Icons.sparkles("#fff", 20)} 結果を見る
            </button>
          </div>
        </div>
      );
    }
    
    // 通常のクイズ画面
    if (!q) {
      calculateResult();
      return null;
    }
    
    const catInfo = {
      trunk: { icon: Icons.user(C.pink, 14), label: "体幹" },
      balance: { icon: Icons.foot(C.cyan, 14), label: "荷重" },
      both: { icon: Icons.target(C.accent, 14), label: "総合" },
      cadence: { icon: Icons.activity(C.orange, 14), label: "リズム" },
      posture: { icon: Icons.user(C.green, 14), label: "姿勢" },
      mental_agg: { icon: Icons.zap(C.orange, 14), label: "メンタル" },
      mental_team: { icon: Icons.target(C.accent, 14), label: "チーム" },
    };
    const cat = catInfo[q.cat] || catInfo.trunk;
    
    return (
      <div style={{ minHeight: "100vh", background: theme.aurora || theme.bg, backgroundColor: theme.bgSolid, padding: "24px 20px", position: "relative" }}>
        
        {/* ステージアップ演出 */}
        {stageUp && (
          <div 
            onClick={() => setStageUp(null)}
            style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease-out",
            cursor: "pointer",
          }}>
            <div style={{
              textAlign: "center",
              padding: 40,
              animation: "slideUp 0.5s ease-out",
            }}>
              <div style={{
                marginBottom: 24,
                opacity: 0.9,
              }}>
                {Icons.stanceCore(stageUp.level === 4 ? (stageUp.isClose ? C.orange : C.green) : C.accent, 80)}
              </div>
              <h2 style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "2px",
                margin: "0 0 12px",
                textTransform: "uppercase",
              }}>
                {stageUp.message}
              </h2>
              <p style={{
                color: C.textMuted,
                fontSize: 14,
                margin: 0,
                letterSpacing: "1px",
              }}>
                {stageUp.level === 4 
                  ? (stageUp.isClose 
                      ? "追加質問で精度を上げられます" 
                      : "診断精度が最大になりました")
                  : `LEVEL ${stageUp.level} — ${stageUp.label}`
                }
              </p>
              {stageUp.level === 4 && !stageUp.isClose && (
                <div style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "center",
                  gap: 4,
                }}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: C.green,
                      animation: `pulse 0.6s ease-in-out ${i * 0.1}s infinite`,
                    }} />
                  ))}
                </div>
              )}
              <p style={{ color: C.textDim, fontSize: 12, marginTop: 24, opacity: 0.7 }}>
                タップして続ける
              </p>
            </div>
          </div>
        )}
        
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          {/* 精度メーター（サークルインジケータ） */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ position: "relative", display: "inline-block", width: 120, height: 80 }}>
              <svg width="120" height="80" viewBox="0 0 120 80">
                {/* 背景の弧 */}
                <path d="M 15 70 A 50 50 0 0 1 105 70" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" strokeLinecap="round"/>
                {/* プログレスの弧 */}
                <path d="M 15 70 A 50 50 0 0 1 105 70" fill="none" 
                  stroke={`url(#arcGrad)`} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${progress * 1.42} 200`}/>
                <defs>
                  <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={theme.accent}/>
                    <stop offset="100%" stopColor="#7EC8A0"/>
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
                <p style={{ color: C.textDim, fontSize: 10, margin: "0 0 2px", fontWeight: 600 }}>精度</p>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
                  <StarRating stars={accuracy.stars} color={C.orange} size={10} />
                </div>
              </div>
            </div>
            <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: "4px 0 4px" }}>{accuracy.label}</p>
            <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>回答: {accuracy.count}　|　残り: {remainingQuestions}{extraRoundDone && remainingQuestions > 0 ? "（追加質問）" : ""}</p>
          </div>
          
          {/* 回答履歴パネル */}
          {showHistory && (
            <Card style={{ marginBottom: 16, padding: 16 }}>
              <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: "0 0 12px" }}>
                📋 回答履歴（タップで修正）
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflowY: "auto" }}>
                {Object.entries(answers).map(([qId, ans]) => {
                  const q = QUESTION_POOL.find(qu => qu.id === qId);
                  if (!q) return null;
                  const answerText = ans === "a" ? q.a : q.b;
                  return (
                    <div 
                      key={q.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ 
                          color: C.textMuted, 
                          fontSize: 11, 
                          margin: "0 0 4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {q.q}
                        </p>
                        <p style={{ 
                          color: C.text, 
                          fontSize: 12, 
                          fontWeight: 600, 
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          → {answerText.slice(0, 25)}{answerText.length > 25 ? "..." : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => removeAnswer(q.id)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "none",
                          background: `${C.orange}20`,
                          color: C.orange,
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: "pointer",
                          marginLeft: 8,
                          whiteSpace: "nowrap",
                        }}
                      >
                        修正
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
          
          {/* 質問カード */}
          <Card style={{ 
            transform: showingAnswer ? "scale(0.98)" : "scale(1)",
            opacity: showingAnswer ? 0.9 : 1,
            transition: "all 0.2s ease"
          }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <span style={{ 
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 50,
                border: "1px solid rgba(0,0,0,0.06)",
                marginBottom: 20
              }}>
                {cat.icon}
                <span style={{ color: C.textMuted, fontSize: 11, fontWeight: 600 }}>{cat.label}</span>
              </span>
              <p style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: 0, lineHeight: 1.6 }}>
                {q.q}
              </p>
              {/* 体験型の説明 */}
              {q.type === "action" && q.instruction && (
                <p style={{ color: C.textMuted, fontSize: 14, margin: "12px 0 0", lineHeight: 1.6 }}>
                  {q.instruction}
                </p>
              )}
            </div>
            
            {/* テキスト2択（通常・体験型） */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["a", "b"].map((choice) => {
                const isSelected = answers[q.id] === choice;
                return (
                <button
                  key={choice}
                  onClick={() => handleAnswer(choice)}
                  disabled={showingAnswer}
                  style={{
                    width: "100%", padding: "16px 20px", borderRadius: 16,
                    border: isSelected ? `2px solid ${theme.accent}` : "1.5px solid rgba(0,0,0,0.08)", 
                    background: isSelected ? `${theme.accent}08` : "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    color: C.text, fontSize: 15, fontWeight: 500, 
                    cursor: showingAnswer ? "default" : "pointer",
                    textAlign: "left", transition: "all 0.15s",
                    opacity: showingAnswer ? 0.6 : 1,
                    display: "flex", alignItems: "center", gap: 12,
                    boxShadow: isSelected ? `0 2px 12px ${theme.accent}15` : "0 1px 6px rgba(0,0,0,0.03)",
                  }}
                >
                  {isSelected && (
                    <span style={{ 
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 22, height: 22, borderRadius: "50%", 
                      background: theme.accent, color: "#fff", fontSize: 13, flexShrink: 0,
                    }}>✓</span>
                  )}
                  <span>{q[choice]}</span>
                </button>
                );
              })}
              
              <button
                onClick={handleSkip}
                disabled={showingAnswer}
                style={{
                  width: "100%", padding: "10px", borderRadius: 10, border: "none",
                  background: "transparent", color: C.textDim, fontSize: 12, 
                  cursor: showingAnswer ? "default" : "pointer", marginTop: 4,
                }}
              >
                ピンとこない、スキップ &gt;
              </button>
              
              {/* 前へ / 次へ ナビゲーション */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                <button
                  onClick={() => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); }}
                  disabled={currentIndex === 0}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.6)",
                    color: currentIndex === 0 ? C.textDim : C.text,
                    fontSize: 14, cursor: currentIndex === 0 ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: currentIndex === 0 ? 0.4 : 1,
                    flexShrink: 0,
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={() => {
                    if (answers[q.id]) {
                      if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
                    }
                  }}
                  disabled={!answers[q.id]}
                  style={{
                    flex: 1, padding: "12px", borderRadius: 50,
                    border: "none",
                    background: answers[q.id] ? theme.accentGradient : "rgba(0,0,0,0.06)",
                    color: answers[q.id] ? "#fff" : C.textDim,
                    fontSize: 14, fontWeight: 600, cursor: answers[q.id] ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    boxShadow: answers[q.id] ? `0 3px 12px ${theme.accent}25` : "none",
                  }}
                >
                  次へ <span style={{ fontSize: 16 }}>›</span>
                </button>
              </div>
            </div>
          </Card>
          
          {/* 結果を見るボタン */}
          <div style={{ marginTop: 20 }}>
            {canShowResult ? (
              <button
                onClick={calculateResult}
                style={{
                  width: "100%", padding: "16px", borderRadius: 50,
                  border: "none", 
                  background: theme.accentGradient,
                  color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: `0 4px 16px ${theme.accent}30`,
                }}
              >
                {Icons.sparkles("#fff", 16)} この精度で結果を見る
              </button>
            ) : (
              <Card style={{ textAlign: "center", border: `1.5px solid ${theme.accent}30` }}>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0 }}>
                  あと{5 - accuracy.count}問で結果が見れます
                </p>
              </Card>
            )}
          </div>
          
          <p style={{ color: C.textDim, fontSize: 11, textAlign: "center", marginTop: 12 }}>
            直感で答えてください。正解・不正解はありません。
          </p>
        </div>
      </div>
    );
  }
  
  // 結果画面
  if (mode === "result" && result) {
    const accuracy = getAccuracyLevel();
    const { type, cadence, posture } = result;
    const typeInfo = getTypeInfo(sport, type);
    const TypeIcon = Icons[typeInfo.icon];
    
    
    return (
      <div style={{ minHeight: "100vh", background: theme.aurora || theme.bg, backgroundColor: theme.bgSolid, padding: "24px 16px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          
          {/* タイプカード（レーダーチャート統合） */}
          <Card style={{ 
            textAlign: "center", 
            padding: 32,
          }}>
            {/* 精度表示 */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <StarRating stars={accuracy.stars} color={typeInfo.color} size={18} />
            </div>
            <p style={{ color: C.textMuted, fontSize: 12, margin: "0 0 24px", fontWeight: 500 }}>
              {accuracy.label}（{result.answerCount}問回答）
            </p>
            
            {/* アイコン */}
            <div style={{ 
              display: "inline-flex", 
              padding: 28, 
              borderRadius: "50%", 
              background: typeInfo.color, 
              marginBottom: 20,
              boxShadow: `0 8px 24px ${typeInfo.color}40`,
            }}>
              {TypeIcon && TypeIcon("#fff", 48)}
            </div>
            
            {/* タイプ名 */}
            <h2 style={{ 
              color: typeInfo.color, 
              fontSize: 28, 
              fontWeight: 800, 
              margin: "0 0 6px",
            }}>
              {typeInfo.name}
            </h2>
            
            {/* 3軸表示 */}
            {(() => {
              const isF = type.startsWith("F");
              const isInner = ["FIX", "FIII", "RIX", "RIII"].includes(type);
              const isCross = type.endsWith("X");
              return (
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: 8, 
              marginBottom: 16,
              flexWrap: "wrap"
            }}>
              {/* 体幹 */}
              <div style={{ 
                background: isF ? `${C.orange}15` : `${C.purple}15`,
                border: `1px solid ${isF ? C.orange : C.purple}30`,
                borderRadius: 8, 
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
                <span style={{ color: C.textMuted, fontSize: 11, fontWeight: 600 }}>体幹</span>
                <span style={{ 
                  color: isF ? C.orange : C.purple, 
                  fontSize: 13, 
                  fontWeight: 700 
                }}>
                  {isF ? "Front" : "Rear"}
                </span>
              </div>
              
              {/* 荷重 */}
              <div style={{ 
                background: isInner ? `${C.cyan}15` : `${C.green}15`,
                border: `1px solid ${isInner ? C.cyan : C.green}30`,
                borderRadius: 8, 
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
                <span style={{ color: C.textMuted, fontSize: 11, fontWeight: 600 }}>荷重</span>
                <span style={{ 
                  color: isInner ? C.cyan : C.green, 
                  fontSize: 13, 
                  fontWeight: 700 
                }}>
                  {isInner ? "Inner" : "Outer"}
                </span>
              </div>
              
              {/* 連動 */}
              <div style={{ 
                background: isCross ? `${C.pink}15` : `${"#3B82F6"}15`,
                border: `1px solid ${isCross ? C.pink : "#3B82F6"}30`,
                borderRadius: 8, 
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
                <span style={{ color: C.textMuted, fontSize: 11, fontWeight: 600 }}>連動</span>
                <span style={{ 
                  color: isCross ? C.pink : "#3B82F6", 
                  fontSize: 13, 
                  fontWeight: 700 
                }}>
                  {isCross ? "Cross" : "Parallel"}
                </span>
              </div>
            </div>
              );
            })()}
            
            {/* 説明 */}
            <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, margin: "0 0 24px" }}>
              {typeInfo.description}
            </p>
            
            {/* レーダーチャート（統合） */}
            <div style={{ 
              background: "rgba(255,255,255,0.35)", 
              borderRadius: 16, 
              padding: 16,
              marginTop: 8,
            }}>
              <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                能力バランス
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <RadarChart data={typeInfo.radarData} size={220} color={typeInfo.color} />
              </div>
            </div>

            {/* スペクトラムバー */}
            {result.spectrum && (
            <div style={{ marginTop: 20 }}>
              <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                判定スペクトラム
              </p>
              {[
                { label: ["F（前体幹）", "R（後体幹）"], value: result.spectrum.fr, conf: result.confidence?.fr, colors: [C.orange, C.cyan] },
                { label: ["I（内側荷重）", "O（外側荷重）"], value: result.spectrum.io, conf: result.confidence?.io, colors: [C.green, C.pink] },
                { label: ["X（クロス）", "II（パラレル）"], value: result.spectrum.xp, conf: result.confidence?.xp, colors: [C.pink, "#3B82F6"] },
              ].map((axis, i) => {
                const leftPct = axis.value;
                const rightPct = 100 - axis.value;
                const dominant = leftPct >= 50 ? 0 : 1;
                const confLabel = axis.conf === "clear" ? null : axis.conf === "leaning" ? "やや" : "混合";
                const opacity = axis.conf === "clear" ? 1 : axis.conf === "leaning" ? 0.75 : 0.5;
                return (
                  <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: dominant === 0 ? 700 : 500, color: dominant === 0 ? axis.colors[0] : C.textDim }}>{axis.label[0]}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {confLabel && (
                          <span style={{ 
                            fontSize: 9, fontWeight: 600, 
                            color: axis.conf === "mixed" ? C.orange : C.textMuted,
                            background: axis.conf === "mixed" ? `${C.orange}15` : `${C.textDim}10`,
                            padding: "1px 6px", borderRadius: 8,
                          }}>{confLabel}</span>
                        )}
                        <span style={{ fontSize: 11, fontWeight: dominant === 1 ? 700 : 500, color: dominant === 1 ? axis.colors[1] : C.textDim }}>{axis.label[1]}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", background: `${C.textDim}10` }}>
                      <div style={{ 
                        width: `${leftPct}%`, 
                        background: axis.colors[0], 
                        opacity,
                        borderRadius: "3px 0 0 3px",
                        transition: "width 0.5s ease",
                      }} />
                      <div style={{ 
                        width: `${rightPct}%`, 
                        background: axis.colors[1], 
                        opacity,
                        borderRadius: "0 3px 3px 0",
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                      <span style={{ fontSize: 10, color: C.textDim, fontWeight: 600 }}>{leftPct}%</span>
                      <span style={{ fontSize: 10, color: C.textDim, fontWeight: 600 }}>{rightPct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            {/* タイプ分布 */}
            {(() => {
              const fallback = { FIX: 45, FIII: 38, FOX: 42, FOII: 35, RIX: 40, RIII: 37, ROX: 43, ROII: 36, total: 316 };
              const dist = typeDistribution && typeDistribution.total >= 10 ? typeDistribution : fallback;
              const total = dist.total || Object.values(dist).reduce((s, v) => s + (typeof v === "number" ? v : 0), 0);
              const types = ["FIX", "FIII", "FOX", "FOII", "RIX", "RIII", "ROX", "ROII"];
              const maxCount = Math.max(...types.map(t => dist[t] || 0));
              const myPct = total > 0 ? Math.round((dist[type] || 0) / total * 100) : 12;
              const isReal = typeDistribution && typeDistribution.total >= 10;
              
              return (
              <div style={{ marginTop: 20 }}>
                <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  タイプ分布 {isReal ? `(${total}人)` : ""}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {types.map(t => {
                    const count = dist[t] || 0;
                    const pctVal = total > 0 ? Math.round(count / total * 100) : 12;
                    const barW = maxCount > 0 ? Math.max(4, Math.round(count / maxCount * 100)) : 50;
                    const isMine = t === type;
                    const tInfo = getTypeInfo(sport, t);
                    return (
                      <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ 
                          width: 48, fontSize: 11, fontWeight: isMine ? 800 : 500, textAlign: "right",
                          color: isMine ? tInfo.color : C.textDim,
                        }}>
                          {tInfo.name.split("(")[0].trim()}
                        </span>
                        <div style={{ flex: 1, height: 14, background: `${C.textDim}08`, borderRadius: 7, overflow: "hidden", position: "relative" }}>
                          <div style={{
                            width: `${barW}%`, height: "100%", borderRadius: 7,
                            background: isMine ? tInfo.color : `${C.textDim}25`,
                            transition: "width 0.8s ease",
                          }} />
                        </div>
                        <span style={{ 
                          width: 32, fontSize: 11, fontWeight: isMine ? 700 : 500,
                          color: isMine ? tInfo.color : C.textDim, textAlign: "right",
                        }}>
                          {pctVal}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p style={{ color: C.textDim, fontSize: 10, margin: "8px 0 0", textAlign: "center" }}>
                  {isReal 
                    ? `あなたの${getTypeInfo(sport, type).name}は全体の${myPct}%`
                    : "※ データ蓄積中のため参考値です"
                  }
                </p>
              </div>
              );
            })()}
            
            {/* シェア・パーマリンク */}
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => {
                    generateShareImage(typeInfo, type, result.spectrum, result.confidence).then(dataUrl => {
                      setShareImageUrl(dataUrl);
                    }).catch(() => {});
                  }}
                  style={{
                    flex: 1, padding: "12px 16px", borderRadius: 12, border: `1px solid ${theme.cardBorder}`,
                    background: C.bg, color: C.text, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    ...neu.raised,
                  }}
                >
                  {Icons.download(C.textMuted, 16)}
                  画像を生成
                </button>
                <button
                  onClick={() => {
                    const text = `STANCE COREで診断したら「${type}」タイプでした！\n${typeInfo.description}\n\n${window.location.origin}`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  style={{
                    flex: 1, padding: "12px 16px", borderRadius: 12, border: "none",
                    background: typeInfo.color, color: "#fff", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  Xでシェア
                </button>
              </div>
              
              {/* パーマリンクコピー */}
              <button
                onClick={() => {
                  const sp = result.spectrum || { fr: 50, io: 50, xp: 50 };
                  const url = `${window.location.origin}?t=${type}&fr=${sp.fr}&io=${sp.io}&xp=${sp.xp}`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(url).then(() => {
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }).catch(() => {
                      prompt("URLをコピーしてください:", url);
                    });
                  } else {
                    prompt("URLをコピーしてください:", url);
                  }
                }}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  border: `1px solid ${copiedLink ? typeInfo.color : theme.cardBorder}`,
                  background: copiedLink ? `${typeInfo.color}10` : C.bg,
                  color: copiedLink ? typeInfo.color : C.textMuted, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.3s ease",
                }}
              >
                {copiedLink ? "✓ コピーしました！" : "結果のリンクをコピー（フィッターに共有）"}
              </button>
            </div>
            
            {/* シェア画像プレビュー */}
            {shareImageUrl && (
              <div style={{ marginTop: 16 }}>
                <div style={{ 
                  background: "#111", borderRadius: 12, overflow: "hidden",
                  border: `1px solid ${theme.cardBorder}`,
                }}>
                  <img 
                    src={shareImageUrl} 
                    alt="シェア画像" 
                    style={{ width: "100%", display: "block" }} 
                  />
                </div>
                <p style={{ color: C.textDim, fontSize: 11, textAlign: "center", margin: "8px 0 0" }}>
                  画像を長押しして保存できます
                </p>
                <button
                  onClick={() => setShareImageUrl(null)}
                  style={{
                    width: "100%", marginTop: 8, padding: "10px", borderRadius: 10,
                    border: `1px solid ${theme.cardBorder}`, background: C.bg,
                    color: C.textMuted, fontSize: 12, cursor: "pointer",
                  }}
                >
                  閉じる
                </button>
              </div>
            )}
          </Card>
          
          {/* Before/After 比較 */}
          {resultHistory.length >= 2 && (() => {
            const current = resultHistory[resultHistory.length - 1];
            const prev = resultHistory[resultHistory.length - 2];
            const prevDate = new Date(prev.date);
            const dateStr = `${prevDate.getMonth() + 1}/${prevDate.getDate()}`;
            const axes = [
              { label: "F / R", key: "fr", colors: ["#FF6B35", "#06B6D4"], leftLabel: "F", rightLabel: "R" },
              { label: "I / O", key: "io", colors: ["#10B981", "#EC4899"], leftLabel: "I", rightLabel: "O" },
              { label: "X / II", key: "xp", colors: ["#EC4899", "#3B82F6"], leftLabel: "X", rightLabel: "II" },
            ];
            const typeChanged = current.type !== prev.type;
            
            return (
            <>
            <div onClick={() => setShowComparison(!showComparison)} style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", cursor: "pointer", background: theme.card, border: `1px solid ${theme.cardBorder}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {Icons.activity(typeInfo.color, 20)}
                <span style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>前回との比較</span>
                {typeChanged && (
                  <span style={{ background: `${C.orange}20`, color: C.orange, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8 }}>
                    タイプ変化
                  </span>
                )}
              </div>
              <span style={{ color: C.textDim }}>{showComparison ? "▲" : "▼"}</span>
            </div>
            {showComparison && (
            <Card style={{ marginTop: 0, borderTop: "none" }}>
              {/* タイプ変化 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: C.textDim, fontSize: 10, margin: "0 0 4px" }}>{dateStr}</p>
                  <span style={{ 
                    background: typeChanged ? `${getTypeInfo("cycling", prev.type).color}15` : `${C.textDim}10`,
                    color: typeChanged ? getTypeInfo("cycling", prev.type).color : C.textMuted,
                    fontSize: 18, fontWeight: 800, padding: "6px 14px", borderRadius: 10,
                  }}>
                    {prev.type}
                  </span>
                </div>
                <span style={{ color: C.textDim, fontSize: 20 }}>→</span>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: C.textDim, fontSize: 10, margin: "0 0 4px" }}>今回</p>
                  <span style={{ 
                    background: `${typeInfo.color}15`, color: typeInfo.color,
                    fontSize: 18, fontWeight: 800, padding: "6px 14px", borderRadius: 10,
                  }}>
                    {current.type}
                  </span>
                </div>
              </div>
              
              {/* スペクトラム差分 */}
              {axes.map(axis => {
                const curVal = current.spectrum?.[axis.key] ?? 50;
                const prevVal = prev.spectrum?.[axis.key] ?? 50;
                const diff = curVal - prevVal;
                return (
                  <div key={axis.key} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted }}>{axis.label}</span>
                      {diff !== 0 && (
                        <span style={{ 
                          fontSize: 11, fontWeight: 700,
                          color: Math.abs(diff) >= 10 ? C.orange : C.textMuted,
                        }}>
                          {diff > 0 ? `${axis.leftLabel} +${diff}` : `${axis.rightLabel} +${Math.abs(diff)}`}
                        </span>
                      )}
                    </div>
                    {/* 前回バー（薄い） */}
                    <div style={{ position: "relative", height: 20 }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, display: "flex", borderRadius: 4, overflow: "hidden", background: `${C.textDim}10` }}>
                        <div style={{ width: `${prevVal}%`, background: axis.colors[0], opacity: 0.25 }} />
                        <div style={{ width: `${100 - prevVal}%`, background: axis.colors[1], opacity: 0.25 }} />
                      </div>
                      {/* 今回バー */}
                      <div style={{ position: "absolute", top: 10, left: 0, right: 0, height: 8, display: "flex", borderRadius: 4, overflow: "hidden", background: `${C.textDim}10` }}>
                        <div style={{ width: `${curVal}%`, background: axis.colors[0], opacity: 0.85, transition: "width 0.5s ease" }} />
                        <div style={{ width: `${100 - curVal}%`, background: axis.colors[1], opacity: 0.85, transition: "width 0.5s ease" }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                      <span style={{ fontSize: 9, color: C.textDim }}>{prevVal}% → {curVal}%</span>
                      <span style={{ fontSize: 9, color: C.textDim }}>{100 - prevVal}% → {100 - curVal}%</span>
                    </div>
                  </div>
                );
              })}
              
              <p style={{ color: C.textDim, fontSize: 10, textAlign: "center", margin: "8px 0 0" }}>
                上段: 前回（{dateStr}） / 下段: 今回
              </p>
            </Card>
            )}
            </>
            );
          })()}
          
          {result.confidence && Object.values(result.confidence).some(c => c !== "clear") && remainingQuestions > 0 && (
            <Card style={{ 
              marginTop: 16, 
              background: `${C.orange}08`,
              border: `1px solid ${C.orange}`,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                {Icons.alertTriangle(C.orange, 20)}
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.orange, fontSize: 14, fontWeight: 700, margin: "0 0 8px" }}>
                    判定にブレがあります
                  </p>
                  <p style={{ color: C.text, fontSize: 13, margin: "0 0 6px", lineHeight: 1.6 }}>
                    {[
                      result.confidence?.fr !== "clear" && "体幹（F/R）",
                      result.confidence?.io !== "clear" && "荷重（I/O）",
                      result.confidence?.xp !== "clear" && "連動（X/II）",
                    ].filter(Boolean).join("・")}
                    の判定が僅差です。追加回答で精度が上がります。
                  </p>
                  <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 12px", lineHeight: 1.5 }}>
                    ※ 僅差は「両方の特性を持つ」サインかもしれません。全問回答後にスペクトラムで確認できます。
                  </p>
                  <button
                    onClick={() => {
                      setMode("quiz");
                      setStageUp(null);
                      setPrevAccuracyLevel(Math.min(3, prevAccuracyLevel));
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "none",
                      background: C.orange,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: "1px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    追加の質問に回答する（残り{remainingQuestions}問）
                  </button>
                </div>
              </div>
            </Card>
          )}
          
          {/* 僅差だが全質問終了 → スペクトラム解説 */}
          {result.confidence && Object.values(result.confidence).some(c => c !== "clear") && remainingQuestions === 0 && (
            <Card style={{ 
              marginTop: 16, 
              background: `${C.accent}08`,
              border: `1px solid ${C.accent}`,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                {Icons.check(C.accent, 20)}
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.accent, fontSize: 14, fontWeight: 600, margin: "0 0 8px", letterSpacing: "1px" }}>
                    複数の特性を持つタイプ
                  </p>
                  <p style={{ color: C.text, fontSize: 13, margin: "0 0 8px", lineHeight: 1.6 }}>
                    あなたは{[
                      result.confidence?.fr === "mixed" && "体幹（F/R）",
                      result.confidence?.io === "mixed" && "荷重（I/O）",
                      result.confidence?.xp === "mixed" && "連動（X/II）",
                    ].filter(Boolean).join("・") || [
                      result.confidence?.fr === "leaning" && "体幹（F/R）",
                      result.confidence?.io === "leaning" && "荷重（I/O）",
                      result.confidence?.xp === "leaning" && "連動（X/II）",
                    ].filter(Boolean).join("・")}の軸で両方の特性を持っています。
                  </p>
                  <p style={{ color: C.textMuted, fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                    これは珍しいことではありません。場面やコンディションで異なる特性が出ることがあります。
                    上のスペクトラムバーを参考に、メインのアドバイスを軸にしつつ、反対側の感覚も試してみてください。
                  </p>
                </div>
              </div>
            </Card>
          )}
          
          {/* だから納得セクション（改善版） */}
          <Card style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              {Icons.sparkles(typeInfo.color, 18)}
              <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0 }}>だから納得</p>
            </div>
            
            <p style={{ color: C.text, fontSize: 14, margin: "0 0 20px", lineHeight: 1.7 }}>
              こんな経験、ありませんか？
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* 過去のあるある */}
              <div style={{ 
                background: `${typeInfo.color}12`, 
                borderRadius: 16, 
                padding: 16,
                border: `1px solid ${typeInfo.color}25`,
              }}>
                <p style={{ color: typeInfo.color, fontSize: 13, fontWeight: 700, margin: "0 0 10px" }}>
                  こう言われて困惑したことは？
                </p>
                <p style={{ color: C.text, fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                  {(type === "FIX" || type === "FOX") && "「もっと腰を安定させて」「後ろ体重で粘って」と言われても、なんかしっくりこなかった"}
                  {(type === "FIII" || type === "FOII") && "「腰をもっと回して」「捻りを使え」と言われても、動きがギクシャクした"}
                  {(type === "RIX" || type === "ROX") && "「前傾でアグレッシブに」「軽やかに」と言われても、バランスを崩しやすかった"}
                  {(type === "RIII" || type === "ROII") && "「もっとダイナミックに」「捻りを使え」と言われても、動きがぎこちなかった"}
                </p>
              </div>
              
              {/* 本当の理由 */}
              <div style={{ 
                background: C.green + "15", 
                borderRadius: 16, 
                padding: 16,
                border: `1px solid ${C.green}30`,
              }}>
                <p style={{ color: C.green, fontSize: 13, fontWeight: 700, margin: "0 0 10px" }}>
                  ✓ それは、あなたの身体に合わなかっただけ
                </p>
                <p style={{ color: C.text, fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                  {type === "FIX" && "あなたは「捻りながら内側で踏む」のが自然。対角連動で加速するタイプ。"}
                  {type === "FIII" && "あなたは「安定して内側で踏む」のが自然。効率的なペダリングが武器。"}
                  {type === "FOX" && "あなたは「捻りながら外側で踏む」のが自然。パワフルなダンシングが得意。"}
                  {type === "FOII" && "あなたは「安定して外側で踏む」のが自然。粘り強いクライムが持ち味。"}
                  {type === "RIX" && "あなたは「後体幹でクロス連動」が自然。リズミカルな走りが武器。"}
                  {type === "RIII" && "あなたは「後体幹で安定」が自然。効率的でスムーズな走りが得意。"}
                  {type === "ROX" && "あなたは「後体幹でクロス連動」が自然。あらゆる状況に適応できる。"}
                  {type === "ROII" && "あなたは「後体幹で安定」が自然。どっしりした安定感が持ち味。"}
                </p>
              </div>
              
              {/* 今後のヒント */}
              <div style={{ 
                background: "rgba(255,255,255,0.35)", 
                borderRadius: 16, 
                padding: 16,
              }}>
                <p style={{ color: C.textMuted, fontSize: 13, fontWeight: 700, margin: "0 0 10px" }}>
                  これからのアドバイス
                </p>
                <p style={{ color: C.text, fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                  {type === "FIX" && "「高回転で」「瞬発力で勝負」「ダンシングでバイクを振る」を意識して。"}
                  {type === "FIII" && "「滑らかに」「一定ペースで」「効率重視」を意識すると力が出せます。"}
                  {type === "FOX" && "「ダンシングでアタック」「独走で逃げる」「パワー勝負」が合うはず。"}
                  {type === "FOII" && "「じっくり粘れ」「重いギアでグイグイ」「マイペース」が合うはず。"}
                  {type === "RIX" && "「リズムを大切に」「変化に対応」「ダンシングも活用」がおすすめ。"}
                  {type === "RIII" && "「滑らかに」「一定ペースで」「効率重視」を意識すると本来の力が出せます。"}
                  {type === "ROX" && "「適応力を活かして」「状況判断」「バランスよく」がおすすめ。"}
                  {type === "ROII" && "「安定感を活かして」「マイペース」「ロングで力を発揮」がおすすめ。"}
                </p>
              </div>
            </div>
          </Card>
          
          
          {/* 動作ガイド */}
          {(() => { const mg = MOTION_GUIDE[type]; if (!mg) return null; return (
          <>
          <div onClick={() => tog('motion')} style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", cursor: "pointer", background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: openSections.motion ? "20px 20px 0 0" : 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {Icons.activity(typeInfo.color, 20)}
              <span style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>動作ガイド</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#fff", background: theme.accentGradient, padding: "2px 8px", borderRadius: 10 }}>NEW</span>
            </div>
            <span style={{ color: C.textDim }}>{openSections.motion ? "▲" : "▼"}</span>
          </div>
          {openSections.motion && (
          <Card style={{ marginTop: 0, borderTop: "none", borderRadius: "0 0 20px 20px" }}>
            <p style={{ color: C.textMuted, fontSize: 12, margin: "0 0 16px", lineHeight: 1.6 }}>
              {typeInfo.name}タイプの自然な身体の使い方。あなたのタイプではこう動くのが最も効率的。
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {["dancing","cornering","hillclimb","braking","sprint"].map(key => {
                const g = mg[key]; if (!g) return null;
                const isOpen = openChecks[`mg_${key}`];
                return (
                <div key={key} style={{ background: "rgba(255,255,255,0.35)", borderRadius: 14, overflow: "hidden" }}>
                  <div 
                    onClick={(e) => { e.stopPropagation(); setOpenChecks(prev => ({ ...prev, [`mg_${key}`]: !prev[`mg_${key}`] })); }}
                    style={{ padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <span style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{g.title}</span>
                    <span style={{ color: C.textDim, fontSize: 10 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                  {isOpen && (
                  <div style={{ padding: "0 16px 14px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                      {g.moves.map((m, i) => (
                        <div key={i} style={{ padding: "8px 12px", background: `${C.green}08`, borderLeft: `3px solid ${C.green}40`, borderRadius: 6 }}>
                          <span style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>✓ {m}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "8px 12px", background: `${C.orange}08`, borderLeft: `3px solid ${C.orange}40`, borderRadius: 6 }}>
                      <span style={{ color: C.orange, fontSize: 11, fontWeight: 700 }}>よくある間違い: </span>
                      <span style={{ color: C.textMuted, fontSize: 12, lineHeight: 1.5 }}>{g.mistake}</span>
                    </div>
                  </div>
                  )}
                </div>
                );
              })}
            </div>
          </Card>
          )}
          </>
          );})()}

          {/* 特性 */}
          <Card style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              {Icons.check(C.green, 20)}
              <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0 }}>あなたの特性</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {typeInfo.traits.map((trait, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "theme.bg", borderRadius: 10, padding: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: typeInfo.color }} />
                  <p style={{ color: C.text, fontSize: 14, margin: 0 }}>{trait}</p>
                </div>
              ))}
            </div>
          </Card>
          
          {/* リズム・姿勢傾向 */}
          <Card style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              {Icons.activity(C.pink, 20)}
              <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0 }}>ペダリング・姿勢傾向</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "theme.bg", borderRadius: 12, padding: 14, textAlign: "center" }}>
                <div style={{ marginBottom: 8 }}>{cadence === "high" ? Icons.rotate(C.cyan, 28) : Icons.zap(C.orange, 28)}</div>
                <p style={{ color: cadence === "high" ? C.cyan : C.orange, fontSize: 14, fontWeight: 700, margin: "0 0 2px" }}>
                  {cadence === "high" ? "高回転型" : "トルク型"}
                </p>
                <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>
                  {cadence === "high" ? "90rpm+で軽快に回す" : "重めのギアで力強く踏む"}
                </p>
                <p style={{ color: C.textMuted, fontSize: 10, margin: "6px 0 0", borderTop: `1px solid ${C.textDim}20`, paddingTop: 6 }}>
                  {typeInfo.name}推奨: {typeInfo.form.cadence.type}
                </p>
              </div>
              <div style={{ background: "theme.bg", borderRadius: 12, padding: 14, textAlign: "center" }}>
                <div style={{ marginBottom: 8 }}>{posture === "open" ? Icons.user(C.green, 28) : Icons.activity(C.accent, 28)}</div>
                <p style={{ color: posture === "open" ? C.green : C.accent, fontSize: 14, fontWeight: 700, margin: "0 0 2px" }}>
                  {posture === "open" ? "アップライト型" : "前傾型"}
                </p>
                <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>
                  {posture === "open" ? "上体を起こして安定重視" : "深い前傾でエアロ重視"}
                </p>
                <p style={{ color: C.textMuted, fontSize: 10, margin: "6px 0 0", borderTop: `1px solid ${C.textDim}20`, paddingTop: 6 }}>
                  {typeInfo.name}推奨: {typeInfo.form.posture.type}
                </p>
              </div>
            </div>
            {/* 個人傾向とタイプ推奨のミスマッチ補足 */}
            {(() => {
              const typeCadHigh = typeInfo.form.cadence.type.includes("85") || typeInfo.form.cadence.type.includes("90") || typeInfo.form.cadence.type.includes("95");
              const mismatchCad = (cadence === "high" && !typeCadHigh) || (cadence === "low" && typeCadHigh);
              const typePosOpen = typeInfo.form.posture.type.includes("後ろ") || typeInfo.form.posture.type.includes("ニュートラル");
              const mismatchPos = (posture === "open" && !typePosOpen) || (posture === "forward" && typePosOpen);
              if (!mismatchCad && !mismatchPos) return null;
              return (
                <div style={{ marginTop: 12, padding: 12, background: `${C.cyan}06`, border: `1px solid ${C.cyan}15`, borderRadius: 10 }}>
                  <p style={{ color: C.cyan, fontSize: 11, fontWeight: 700, margin: "0 0 4px" }}>個人傾向とタイプの違いについて</p>
                  {mismatchCad && (
                    <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 4px", lineHeight: 1.5 }}>
                      あなたは{cadence === "high" ? "高回転" : "トルク"}傾向ですが、{typeInfo.name}タイプでは{typeInfo.form.cadence.type}が力を活かしやすいとされています。タイプ推奨を試してみると新しい発見があるかも。
                    </p>
                  )}
                  {mismatchPos && (
                    <p style={{ color: C.textMuted, fontSize: 11, margin: 0, lineHeight: 1.5 }}>
                      姿勢の傾向がタイプ推奨と異なります。動作ガイドのフォーム解説も参考にしてみてください。
                    </p>
                  )}
                </div>
              );
            })()}
          </Card>
          
          {/* メンタル傾向 */}
          <Card style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              {Icons.sparkles(C.accent, 20)}
              <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0 }}>メンタル傾向</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "theme.bg", borderRadius: 12, padding: 14, textAlign: "center" }}>
                <div style={{ marginBottom: 8 }}>{result.aggression === "aggressive" ? Icons.zap(C.orange, 28) : Icons.target(C.cyan, 28)}</div>
                <p style={{ color: result.aggression === "aggressive" ? C.orange : C.cyan, fontSize: 14, fontWeight: 700, margin: "0 0 2px" }}>
                  {result.aggression === "aggressive" ? "アグレッシブ" : "ステディ"}
                </p>
                <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>
                  {result.aggression === "aggressive" ? "攻め・飛び出し型" : "堅実・確実型"}
                </p>
              </div>
              <div style={{ background: "theme.bg", borderRadius: 12, padding: 14, textAlign: "center" }}>
                <div style={{ marginBottom: 8 }}>{result.teamwork === "solo" ? Icons.user(C.pink, 28) : Icons.target(C.green, 28)}</div>
                <p style={{ color: result.teamwork === "solo" ? C.pink : C.green, fontSize: 14, fontWeight: 700, margin: "0 0 2px" }}>
                  {result.teamwork === "solo" ? "ソロ型" : "チーム型"}
                </p>
                <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>
                  {result.teamwork === "solo" ? "単独で力を発揮" : "集団で活きる"}
                </p>
              </div>
            </div>
          </Card>
          
          {/* 得意・苦手 */}
          <Card style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              {Icons.trophy(C.orange, 20)}
              <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0 }}>得意 & 苦手</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                {Icons.check(C.green, 14)}
                <p style={{ color: C.green, fontSize: 13, fontWeight: 600, margin: 0 }}>得意なこと</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {typeInfo.strengths.map((s, i) => (
                  <span key={i} style={{ background: `${C.green}18`, color: C.green, fontSize: 13, padding: "6px 12px", borderRadius: 20 }}>{s}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                {Icons.alertTriangle(C.orange, 14)}
                <p style={{ color: C.orange, fontSize: 13, fontWeight: 600, margin: 0 }}>苦手になりやすい</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {typeInfo.weaknesses.map((w, i) => (
                  <span key={i} style={{ background: `${C.orange}18`, color: C.orange, fontSize: 13, padding: "6px 12px", borderRadius: 20 }}>{w}</span>
                ))}
              </div>
            </div>
          </Card>

          {/* コンプレッション・フィッティング */}
          {(() => { const cf = COMPRESSION_FITTING[type]; if (!cf) return null; return (
          <>
          <div onClick={() => tog('compress')} style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", cursor: "pointer", background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: openSections.compress ? "20px 20px 0 0" : 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {Icons.target(typeInfo.color, 20)}
              <span style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>コンプレッション・フィッティング</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#fff", background: theme.accentGradient, padding: "2px 8px", borderRadius: 10 }}>NEW</span>
            </div>
            <span style={{ color: C.textDim }}>{openSections.compress ? "▲" : "▼"}</span>
          </div>
          {openSections.compress && (
          <Card style={{ marginTop: 0, borderTop: "none", borderRadius: "0 0 20px 20px" }}>
            <p style={{ color: C.textMuted, fontSize: 12, margin: "0 0 6px", lineHeight: 1.6 }}>
              適度な制約が最適なパフォーマンスを引き出す — Constraints-Led Approach に基づくセルフフィッティング。
            </p>
            <p style={{ color: theme.accent, fontSize: 11, fontWeight: 600, margin: "0 0 16px" }}>
              調整は1箇所ずつ、2-3mmずつ。1週間は同じ設定で乗ること。
            </p>
            
            {[
              { key: "cleat", label: "クリート", icon: Icons.foot, items: [
                { label: "前後位置", value: cf.cleat.position },
                { label: "角度", value: cf.cleat.angle, highlight: true },
                { label: "Qファクター", value: cf.cleat.qfactor },
              ], compression: cf.cleat.compression },
              { key: "saddle", label: "サドル", icon: Icons.user, items: [
                { label: "高さ", value: cf.saddle.height },
                { label: "前後位置", value: cf.saddle.position },
              ], compression: cf.saddle.compression },
              { key: "handlebar", label: "ハンドル", icon: Icons.settings, items: [
                { label: "落差", value: cf.handlebar.drop },
                { label: "リーチ", value: cf.handlebar.reach },
                { label: "幅", value: cf.handlebar.width },
              ], compression: cf.handlebar.compression },
              { key: "control", label: "操作系", icon: Icons.zap, items: [
                { label: "ブレーキ", value: cf.brake },
                { label: "グリップ", value: cf.grip },
              ]},
            ].map(section => (
              <div key={section.key} style={{ background: "rgba(255,255,255,0.35)", borderRadius: 14, padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  {section.icon(typeInfo.color, 16)}
                  <span style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{section.label}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {section.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < section.items.length - 1 ? `1px solid rgba(0,0,0,0.04)` : "none" }}>
                      <span style={{ color: C.textMuted, fontSize: 12 }}>{item.label}</span>
                      <span style={{ color: item.highlight ? typeInfo.color : C.text, fontSize: 13, fontWeight: item.highlight ? 700 : 600, textAlign: "right", maxWidth: "60%" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                {section.compression && (
                  <div style={{ marginTop: 8, padding: "8px 10px", background: `${theme.accent}08`, borderRadius: 8, borderLeft: `3px solid ${theme.accent}30` }}>
                    <span style={{ color: theme.accent, fontSize: 11, fontWeight: 600 }}>Compression: </span>
                    <span style={{ color: C.textMuted, fontSize: 11 }}>{section.compression}</span>
                  </div>
                )}
              </div>
            ))}
            
            <div style={{ marginTop: 8, padding: "10px 14px", background: `${C.orange}08`, borderRadius: 10, border: `1px solid ${C.orange}15` }}>
              <p style={{ color: C.orange, fontSize: 12, fontWeight: 700, margin: "0 0 4px" }}>⚠ やりすぎのサイン</p>
              <p style={{ color: C.textMuted, fontSize: 11, margin: 0, lineHeight: 1.6 }}>
                膝に痛み→クリートかサドル高を見直す / 手が痺れる→落差かリーチを見直す / 腰が痛い→サドル前後を見直す
              </p>
            </div>
          </Card>
          )}
          </>
          );})()}
          
          {/* フィッティング数値計算（コンプレッション・フィッティングの数値ツール） */}
          {typeInfo.fitting && (
          <Card style={{ marginTop: 8, borderRadius: "0 0 20px 20px", borderTop: `1px dashed ${theme.accent}30` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {Icons.target(typeInfo.color, 20)}
                <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0 }}>数値ガイド</p>
              </div>
              <span style={{ background: `${typeInfo.color}22`, color: typeInfo.color, fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 12 }}>
                {typeInfo.name}
              </span>
            </div>
            
            {/* モード切替 */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button
                onClick={() => setShowFittingCalc("simple")}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: C.bg,
                  cursor: "pointer",
                  ...(showFittingCalc === "simple" ? neu.pressed : neu.raised),
                  color: showFittingCalc === "simple" ? typeInfo.color : C.textMuted,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                🔧 現在値から調整
              </button>
              <button
                onClick={() => setShowFittingCalc("detail")}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: C.bg,
                  cursor: "pointer",
                  ...(showFittingCalc === "detail" ? neu.pressed : neu.raised),
                  color: showFittingCalc === "detail" ? typeInfo.color : C.textMuted,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                股下から計算
              </button>
            </div>
            
            {/* ===== 簡易モード: 現在値から調整 ===== */}
            {showFittingCalc === "simple" && (
            <>
              <div style={{ background: C.bg, borderRadius: 16, padding: 16, marginBottom: 16, ...neu.pressedSm }}>
                <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: "0 0 12px" }}>現在のセッティング</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ color: C.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>サドル高 (mm)</label>
                    <input
                      type="number"
                      placeholder="720"
                      value={bodyMetrics.currentSaddleHeight || ""}
                      onChange={(e) => setBodyMetrics({...bodyMetrics, currentSaddleHeight: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "none",
                        background: C.bg,
                        color: C.text,
                        fontSize: 16,
                        fontWeight: 700,
                        ...neu.pressed,
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ color: C.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>クランク長 (mm)</label>
                      <select
                        value={bodyMetrics.currentCrank || ""}
                        onChange={(e) => setBodyMetrics({...bodyMetrics, currentCrank: e.target.value})}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: "none",
                          background: C.bg,
                          color: C.text,
                          fontSize: 14,
                          fontWeight: 700,
                          ...neu.pressed,
                        }}
                      >
                        <option value="">選択</option>
                        <option value="165">165mm</option>
                        <option value="167.5">167.5mm</option>
                        <option value="170">170mm</option>
                        <option value="172.5">172.5mm</option>
                        <option value="175">175mm</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ color: C.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>ハンドル落差 (mm)</label>
                      <input
                        type="number"
                        placeholder="-30"
                        value={bodyMetrics.currentDrop || ""}
                        onChange={(e) => setBodyMetrics({...bodyMetrics, currentDrop: e.target.value})}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: "none",
                          background: C.bg,
                          color: C.text,
                          fontSize: 16,
                          fontWeight: 700,
                          ...neu.pressed,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 調整アドバイス */}
              {bodyMetrics.currentSaddleHeight && (() => {
                const currentSaddle = parseFloat(bodyMetrics.currentSaddleHeight);
                const currentCrank = parseFloat(bodyMetrics.currentCrank) || 170;
                const currentDrop = parseFloat(bodyMetrics.currentDrop) || -30;
                
                // 8タイプ別の推奨傾向（数値ベースでブレンド可能に）
                const adviceNumeric = {
                  FIX:  { saddleMin: 5,   saddleMax: 15,  dropMin: -60, dropMax: -40, setbackMin: 5,   setbackMax: 15,  setbackDir: "前", crankMin: 165, crankMax: 167.5 },
                  FIII: { saddleMin: 5,   saddleMax: 10,  dropMin: -50, dropMax: -30, setbackMin: 0,   setbackMax: 10,  setbackDir: "前", crankMin: 165, crankMax: 167.5 },
                  FOX:  { saddleMin: -5,  saddleMax: 5,   dropMin: -55, dropMax: -35, setbackMin: 0,   setbackMax: 10,  setbackDir: "前", crankMin: 165, crankMax: 170 },
                  FOII: { saddleMin: -5,  saddleMax: 5,   dropMin: -45, dropMax: -25, setbackMin: 0,   setbackMax: 10,  setbackDir: "前", crankMin: 165, crankMax: 170 },
                  RIX:  { saddleMin: -5,  saddleMax: 5,   dropMin: -45, dropMax: -25, setbackMin: 0,   setbackMax: 5,   setbackDir: "後", crankMin: 165, crankMax: 170 },
                  RIII: { saddleMin: 5,   saddleMax: 10,  dropMin: -50, dropMax: -30, setbackMin: 0,   setbackMax: 0,   setbackDir: "中", crankMin: 165, crankMax: 170 },
                  ROX:  { saddleMin: -10, saddleMax: -5,  dropMin: -30, dropMax: -10, setbackMin: 5,   setbackMax: 15,  setbackDir: "後", crankMin: 167.5, crankMax: 170 },
                  ROII: { saddleMin: -15, saddleMax: -5,  dropMin: -25, dropMax: -5,  setbackMin: 10,  setbackMax: 20,  setbackDir: "後", crankMin: 167.5, crankMax: 172.5 },
                };
                
                // スペクトラムに基づくブレンド
                const sp = result.spectrum || { fr: 50, io: 50, xp: 50 };
                const conf = result.confidence || { fr: "clear", io: "clear", xp: "clear" };
                
                // タイプ文字列を軸ごとに分解してブレンド対象を特定
                // type = "FIX" → F/R軸のペア: "RIX", I/O軸のペア: "FOX", X/II軸のペア: "FIII"
                const flipAxis = (t, axis) => {
                  if (axis === "fr") {
                    return t[0] === "F" ? "R" + t.slice(1) : "F" + t.slice(1);
                  }
                  if (axis === "io") {
                    // I↔O: FIX↔FOX, FIII↔FOII, RIX↔ROX, RIII↔ROII
                    const map = { FIX:"FOX", FOX:"FIX", FIII:"FOII", FOII:"FIII", RIX:"ROX", ROX:"RIX", RIII:"ROII", ROII:"RIII" };
                    return map[t] || t;
                  }
                  if (axis === "xp") {
                    // X↔II: FIX↔FIII, FOX↔FOII, RIX↔RIII, ROX↔ROII
                    const map = { FIX:"FIII", FIII:"FIX", FOX:"FOII", FOII:"FOX", RIX:"RIII", RIII:"RIX", ROX:"ROII", ROII:"ROX" };
                    return map[t] || t;
                  }
                  return t;
                };
                
                // 加重平均ヘルパー
                const blend = (valA, valB, ratioA) => {
                  const r = ratioA / 100;
                  return Math.round(valA * r + valB * (1 - r)); // 1mm単位
                };
                
                // メインタイプの数値
                const mainAdv = adviceNumeric[type];
                
                // 3軸すべてでブレンド
                let blended = { ...mainAdv };
                const blendNotes = [];
                
                ["fr", "io", "xp"].forEach(axis => {
                  const ratio = sp[axis]; // メインタイプ側の%
                  if (conf[axis] !== "clear") {
                    const altType = flipAxis(type, axis);
                    const altAdv = adviceNumeric[altType];
                    if (altAdv) {
                      blended.saddleMin = blend(blended.saddleMin, altAdv.saddleMin, ratio);
                      blended.saddleMax = blend(blended.saddleMax, altAdv.saddleMax, ratio);
                      blended.dropMin = blend(blended.dropMin, altAdv.dropMin, ratio);
                      blended.dropMax = blend(blended.dropMax, altAdv.dropMax, ratio);
                      blended.setbackMin = blend(blended.setbackMin, altAdv.setbackMin, ratio);
                      blended.setbackMax = blend(blended.setbackMax, altAdv.setbackMax, ratio);
                      // クランクはブレンドしない（規格品のため2.5mm刻み）
                      // 前後方向もブレンド
                      if (mainAdv.setbackDir !== altAdv.setbackDir) {
                        blended.setbackDir = ratio >= 60 ? mainAdv.setbackDir : "中央";
                      }
                      const axisLabel = axis === "fr" ? "体幹(F/R)" : axis === "io" ? "荷重(I/O)" : "連動(X/II)";
                      const pct = Math.round(ratio);
                      blendNotes.push(`${axisLabel}が${pct}:${100-pct}のため、${altType}の要素を${100-pct}%反映`);
                    }
                  }
                });
                
                // 数値→表示テキスト変換
                const fmtSaddle = (min, max) => {
                  if (min >= 0 && max > 0) return `+${min}〜${max}mm`;
                  if (min < 0 && max <= 0) return `${min}〜${max}mm`;
                  return `${min}〜+${max}mm`;
                };
                const fmtSetback = (min, max, dir) => {
                  if (dir === "中央") return `膝がペダル軸の真上〜${max}mm`;
                  return `膝がペダル軸より${min}〜${max}mm${dir}`;
                };
                const fmtCrank = (min, max) => {
                  if (min === max) return `${min}mm推奨`;
                  return `${min}〜${max}mm推奨`;
                };
                const saddleLabel = blended.saddleMin >= 3 ? "高め" : blended.saddleMax <= -3 ? "低め" : "標準";
                
                const adv = {
                  saddle: saddleLabel,
                  saddleAdj: fmtSaddle(blended.saddleMin, blended.saddleMax),
                  drop: "",
                  dropRange: `${blended.dropMin}〜${blended.dropMax}mm`,
                  setback: blended.setbackDir === "前" ? "前乗り" : blended.setbackDir === "後" ? "後ろ乗り" : "中央",
                  setbackAdj: fmtSetback(blended.setbackMin, blended.setbackMax, blended.setbackDir),
                  crank: "",
                  crankAdj: (() => {
                    const inseam = parseFloat(bodyMetrics.inseam);
                    const standards = [165, 167.5, 170, 172.5, 175];
                    const snap = (v) => standards.reduce((a, b) => Math.abs(b - v) < Math.abs(a - v) ? b : a);
                    
                    const crankOffset = {
                      FIX: -2.5, FIII: -2.5, FOX: 0, FOII: 0,
                      RIX: 0, RIII: 0, ROX: 2.5, ROII: 2.5,
                    };
                    const crankReason = {
                      FIX: "前傾で股関節が詰まらないよう短め",
                      FIII: "前傾姿勢に合わせて短め",
                      FOX: null,
                      FOII: null,
                      RIX: null,
                      RIII: null,
                      ROX: "体重を活かすレバーとしてやや長め",
                      ROII: "トルク重視で長めのレバーを活用",
                    };
                    const cadenceAdj = cadence === "high" ? -2.5 : 0;
                    const offset = (crankOffset[type] || 0) + cadenceAdj;
                    
                    if (inseam > 0) {
                      const base = inseam * 10 * 0.200;
                      const adjusted = base + offset;
                      const snapped = snap(adjusted);
                      const reasons = [];
                      if (crankReason[type]) reasons.push(crankReason[type]);
                      if (cadenceAdj) reasons.push("高回転型のためさらに短め");
                      const reasonStr = reasons.length > 0 ? `（${reasons.join("。")}）` : "";
                      return `${snapped}mm${reasonStr}`;
                    }
                    return fmtCrank(mainAdv.crankMin, mainAdv.crankMax);
                  })(),
                  blendNotes,
                };
                
                // setbackWhy（テキストはタイプ固定でOK）
                const adviceWhy = {
                  FIX:  "前体幹(F)×内側荷重(I)。みぞおち主導で前荷重のタイプなので、膝を前に出して股関節のパワーを活かす",
                  FIII: "前体幹(F)×パラレル。前寄りだが骨盤を安定させて効率的に回す",
                  FOX:  "前体幹(F)×外側荷重(O)。やや前寄りで外側荷重のパワーを安定して出す",
                  FOII: "前体幹(F)×外側荷重(O)×パラレル。前寄りで安定したペダリングを維持",
                  RIX:  "後体幹(R)×内側荷重(I)。肩甲骨主導で体幹を安定させつつ、膝真上でバランスよく踏む",
                  RIII: "後体幹(R)×パラレル。膝がペダル軸の真上に来るニュートラルが最も効率的",
                  ROX:  "後体幹(R)×外側荷重(O)。後ろ寄りでハムストリングスのトルクを活かす",
                  ROII: "後体幹(R)×外側荷重(O)。どっしり後ろ乗りで体重をペダルに伝える",
                };
                adv.setbackWhy = adviceWhy[type];
                
                // 落差の判定
                const dropRange = { min: blended.dropMin, max: blended.dropMax };
                const dropStatus = currentDrop < dropRange.min ? "深すぎ" : currentDrop > dropRange.max ? "浅すぎ" : "適正";
                
                return (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>
                    Tip: {typeInfo.name}への調整アドバイス
                  </p>
                  
                  {/* ブレンド情報 */}
                  {adv.blendNotes.length > 0 && (
                    <div style={{ background: `${C.cyan}08`, border: `1px solid ${C.cyan}20`, borderRadius: 10, padding: 12 }}>
                      <p style={{ color: C.cyan, fontSize: 11, fontWeight: 700, margin: "0 0 6px" }}>
                        スペクトラム補正適用中
                      </p>
                      {adv.blendNotes.map((note, i) => (
                        <p key={i} style={{ color: C.textMuted, fontSize: 11, margin: "2px 0", lineHeight: 1.5 }}>
                          • {note}
                        </p>
                      ))}
                      <p style={{ color: C.textDim, fontSize: 10, margin: "6px 0 0" }}>
                        僅差の軸は隣接タイプの値とブレンドしています
                      </p>
                    </div>
                  )}
                  
                  {/* サドル高 */}
                  <div style={{ background: C.bg, borderRadius: 12, padding: 14, ...neu.raised }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>サドル高</span>
                      <span style={{ color: typeInfo.color, fontSize: 14, fontWeight: 800 }}>{adv.saddleAdj}</span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>
                      現在 {currentSaddle}mm → {typeInfo.name}は{adv.saddle}がおすすめ
                    </p>
                  </div>
                  
                  {/* ハンドル落差 */}
                  <div style={{ background: C.bg, borderRadius: 12, padding: 14, ...neu.raised }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>ハンドル落差</span>
                      <span style={{ 
                        color: dropStatus === "適正" ? C.green : C.orange, 
                        fontSize: 14, 
                        fontWeight: 800 
                      }}>
                        {dropStatus === "適正" ? "✓ 適正範囲" : dropStatus}
                      </span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>
                      現在 {currentDrop}mm → 推奨 {adv.dropRange}（{adv.drop}）
                    </p>
                  </div>
                  
                  {/* サドル前後 */}
                  <div style={{ background: C.bg, borderRadius: 12, padding: 14, ...neu.raised }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>サドル前後</span>
                      <span style={{ color: typeInfo.color, fontSize: 13, fontWeight: 800 }}>{adv.setback}</span>
                    </div>
                    <p style={{ color: typeInfo.color, fontSize: 13, fontWeight: 700, margin: "0 0 6px" }}>
                      {adv.setbackAdj}
                    </p>
                    <p style={{ color: C.textDim, fontSize: 11, margin: "0 0 8px", lineHeight: 1.5 }}>
                      {adv.setbackWhy}
                    </p>
                    <div style={{ background: `${typeInfo.color}06`, border: `1px solid ${typeInfo.color}15`, borderRadius: 8, padding: 10 }}>
                      <p style={{ color: C.textMuted, fontSize: 10, fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        測り方（KOPS法）
                      </p>
                      <p style={{ color: C.textDim, fontSize: 11, margin: 0, lineHeight: 1.6 }}>
                        ペダルを水平（3時の位置）にして足を乗せ、膝のお皿の下端から糸と重り（5円玉など）を垂らす。
                        糸がペダルの中心軸（シャフトが通っている部分）に対してどこに来るかを見る。
                      </p>
                    </div>
                  </div>
                  
                  {/* クランク長 */}
                  <div style={{ background: C.bg, borderRadius: 12, padding: 14, ...neu.raised }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>クランク長</span>
                      <span style={{ color: typeInfo.color, fontSize: 14, fontWeight: 800 }}>
                        {adv.crankAdj.split("（")[0].split("mm")[0]}mm
                      </span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 11, margin: 0, lineHeight: 1.5 }}>
                      {bodyMetrics.inseam 
                        ? adv.crankAdj.includes("（") 
                          ? adv.crankAdj.split("（")[1].replace("）","")
                          : `現在 ${currentCrank}mm`
                        : `現在 ${currentCrank}mm（股下を入力するとより正確な推奨が出ます）`
                      }
                    </p>
                  </div>
                  
                  {/* クリート */}
                  <div style={{ background: C.bg, borderRadius: 12, padding: 14, ...neu.raised }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>クリート位置</span>
                      <span style={{ color: typeInfo.color, fontSize: 13, fontWeight: 700 }}>{typeInfo.fitting.cleat.position.fore_aft}</span>
                    </div>
                    <p style={{ color: C.textDim, fontSize: 11, margin: "0 0 8px", lineHeight: 1.5 }}>
                      {typeInfo.fitting.cleat.position.detail}
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: C.textMuted, background: `${typeInfo.color}08`, padding: "2px 8px", borderRadius: 6 }}>
                        フロート: {typeInfo.fitting.cleat.float.degree}
                      </span>
                      <span style={{ fontSize: 11, color: C.textMuted, background: `${typeInfo.color}08`, padding: "2px 8px", borderRadius: 6 }}>
                        角度: {typeInfo.fitting.cleat.angle.rotation}
                      </span>
                    </div>
                    {typeInfo.fitting.cleat.qFactor && (
                      <p style={{ color: typeInfo.color, fontSize: 12, fontWeight: 600, margin: "0 0 8px" }}>
                        Qファクター: {typeInfo.fitting.cleat.qFactor.guide}
                      </p>
                    )}
                    <div style={{ background: `${typeInfo.color}06`, border: `1px solid ${typeInfo.color}15`, borderRadius: 8, padding: 10 }}>
                      <p style={{ color: C.textMuted, fontSize: 10, fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        用語ガイド
                      </p>
                      <p style={{ color: C.textDim, fontSize: 11, margin: 0, lineHeight: 1.6 }}>
                        <b style={{ color: C.textMuted }}>ペダル軸</b> = ペダルの中心を貫く棒（シャフト）。足のどの位置にこの軸が来るかが重要。
                        <b style={{ color: C.textMuted }}> 母指球</b> = 親指の付け根のふくらみ。多くの場合ここがペダル軸の基準。
                        <b style={{ color: C.textMuted }}> かかと寄り</b> = クリートをシューズのつま先側に付けると、足裏の踏む位置がかかと方向にずれる。
                      </p>
                    </div>
                  </div>
                </div>
                );
              })()}
              
              {!bodyMetrics.currentSaddleHeight && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>
                    ↑ 現在のサドル高を入力すると<br/>{typeInfo.name}向けの調整アドバイスを表示
                  </p>
                </div>
              )}
            </>
            )}
            
            {/* ===== 詳細モード: 股下から計算 ===== */}
            {showFittingCalc === "detail" && (
            <>
              <div style={{ background: C.bg, borderRadius: 16, padding: 16, marginBottom: 16, ...neu.pressedSm }}>
                <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: "0 0 12px" }}>身体データを入力</p>
                
                {/* 身長（必須） */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: C.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>
                    身長 (cm) <span style={{ color: typeInfo.color }}>*必須</span>
                  </label>
                  <input
                    type="number"
                    placeholder="175"
                    value={bodyMetrics.height}
                    onChange={(e) => setBodyMetrics({...bodyMetrics, height: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "none",
                      background: C.bg,
                      color: C.text,
                      fontSize: 16,
                      fontWeight: 700,
                      ...neu.pressed,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                
                {/* 体型タイプ選択 */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: C.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 6 }}>
                    体型タイプ
                  </label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { value: "long", label: "脚長め", ratio: 0.48 },
                      { value: "standard", label: "標準", ratio: 0.46 },
                      { value: "short", label: "脚短め", ratio: 0.44 },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setBodyMetrics({...bodyMetrics, bodyType: opt.value})}
                        style={{
                          flex: 1,
                          padding: "10px 4px",
                          borderRadius: 8,
                          border: "none",
                          background: C.bg,
                          cursor: "pointer",
                          ...(bodyMetrics.bodyType === opt.value ? neu.pressed : neu.raised),
                          color: bodyMetrics.bodyType === opt.value ? typeInfo.color : C.textMuted,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {bodyMetrics.height && bodyMetrics.bodyType && (
                    <p style={{ color: typeInfo.color, fontSize: 11, margin: "8px 0 0", textAlign: "center" }}>
                      → 推定股下: {Math.round(parseFloat(bodyMetrics.height) * (bodyMetrics.bodyType === "long" ? 0.48 : bodyMetrics.bodyType === "standard" ? 0.46 : 0.44))}cm
                    </p>
                  )}
                </div>
                
                {/* 肩幅タイプ */}
                <div style={{ borderTop: `1px solid ${C.cardBorder}`, paddingTop: 12 }}>
                  <label style={{ color: C.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    肩幅タイプ
                  </label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { value: "wide", label: "広め", adj: 20 },
                      { value: "standard", label: "標準", adj: 0 },
                      { value: "narrow", label: "狭め", adj: -20 },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setBodyMetrics({...bodyMetrics, shoulderType: opt.value})}
                        style={{
                          flex: 1,
                          padding: "10px 4px",
                          borderRadius: 8,
                          border: "none",
                          background: C.bg,
                          cursor: "pointer",
                          ...(bodyMetrics.shoulderType === opt.value ? neu.pressed : neu.raised),
                          color: bodyMetrics.shoulderType === opt.value ? typeInfo.color : C.textMuted,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 股下（任意） */}
                <div style={{ borderTop: `1px solid ${C.cardBorder}`, paddingTop: 12 }}>
                  <label style={{ color: C.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>
                    股下 (cm) <span style={{ color: C.textMuted }}>※任意・入力すると優先</span>
                  </label>
                  <input
                    type="number"
                    placeholder={bodyMetrics.height && bodyMetrics.bodyType ? `推定: ${Math.round(parseFloat(bodyMetrics.height) * (bodyMetrics.bodyType === "long" ? 0.48 : bodyMetrics.bodyType === "standard" ? 0.46 : 0.44))}` : "測定値があれば入力"}
                    value={bodyMetrics.inseam}
                    onChange={(e) => setBodyMetrics({...bodyMetrics, inseam: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "none",
                      background: C.bg,
                      color: C.text,
                      fontSize: 16,
                      fontWeight: 700,
                      ...neu.pressed,
                      boxSizing: "border-box",
                    }}
                  />
                  <p style={{ color: C.textDim, fontSize: 10, margin: "6px 0 0" }}>
                    測定方法: 壁に背中をつけて立ち、本を股に挟む
                  </p>
                </div>
              </div>
              
              {/* 計算結果 */}
              {(bodyMetrics.inseam || (bodyMetrics.height && bodyMetrics.bodyType)) && (() => {
                // 股下の決定: 入力値優先、なければ身長×体型係数で推定
                const height = parseFloat(bodyMetrics.height);
                const bodyTypeRatio = { long: 0.48, standard: 0.46, short: 0.44 };
                const inseam = bodyMetrics.inseam 
                  ? parseFloat(bodyMetrics.inseam) 
                  : height * (bodyTypeRatio[bodyMetrics.bodyType] || 0.46);
                
                const isEstimated = !bodyMetrics.inseam; // 推定値かどうか
                
                // 体型タイプによるサドル高係数補正
                const bodyTypeAdj = {
                  "long": 0,        // 脚長め: 欧米基準そのまま
                  "standard": -0.005, // 標準: やや低め補正
                  "short": -0.010,   // 脚短め: 低め補正
                };
                const adj = bodyTypeAdj[bodyMetrics.bodyType] || -0.003;
                
                const coefficients = {
                  FIX:  { saddleMin: 0.875 + adj, saddleMax: 0.885 + adj, crankMin: 0.195, crankMax: 0.200, dropMin: -60, dropMax: -40 },
                  FIII: { saddleMin: 0.875 + adj, saddleMax: 0.885 + adj, crankMin: 0.195, crankMax: 0.200, dropMin: -50, dropMax: -30 },
                  FOX:  { saddleMin: 0.870 + adj, saddleMax: 0.880 + adj, crankMin: 0.197, crankMax: 0.203, dropMin: -55, dropMax: -35 },
                  FOII: { saddleMin: 0.870 + adj, saddleMax: 0.880 + adj, crankMin: 0.197, crankMax: 0.203, dropMin: -45, dropMax: -25 },
                  RIX:  { saddleMin: 0.870 + adj, saddleMax: 0.880 + adj, crankMin: 0.197, crankMax: 0.200, dropMin: -45, dropMax: -25 },
                  RIII: { saddleMin: 0.875 + adj, saddleMax: 0.885 + adj, crankMin: 0.197, crankMax: 0.200, dropMin: -50, dropMax: -30 },
                  ROX:  { saddleMin: 0.865 + adj, saddleMax: 0.875 + adj, crankMin: 0.200, crankMax: 0.205, dropMin: -30, dropMax: -10 },
                  ROII: { saddleMin: 0.860 + adj, saddleMax: 0.870 + adj, crankMin: 0.200, crankMax: 0.207, dropMin: -25, dropMax: -5 },
                };
                const coef = coefficients[type];
                
                const saddleHeightMin = Math.round(inseam * 10 * coef.saddleMin);
                const saddleHeightMax = Math.round(inseam * 10 * coef.saddleMax);
                // ケイデンス補正: 高回転型は短め方向にシフト
                const cadCrankAdj = cadence === "high" ? -0.003 : 0;
                const crankLengthMin = Math.round(inseam * 10 * (coef.crankMin + cadCrankAdj));
                const crankLengthMax = Math.round(inseam * 10 * (coef.crankMax + cadCrankAdj));
                
                // 肩幅タイプによるハンドル幅調整
                const shoulderAdj = { wide: 20, standard: 0, narrow: -20 };
                const handlebarBase = Math.round(height * 2.4); // 身長(cm)×2.4 → mm
                const handlebarWidth = handlebarBase + (shoulderAdj[bodyMetrics.shoulderType] || 0);
                
                const standardCranks = [165, 167.5, 170, 172.5, 175];
                const avgCrank = (crankLengthMin + crankLengthMax) / 2;
                const recommendedCrank = standardCranks.reduce((prev, curr) => 
                  Math.abs(curr - avgCrank) < Math.abs(prev - avgCrank) ? curr : prev
                );
                
                return (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* 計算条件の表示 */}
                  <div style={{ background: `${typeInfo.color}15`, borderRadius: 10, padding: 10 }}>
                    <p style={{ color: typeInfo.color, fontSize: 11, fontWeight: 600, margin: 0, textAlign: "center" }}>
                      脚: {bodyMetrics.bodyType === "long" ? "長め" : bodyMetrics.bodyType === "standard" ? "標準" : "短め"}
                      {" | "}肩: {bodyMetrics.shoulderType === "wide" ? "広め" : bodyMetrics.shoulderType === "narrow" ? "狭め" : "標準"}
                      {" | "}股下 {Math.round(inseam)}cm {isEstimated ? "（推定）" : "（実測）"}
                    </p>
                  </div>
                  
                  <div style={{ background: C.bg, borderRadius: 12, padding: 14, ...neu.raised }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        
                        <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>サドル高</span>
                      </div>
                      <span style={{ color: typeInfo.color, fontSize: 18, fontWeight: 800 }}>
                        {saddleHeightMin}〜{saddleHeightMax}mm
                      </span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>
                      BB中心〜サドル上面 | {typeInfo.fitting.saddle.height.detail}
                    </p>
                  </div>
                  
                  <div style={{ background: C.bg, borderRadius: 12, padding: 14, ...neu.raised }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        
                        <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>サドル前後</span>
                      </div>
                      <span style={{ color: typeInfo.color, fontSize: 18, fontWeight: 800 }}>
                        {typeInfo.fitting.saddle.setback.position}
                      </span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>
                      {typeInfo.fitting.saddle.setback.detail}
                    </p>
                  </div>
                  
                  <div style={{ background: C.bg, borderRadius: 12, padding: 14, ...neu.raised }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        
                        <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>クランク長</span>
                      </div>
                      <span style={{ color: typeInfo.color, fontSize: 18, fontWeight: 800 }}>
                        {recommendedCrank}mm
                      </span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 11, margin: 0, lineHeight: 1.5 }}>
                      {(() => {
                        const reasons = [];
                        const crankReasons = {
                          FIX: "前傾で股関節が詰まらないよう短め", FIII: "前傾姿勢に合わせて短め",
                          ROX: "体重を活かすレバーとしてやや長め", ROII: "トルク重視で長めのレバーを活用",
                        };
                        if (crankReasons[type]) reasons.push(crankReasons[type]);
                        if (cadence === "high") reasons.push("高回転型のためさらに短め");
                        return reasons.length > 0 ? reasons.join("。") : typeInfo.fitting.crank.length.detail;
                      })()}
                    </p>
                  </div>
                  
                  <div style={{ background: C.bg, borderRadius: 12, padding: 14, ...neu.raised }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        
                        <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>ハンドル落差</span>
                      </div>
                      <span style={{ color: typeInfo.color, fontSize: 18, fontWeight: 800 }}>
                        {coef.dropMin}〜{coef.dropMax}mm
                      </span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>
                      サドル上面〜ハンドル上面 | {typeInfo.fitting.handlebar.drop.detail}
                    </p>
                  </div>
                  
                  <div style={{ background: C.bg, borderRadius: 12, padding: 14, ...neu.raised }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        
                        <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>ハンドル幅</span>
                      </div>
                      <span style={{ color: typeInfo.color, fontSize: 18, fontWeight: 800 }}>
                        {handlebarWidth}mm前後
                      </span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>
                      芯-芯 | {typeInfo.fitting.handlebar.width.guide}
                    </p>
                  </div>
                  
                  <div style={{ background: C.bg, borderRadius: 12, padding: 14, ...neu.raised }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        
                        <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>クリート</span>
                      </div>
                      <span style={{ color: typeInfo.color, fontSize: 14, fontWeight: 700 }}>
                        {typeInfo.fitting.cleat.position.fore_aft}
                      </span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 6px" }}>
                      フロート: {typeInfo.fitting.cleat.float.degree} | {typeInfo.fitting.cleat.angle.rotation}
                    </p>
                    {typeInfo.fitting.cleat.qFactor && (
                      <p style={{ color: typeInfo.color, fontSize: 12, fontWeight: 600, margin: 0 }}>
                        Qファクター: {typeInfo.fitting.cleat.qFactor.guide}
                      </p>
                    )}
                  </div>
                  
                  <div style={{ background: C.bg, borderRadius: 12, padding: 14, ...neu.raised }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        
                        <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>サドル角度</span>
                      </div>
                      <span style={{ color: typeInfo.color, fontSize: 14, fontWeight: 700 }}>
                        {typeInfo.fitting.saddle.tilt.angle}
                      </span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>
                      {typeInfo.fitting.saddle.tilt.detail}
                    </p>
                  </div>
                </div>
                );
              })()}
              
              {!(bodyMetrics.inseam || (bodyMetrics.height && bodyMetrics.bodyType)) && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>
                    ↑ 身長と体型タイプを選択すると<br/>{typeInfo.name}に最適なフィッティング数値を計算します
                  </p>
                </div>
              )}
            </>
            )}
            
            {/* モード未選択時 */}
            {!showFittingCalc && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>
                  ↑ モードを選択して<br/>フィッティングを計算
                </p>
              </div>
            )}
            
            {/* 注意書き */}
            {(showFittingCalc === "simple" || showFittingCalc === "detail") && (
              <p style={{ color: C.textDim, fontSize: 10, margin: "12px 0 0", textAlign: "center", lineHeight: 1.5 }}>
                ※ 計算値は目安です。体の柔軟性や経験によって調整が必要です。
              </p>
            )}
          </Card>
          )}

          {/* 機材セレクト */}
          <div onClick={() => tog('gear')} style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", cursor: "pointer", background: theme.card, border: `1px solid ${theme.cardBorder}`, borderBottom: openSections.gear ? "none" : `1px solid ${theme.cardBorder}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {Icons.settings(typeInfo.color, 20)}
              <span style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>機材セレクト</span>
            </div>
            <span style={{ color: C.textDim }}>{openSections.gear ? "▲" : "▼"}</span>
          </div>
          {openSections.gear && (
          <Card style={{ marginTop: 0, borderTop: "none", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${typeInfo.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {Icons.settings(typeInfo.color, 20)}
              </div>
              <div>
                <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0 }}>機材の傾向</p>
                <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>あなたのタイプに合うパーツの方向性</p>
              </div>
            </div>
            
            {(() => {
              const tend = GEAR_TENDENCIES[type] || {};
              const items = [
                { icon: "saddle", label: "サドル", value: tend.saddle },
                { icon: "pedal", label: "ペダル", value: tend.pedal },
                { icon: "shoe", label: "シューズ", value: tend.shoes },
                { icon: "bartape", label: "バーテープ", value: tend.bartape },
              ];
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map(item => (
                    <div key={item.label} style={{ 
                      display: "flex", alignItems: "center", gap: 12,
                      background: C.bg, borderRadius: 12, padding: "12px 14px", ...neu.raised,
                    }}>
                      <div style={{ minWidth: 32, display: "flex", justifyContent: "center" }}>
                        {Icons[item.icon] && Icons[item.icon](typeInfo.color, 20)}
                      </div>
                      <div>
                        <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: 0 }}>{item.label}</p>
                        <p style={{ color: C.textMuted, fontSize: 11, margin: "2px 0 0", lineHeight: 1.4 }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
            
            <p style={{ color: C.textDim, fontSize: 10, marginTop: 14, textAlign: "center" }}>
              ※ 傾向の目安です。実際の選択はフィッターにご相談ください。
            </p>
          </Card>
          )}
          
          
          
          {/* 体感ワード変換表 */}
          <div onClick={() => tog('feel')} style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", cursor: "pointer", background: theme.card, border: `1px solid ${theme.cardBorder}`, borderBottom: openSections.feel ? "none" : `1px solid ${theme.cardBorder}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {Icons.book(typeInfo.color, 20)}
              <span style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>体感ワード辞典</span>
            </div>
            <span style={{ color: C.textDim }}>{openSections.feel ? "▲" : "▼"}</span>
          </div>
          {openSections.feel && (
          <Card style={{ marginTop: 0, borderTop: "none" }}>
            <p style={{ color: C.textMuted, fontSize: 12, margin: "0 0 16px", lineHeight: 1.5 }}>
              よく聞くアドバイスが{typeInfo.name}タイプのあなたに合うかどうかを解説
            </p>
            {(() => {
              // タイプから軸を判定
              const axes = {
                fr: type.startsWith("F") ? "F" : "R",
                io: type.includes("I") && !type.includes("II") ? "I" : type.includes("O") ? "O" : (type.endsWith("III") || type.endsWith("RIII")) ? "I" : "I",
                xp: type.endsWith("X") ? "X" : "II",
              };
              // 正確なI/O判定
              const ioAxis = (type === "FIX" || type === "FIII" || type === "RIX" || type === "RIII") ? "I" : "O";
              
              const renderItem = (item, i) => {
                // このワードに該当する軸のアドバイスを取得
                const byType = item.byType;
                const keys = Object.keys(byType);
                let myAdvice = null;
                let myFit = null;
                
                // F/R軸
                if (byType.F && byType.R) {
                  const k = axes.fr;
                  myAdvice = byType[k].advice;
                  myFit = byType[k].fit;
                }
                // I/O軸
                else if (byType.I && byType.O) {
                  myAdvice = byType[ioAxis].advice;
                  myFit = byType[ioAxis].fit;
                }
                // X/II軸
                else if (byType.X && byType.II) {
                  const k = axes.xp;
                  myAdvice = byType[k].advice;
                  myFit = byType[k].fit;
                }
                
                const fitColor = myFit === "◎" ? C.green : myFit === "○" ? C.cyan : C.orange;
                
                return (
                  <div key={i} style={{ background: "rgba(255,255,255,0.35)", borderRadius: 10, padding: 12, borderLeft: `3px solid ${fitColor}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>
                        「{item.vague}」
                      </p>
                      <span style={{ 
                        fontSize: 11, fontWeight: 700, color: fitColor,
                        background: `${fitColor}15`, padding: "2px 8px", borderRadius: 8,
                      }}>
                        {myFit} {myFit === "◎" ? "合う" : myFit === "○" ? "やや合う" : "注意"}
                      </span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 6px", lineHeight: 1.5 }}>
                      一般的: {item.general}
                    </p>
                    {myAdvice && (
                      <div style={{ padding: "8px 10px", background: `${fitColor}06`, borderRadius: 6, marginBottom: 6 }}>
                        <p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
                          {typeInfo.name}タイプ: {myAdvice}
                        </p>
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {item.ng && (
                        <p style={{ color: C.red, fontSize: 11, margin: 0, lineHeight: 1.5 }}>✗ {item.ng}</p>
                      )}
                      <p style={{ color: typeInfo.color, fontSize: 11, margin: 0 }}>✓ {item.check}</p>
                    </div>
                  </div>
                );
              };
              
              const items = BODY_FEEL_DICT;
              return (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.slice(0, 6).map(renderItem)}
                </div>
                {!showAllBodyFeel && items.length > 6 && (
                  <button
                    onClick={() => setShowAllBodyFeel(true)}
                    style={{
                      width: "100%", marginTop: 12, padding: 10, borderRadius: 8,
                      border: `1px solid ${theme.cardBorder}`, background: "transparent",
                      color: C.textMuted, fontSize: 12, cursor: "pointer"
                    }}
                  >
                    もっと見る（+{items.length - 6}語）
                  </button>
                )}
                {showAllBodyFeel && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                    {items.slice(6).map((item, i) => renderItem(item, i + 6))}
                  </div>
                )}
                </>
              );
            })()}
          </Card>
          )}
          
          
          <button
            onClick={() => {
              setMode("start");
              setAnswers({});
              setSkipped(new Set());
              setScores({ typeA: 0, typeB: 0, num1: 0, num2: 0, high: 0, low: 0, open: 0, forward: 0, aggressive: 0, steady: 0, solo: 0, team: 0 });
              setCurrentIndex(0);
              setResult(null);
              setIsPro(false);
              setExtraRoundDone(false);
              setQuestions([...QUESTION_POOL].sort(() => Math.random() - 0.5));
            }}
            style={{
              width: "100%", marginTop: 12, padding: "14px", borderRadius: 12,
              border: `1px solid ${C.cardBorder}`, background: "transparent",
              color: C.textDim, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}
          >
            {Icons.refresh(C.textDim, 16)} 最初からやり直す
          </button>
          
          
          {/* フィッター検索 */}
          {sport === "cycling" && (
          <Card style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${typeInfo.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {Icons.stanceCore(typeInfo.color, 28)}
              </div>
              <div>
                <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0 }}>フィッター検索</p>
                <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>あなたのタイプを活かすポジションへ</p>
              </div>
            </div>
            
            <p style={{ color: C.textMuted, fontSize: 13, margin: "0 0 16px", lineHeight: 1.7 }}>
              診断結果をさらに活かすなら、プロのバイクフィッターに相談してみませんか？
            </p>
            
            {/* お近くのフィッターを探す（Google Maps） */}
            {(() => {
              
              const partners = [
                { name: "ACTIVIKE", area: "東京", pref: "東京都", desc: "理学療法士による身体評価ベースのフィッティング", url: "https://activike.com/bikefitting_activike/", color: "#4A90D9", partner: true },
                { name: "カミハギサイクル", area: "名古屋", pref: "愛知県", desc: "Retül Fit対応。豊富な実績", url: "https://kamihagi.com/retul/", color: "#E85A4F", partner: true },
                { name: "ベックオン", area: "大阪", pref: "大阪府", desc: "各種フィッティングに対応", url: "https://beckon.jp/pages/bikefitting", color: "#F5A623", partner: true },
                { name: "自転車のウエサカ", area: "中部", pref: "岐阜県", desc: "idmatch BIKELAB・複数資格保有", url: "http://jitensha-uesaka.sun.bindcloud.jp/idmatch/idmatchbikelab.html", color: "#7ED321", partner: true },
                { name: "一条サイクル", area: "大阪・京都・兵庫", pref: "大阪府", desc: "元プロMTBライダーによるフィッティング", url: "https://www.1jyo.com/enjoy-bike/36843", color: "#9B59B6", partner: true },
              ];
              
              // 検索地域でフィルタ（空なら全表示）
              const filtered = fitterSearchArea 
                ? partners.filter(f => f.area.includes(fitterSearchArea) || f.pref.includes(fitterSearchArea) || f.name.includes(fitterSearchArea))
                : partners;
              
              const openGoogleMaps = () => {
                const query = fitterSearchArea 
                  ? `バイクフィッティング ${fitterSearchArea}`
                  : "バイクフィッティング";
                window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, "_blank");
              };
              
              return (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* 検索バー */}
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="地域を入力（例: 東京、大阪、名古屋）"
                    value={fitterSearchArea}
                    onChange={(e) => setFitterSearchArea(e.target.value)}
                    style={{
                      flex: 1, padding: "12px 14px", borderRadius: 10, border: "none",
                      background: C.bg, color: C.text, fontSize: 14, ...neu.pressed, boxSizing: "border-box",
                    }}
                  />
                  <button
                    onClick={openGoogleMaps}
                    style={{
                      padding: "12px 16px", borderRadius: 10, border: "none",
                      background: typeInfo.color, color: "#fff", fontSize: 12, fontWeight: 700,
                      cursor: "pointer", whiteSpace: "nowrap",
                    }}
                  >
                    MAP検索
                  </button>
                </div>
                
                {/* 提携フィッター */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                  <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>
                    提携フィッター {filtered.length > 0 && `(${filtered.length})`}
                  </p>
                  <button 
                    onClick={() => setShowPartners(!showPartners)}
                    style={{ background: "none", border: "none", color: C.textDim, fontSize: 11, cursor: "pointer" }}
                  >
                    {showPartners ? "▲ 閉じる" : "▼ 開く"}
                  </button>
                </div>
                
                {showPartners && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filtered.length > 0 ? filtered.map((fitter, i) => (
                    <a
                      key={i}
                      href={fitter.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 16px", borderRadius: 12,
                        background: "rgba(255,255,255,0.35)", border: `1px solid ${theme.cardBorder}`,
                        textDecoration: "none", transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: fitter.color }} />
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>{fitter.name}</p>
                            <span style={{ color: C.textDim, fontSize: 10, background: `${C.textDim}15`, padding: "2px 8px", borderRadius: 10 }}>
                              {fitter.area}
                            </span>
                            {fitter.partner && (
                              <span style={{ color: typeInfo.color, fontSize: 9, fontWeight: 700, background: `${typeInfo.color}15`, padding: "2px 6px", borderRadius: 8 }}>
                                提携
                              </span>
                            )}
                          </div>
                          <p style={{ color: C.textMuted, fontSize: 11, margin: "4px 0 0" }}>{fitter.desc}</p>
                        </div>
                      </div>
                      <div style={{ color: C.textDim, flexShrink: 0 }}>
                        {Icons.arrowRight(C.textDim, 16)}
                      </div>
                    </a>
                  )) : (
                    <div style={{ padding: 16, textAlign: "center", background: "rgba(255,255,255,0.35)", borderRadius: 12 }}>
                      <p style={{ color: C.textMuted, fontSize: 13, margin: "0 0 8px" }}>
                        「{fitterSearchArea}」の提携フィッターはまだありません
                      </p>
                      <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>
                        MAP検索で近くのフィッティングサービスを探してみてください
                      </p>
                    </div>
                  )}
                </div>
                )}
                
                {/* Google Maps全体検索ボタン */}
                <button
                  onClick={openGoogleMaps}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    width: "100%", padding: "14px", borderRadius: 12,
                    border: `1px solid ${typeInfo.color}30`, background: `${typeInfo.color}06`,
                    color: typeInfo.color, fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {fitterSearchArea ? `「${fitterSearchArea}」でGoogle Maps検索` : "Google Mapsでフィッターを探す"}
                </button>
                
                <p style={{ color: C.textDim, fontSize: 10, margin: "4px 0 0", textAlign: "center", lineHeight: 1.5 }}>
                  ※ 提携フィッターは随時追加中です。掲載希望の方はお問い合わせください
                </p>
              </div>
              );
            })()}
          </Card>
          )}
          
          {/* シェア */}
          <Card style={{ marginTop: 20, background: `linear-gradient(135deg, ${C.accent}10, ${C.pink}08)`, border: `1px solid ${C.accent}20` }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>結果をシェア</p>
              <p style={{ color: C.textMuted, fontSize: 12, margin: "0 0 16px", lineHeight: 1.6 }}>
                「私は<span style={{ color: typeInfo.color, fontWeight: 600 }}>{typeInfo.name}</span>タイプ」<br/>
                友達も診断してみよう！
              </p>
              
              <button
                onClick={() => {
                  const bodyStyle = type === "FIX" ? "捻りながら内側で踏み込む" 
                    : type === "FIII" ? "安定して内側で効率よく回す"
                    : type === "FOX" ? "捻りながら外側でパワーを出す"
                    : type === "FOII" ? "安定して外側で粘る"
                    : type === "RIX" ? "後体幹でリズミカルに漕ぐ"
                    : type === "RIII" ? "後体幹で効率よく滑らかに"
                    : type === "ROX" ? "後体幹であらゆる状況に適応"
                    : "後体幹でどっしり安定";
                  const text = `「コーチの言うことがしっくりこない」の正体がわかった。

私は "${typeInfo.name}" タイプ。
「${bodyStyle}」のが自然な身体の使い方らしい。

合わないアドバイスに悩んでたのは、身体の使い方が違っただけだった。

あなたも自分のタイプ、調べてみて
${window.location.origin}

#STANCECORE #StanceType`;
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                  window.open(url, '_blank');
                }}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: 12,
                  border: "none",
                  background: "#000",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X (Twitter) でシェア
              </button>
              
              <button
                onClick={() => {
                  const text = `自分の身体の使い方がわかった。私は "${typeInfo.name}" タイプ。 ${window.location.origin}`;
                  if (navigator.share) {
                    navigator.share({ title: 'STANCE CORE 診断結果', text: text, url: window.location.origin });
                  } else {
                    navigator.clipboard.writeText(text);
                    alert('クリップボードにコピーしました！');
                  }
                }}
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: "12px 20px",
                  borderRadius: 12,
                  border: `1px solid ${C.cardBorder}`,
                  background: "transparent",
                  color: C.textMuted,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                テキストをコピー
              </button>
            </div>
          </Card>
          
          {/* ABOUT - 理論説明 */}
          <Card style={{ marginTop: 24 }}>
            <p style={{ 
              color: theme.accent, 
              fontSize: 11, 
              fontWeight: 600, 
              margin: "0 0 20px", 
              letterSpacing: "3px", 
              textTransform: "uppercase",
              textAlign: "center"
            }}>
              About Stance Type
            </p>
            
            <div style={{ fontSize: 13, color: C.text, lineHeight: 2 }}>
              <div style={{ marginBottom: 20 }}>
                <p style={{ color: theme.accent, fontWeight: 600, margin: "0 0 8px", fontSize: 12, letterSpacing: "1px" }}>
                  予測的姿勢制御（APA）とは
                </p>
                <p style={{ margin: 0, color: C.textMuted }}>
                  人は動作の直前、無意識に姿勢を調整している。
                  この働きは神経科学・リハビリテーション分野で
                  「Anticipatory Postural Adjustments（APA）」として研究されている。
                </p>
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <p style={{ color: theme.accent, fontWeight: 600, margin: "0 0 8px", fontSize: 12, letterSpacing: "1px" }}>
                  足裏に現れる傾向
                </p>
                <p style={{ margin: 0, color: C.textMuted }}>
                  APAの傾向は特に足裏の荷重位置に現れやすい。
                  前側（つま先寄り）か後側（かかと寄り）か、内側か外側か。
                </p>
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <p style={{ color: theme.accent, fontWeight: 600, margin: "0 0 8px", fontSize: 12, letterSpacing: "1px" }}>
                  4つのStance Type
                </p>
                <p style={{ margin: 0, color: C.textMuted }}>
                  STANCE COREでは、これらの傾向から8つのStance Type（3軸の組み合わせ）に分類。
                  それぞれに適した身体の使い方、機材選びがある。
                </p>
              </div>
              
              <div style={{ 
                borderTop: `1px solid ${theme.cardBorder}`, 
                paddingTop: 16,
                marginTop: 16 
              }}>
                <p style={{ color: C.textDim, fontWeight: 500, margin: "0 0 8px", fontSize: 10, letterSpacing: "1px", textTransform: "uppercase" }}>
                  References
                </p>
                <p style={{ margin: 0, color: C.textDim, fontSize: 11, lineHeight: 1.8 }}>
                  Massion, J. (1992). Movement, posture and equilibrium<br/>
                  Aruin, A.S., Latash, M.L. (1995). Directional specificity of postural muscles
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  return null;
}
