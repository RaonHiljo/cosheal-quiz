'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { track } from '@/lib/track'   

const SHOW_DEV = process.env.NODE_ENV !== 'production'

/** =========================
 *  Global styles & tokens
 *  ========================= */
const GlobalPalette = () => ( <style jsx global>{`
:root{
  --amz-orange:#FF9900;
  --amz-orange-600:#E68A00;
  --cos-bg:#FCFBF9;
  --cos-surface:#FFFFFF;
  --cos-accent:#F3E9E0;
  --cos-primary:#2D4A43;
  --cos-primary-600:#253E38;
  --cos-ink:#0E1A18;
  --cos-sub:#4A5B58;
  --cos-line:#E7E2DC;
  --cos-radius-card:16px;
  --cos-radius-ctl:12px;
  --cos-shadow-card:0 10px 24px rgba(0,0,0,.06);
  --container-max: 992px;
  --gutter:24px;
  --cover-pad: 28px;
  --logo-y: -12px;
  --logo-x: -4px;
  --sub-nudge-x: 4px;
  --see-bg:#CDEBE4;
  --see-bg-hover:#BADFD9;
  --see-bg-press:#A7D4CD;
  --see-border:#72BEB1;
  --see-ink-strong:#173B35;
}
/* Your Skin MBTI: 라벨 굵게 + 라벨/설명 줄바꿈 */
.axisItem{ margin:10px 0; }
.axisLabel{
  display:block;
  font-weight:800;
  color:var(--cos-primary-600);
  letter-spacing:.1px;
}
.axisDesc{
  display:block;
  margin-top:4px;
  line-height:1.58;
}

/* 'Your Skin MBTI' 라벨 진하게 */
.result-text-col .mbtiPoster-label{
  font-weight: 900 !important;            /* 800 → 900 */
  /* 가변 폰트면 아래도 함께: */
  font-variation-settings: 'wght' 900;
}
.result-text-col .mbtiPoster-label{
  letter-spacing: 0.8px;                  /* 살짝 좁혀서 묵직하게 */
}
.mbtiPoster-code{ font-weight: 900 !important; }

/* 라벨(Your Skin MBTI) 사이즈 살짝 업 */
.result-text-col .mbtiPoster-label{
  font-size: 14px !important;     /* 기본 12px → 14px */
  letter-spacing: 1.1px;
  margin-bottom: 6px;              /* 카드와 간격 살짝 */
}

/* 큰 화면에서만 조금 더 키움(선택) */
@media (min-width: 1200px){
  .result-text-col .mbtiPoster-label{
    font-size: 16px !important;
  }
.axisList .axisItem{ margin:6px 0; line-height:1.5; }

.axisList .axisLabel{
  display:inline-block !important;
  min-width:0ch;          /* 필요하면 17~20ch 사이로 조정 */
  margin-right:8px;
  font-weight:800;
  color:var(--cos-primary-600);
  vertical-align:top;
}

.axisList .axisDesc{
  display:inline !important;
}/* === Result details: widen left / shrink right === */
.resultDetails{
  /* 왼쪽 1.28, 오른쪽 0.72 비율 */
  grid-template-columns: minmax(340px, 1.21fr) minmax(320px, 0.79fr);
}

/* 화면이 아주 넓으면 조금 더 과감하게 */
@media (min-width: 1280px){
  .resultDetails{
    grid-template-columns: minmax(360px, 1.35fr) minmax(320px, 0.65fr);
  }
}

/* 태블릿~랩탑 구간은 살짝만 차이 */
@media (max-width: 1100px){
  .resultDetails{
    grid-template-columns: minmax(320px, 1.18fr) minmax(300px, 0.82fr);
  }
}

/* 모바일은 한 칼럼 유지(기존 규칙과 동일) */
@media (max-width: 768px){
  .resultDetails{ grid-template-columns: 1fr; }
}
}

/* === See-why button variants (place AFTER :root } and AFTER .linkBtn) === */
.seeWhyBtn{
  font-weight: 800;
  padding: 0 16px;
  height: 44px;
  border-radius: var(--cos-radius-ctl);
  border-width: 1px;
  border-style: solid;
  transition: transform .12s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
  box-shadow: 0 6px 16px rgba(0,0,0,.06);
}
.seeWhyBtn:active{ transform: translateY(0); box-shadow:none; }

    html{ scroll-behavior:smooth; }

    .page-bg{ min-height:100svh; background:linear-gradient(180deg,#FCFBF9 0%,#FCFBF9 74%, rgba(243,233,224,.6) 100%); color:var(--cos-ink); }
    @media (max-width:768px){
      .page-bg{ background:linear-gradient(180deg,#FCFBF9 0%,#FCFBF9 80%, rgba(243,233,224,.6) 100%); }
    }

    .wrap{ max-width:var(--container-max); margin:0 auto; padding:24px var(--gutter); }
    .cover-layout{ max-width:var(--container-max); margin:0 auto; padding:32px var(--gutter); }

    /* sticky header */
    .pageHeader{ position: sticky; top: env(safe-area-inset-top, 0); z-index: 10; display:flex; align-items:center; justify-content:space-between; padding:16px 0 20px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
    .pageHeader h1{ font-size:20px; font-weight:600; letter-spacing:-0.2px; margin:0; }
    .pageHeader .sub{ font-size:12px; color:var(--cos-sub); }

    /* card */
    .card{ position: relative; background:var(--cos-surface); border:1px solid var(--cos-line); border-radius:var(--cos-radius-card); box-shadow:var(--cos-shadow-card); padding:24px; }

    /* buttons */
    .btn{ display:inline-flex; align-items:center; justify-content:center; padding:10px 16px; border-radius:var(--cos-radius-ctl); font-size:14px; font-weight:600; cursor:pointer; border:1px solid transparent; transition: background .2s ease, border-color .2s ease, opacity .2s ease; user-select:none; }
    .btn:disabled{ opacity:.5; cursor:not-allowed; }
    .btnPrimary{ background:var(--cos-primary); color:#fff; }
    .btnPrimary:hover{ background:var(--cos-primary-600); }
    .btnGhost{ background:var(--cos-surface); color:var(--cos-ink); border-color:var(--cos-line); }
    .btnGhost:hover{ background:rgba(243,233,224,.4); }
    .btnGhostFlat{ background:transparent; border:1px solid var(--cos-line); }

/* CTA 위계 강화 */
.ctaRow .btnPrimary{ min-width:180px; height:44px; font-weight:700; }

/* 윤곽선 버튼: See why this fits */
.linkBtn{
  display:inline-flex; align-items:center; gap:6px;
  height:44px; padding:0 14px;
  border:1px solid var(--cos-line);
  border-radius: var(--cos-radius-ctl);
  background:transparent; color:var(--cos-ink); font-weight:600;
  transition: background .2s ease, border-color .2s ease;
}
.linkBtn:hover{ background: rgba(243,233,224,.35); }
.linkBtn .chev{
  width:10px; height:10px;
  border:2px solid currentColor; border-left:0; border-top:0;
  transform:rotate(-45deg);
}
.seeWhyBtn{
  height: 48px;
  padding: 0 18px;
  font-weight: 800;
  letter-spacing: .2px;
  border-color: color-mix(in srgb, var(--cos-primary) 26%, var(--cos-line) 74%);
  background: color-mix(in srgb, var(--cos-accent) 55%, white);
  box-shadow: 0 8px 18px rgba(0,0,0,.08);
}

.seeWhyBtn:hover{
  background: color-mix(in srgb, var(--cos-accent) 70%, white);
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(0,0,0,.10);
}
.seeWhyBtn:active{
  transform: translateY(0);
  box-shadow: 0 6px 12px rgba(0,0,0,.08);
}
.seeWhyBtn:focus-visible{
  outline: 3px solid color-mix(in srgb, var(--cos-primary) 30%, transparent);
  outline-offset: 2px;
}
.seeWhyBtn .chev{ width: 12px; height: 12px; border-width: 2.5px; }

/* 첫 진입 시 2회 살짝 팝(주의끌기) – 기존 @keyframes ctaPop 재사용 */
@media (prefers-reduced-motion: no-preference){
  .seeWhyBtn.attn{ animation: ctaPop 1500ms ease 2; }
}
.resultCover .ctaRow .linkBtn.seeWhyBtn--mint{
  /* 화이트 바탕 + 짙은 그린 윤곽: 주변 베이지/연민트 속에서 가장 또렷 */
  background: #FFFFFF;
  color: var(--cos-primary-600);
  border-color: color-mix(in srgb, var(--cos-primary) 92%, white 8%);
  border-width: 2px;

  /* 분리감 있는 그림자(halo) */
  box-shadow:
    0 10px 24px rgba(13,26,24,.10),
    0 0 0 1px rgba(13,26,24,.05);

  /* 살짝 더 크고 굵게 */
  height: 50px;               /* 기존 48px → 50px */
  padding: 0 20px;            /* 약간 넓게 */
  font-weight: 900;
  font-size: 15px;
  letter-spacing: .2px;
  border-radius: var(--cos-radius-ctl);
  transform: translateY(0);
}

.resultCover .ctaRow .linkBtn.seeWhyBtn--mint:hover{
  /* hover는 살짝 틴트만 → 심미성 유지 */
  background: color-mix(in srgb, var(--cos-primary) 6%, white);
  border-color: color-mix(in srgb, var(--cos-primary) 96%, white 4%);
  transform: translateY(-1px);
  box-shadow:
    0 14px 32px rgba(13,26,24,.14),
    0 0 0 1px rgba(13,26,24,.07);
}

.resultCover .ctaRow .linkBtn.seeWhyBtn--mint:active{
  transform: translateY(0);
  box-shadow:
    0 8px 18px rgba(13,26,24,.10),
    0 0 0 1px rgba(13,26,24,.08);
}

.resultCover .ctaRow .linkBtn.seeWhyBtn--mint:focus-visible{
  outline: 3px solid color-mix(in srgb, var(--cos-primary) 35%, transparent);
  outline-offset: 2px;
}

.resultCover .ctaRow .linkBtn.seeWhyBtn--mint .chev{
  width: 12px; height: 12px; border-width: 2.5px;
  border-color: currentColor; /* 아이콘도 글자색 동기화 */
}
.resultCover .result-text-col .mbtiPoster-label{
  font-size: 15px !important;   /* 기존 14px → 15px */
  margin-bottom: 8px;            /* 간격도 2px만 늘려 균형 */
}
@media (min-width: 1200px){
  .resultCover .result-text-col .mbtiPoster-label{
    font-size: 17px !important; /* 데스크톱 16px → 17px */
  }
}
    /* progress */
    .progress{ height:8px; width:100%; background: color-mix(in srgb, var(--cos-line) 60%, transparent); border-radius:999px; overflow:hidden; }
    .progressFill{ height:8px; background:var(--cos-primary); width:0%; transition:width .25s ease; }

    /* radio cards */
    .radioList{ display:flex; flex-direction:column; gap:12px; }
    .radioLabel{ display:flex; align-items:center; gap:12px; border:1px solid var(--cos-line); border-radius:var(--cos-radius-ctl); padding:12px; cursor:pointer; transition: border-color .2s ease, box-shadow .2s ease, background .2s ease; background:#fff; }
    .radioLabel:hover{ border-color: color-mix(in srgb, var(--cos-primary) 40%, var(--cos-line)); }
    .radioLabel.active{ border-color: var(--cos-primary); background: color-mix(in srgb, var(--cos-accent) 60%, white); box-shadow: var(--cos-shadow-card); }
    .radioLabel span{ font-size:14px; color:var(--cos-ink); }
    .radioInput{ display:none; }

    /* Result cover tweaks */
/* Result cover tweaks — 결과 이미지는 절대 자르지 않음 */
.resultCover{ padding-bottom:16px; margin-bottom:8px; position:relative; }

/* === Hero: MBTI Badge === */
.mbtiBadge{
  display:inline-flex; align-items:center; gap:10px;
  padding:10px 14px;
  border:1px solid var(--cos-line);
  border-radius:14px;
  background: color-mix(in srgb, var(--cos-accent) 40%, white);
  box-shadow: 0 4px 14px rgba(0,0,0,.06);
}
/* === Hero: BIG MBTI Poster === */
.mbtiPoster{
  display:flex; flex-direction:column; gap:8px;
  align-items:flex-start;
}
.mbtiPoster-label{
  font-size:12px; letter-spacing:1px; font-weight:800;
  text-transform:uppercase; color:var(--cos-primary-600);
}
.mbtiPoster-card{
  display:flex; align-items:center;
  padding:10px 16px;
  border:2px solid var(--cos-line);
  border-radius:18px;
  background: color-mix(in srgb, var(--cos-accent) 32%, white);
  box-shadow: 0 6px 18px rgba(0,0,0,.06);
}
.mbtiPoster-card{ padding-inline: 18px 22px; }  /* 오른쪽 패딩을 살짝 더 */
.mbtiPoster-code{ transform: translateX(5px); } /* 또는 1px 오른쪽 미세 이동 */

@media (max-width:768px){
  .mbtiPoster-card{ padding-inline: 16px 20px; }
}
.mbtiPoster-code{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
  font-weight:900; letter-spacing:.18em;
  line-height:.9;
  /* 화면에 맞춰 자동으로 크게 */
  font-size: clamp(64px, 12vw, 140px);
}

/* 결과 우측 텍스트 칼럼에서 살짝 위로 올려 보이게 */
.result-text-col .mbtiPoster{ transform: translateY(-6px); }

@media (max-width:768px){
  .mbtiPoster-code{ font-size: clamp(44px, 20vw, 72px); letter-spacing:.14em; }
  .result-text-col .mbtiPoster{ transform: translateY(-2px); }
}
.mbtiLabel{
  font-size:12px;
  letter-spacing:1px;
  font-weight:800;
  color:var(--cos-primary-600);
  text-transform:uppercase;
}

/* 기존 codeCapsule은 유지하고, 히어로에서는 더 크게 */
.codeCapsule--lg{
  font-size:16px;
  padding:6px 12px;
  letter-spacing:2px;
  background: var(--cos-primary);
  color:#fff;
  border-radius:999px;
}

@media (max-width:768px){
  .mbtiBadge{ padding:8px 12px; gap:8px; }
  .codeCapsule--lg{ font-size:14px; }
}


.resultImgWrap{
  position:relative;
  width:100%;
  border-radius:14px;
  overflow:hidden;                 /* 모서리만 둥글게 */
  background: transparent;         /* 배경색도 제거(원하면 유지 가능) */
  padding:0;                       /* ← 여백 제거 */
}
.resultImg{
  width:100%;                      /* 가로 꽉 차게 */
  height:auto;                     /* 세로는 비율대로 */
  object-fit: contain;             /* 자르지 않음 */
  display:block;
  /* 필요 시 높이 제한을 두고 싶다면 아래 한 줄만 유지:
     max-height: 56vh;  */
}

@media (max-width:768px){
  .resultImg{ max-height:44vh; }    /* 모바일에서 조금 더 낮게 */
}
   .resultDetailsCard{ margin-top:-8px; }
.imgOverlayBenefit{
  position:absolute; left:18px; top:18px;
  max-width:70%;
  font-size:28px; line-height:1.25;
  font-weight:800; letter-spacing:-.2px;
  color:var(--cos-primary-600);
}
@media (max-width:768px){
  .imgOverlayBenefit{ font-size:22px; }
}
    .seeWhy{ display:inline-flex; align-items:center; gap:6px; font-weight:600; font-size:14px; color:var(--cos-primary-600); text-decoration:none; }
    .linkBtn .chev{ width:10px; height:10px; border:2px solid currentColor; border-left:0; border-top:0; transform:rotate(-45deg); }

    @keyframes flashCard { 0%{ box-shadow: 0 0 0 rgba(0,0,0,0); } 40%{ box-shadow: 0 12px 28px rgba(0,0,0,.10); } 100%{ box-shadow: 0 10px 24px rgba(0,0,0,.06); } }
    .flash{ animation: flashCard 900ms ease-out 1; }

    /* ===== Result (result page) ===== */
    .resultGrid{ display: grid; grid-template-columns: minmax(320px,1fr) minmax(360px,1fr); gap: 18px 28px; align-items: start; }
    .spanAll{ grid-column: 1 / -1; }

    .codeCapsule{ display:inline-flex; align-items:center; justify-content:center; flex: 0 0 auto !important; width:auto !important; max-width:max-content; white-space:nowrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace; background: var(--cos-ink); color: #fff; font-size: 12px; letter-spacing: 1.5px; padding: 4px 10px; border-radius: 999px; font-weight:700; }

/* ADD: prominent MBTI badge */
.mbtiBadge{
  display:inline-flex; align-items:center; gap:12px;
  padding:12px 16px;
  border:1px solid var(--cos-line);
  border-radius:999px;
  background: color-mix(in srgb, var(--cos-accent) 22%, white);
  box-shadow: var(--cos-shadow-card);
}
.mbtiLabel{
  font-size:13px; font-weight:800; letter-spacing:.6px;
  color:var(--cos-primary-600);
  text-transform:uppercase;
}
.mbtiCode{
  display:inline-flex; align-items:center; justify-content:center;
  min-width:64px; height:38px; padding:0 12px;
  border-radius:999px;
  background:var(--cos-primary); color:#fff;
  font-weight:900; letter-spacing:1.6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
  font-size:14px;
}
/* 결과 카드 우측 텍스트 칼럼에서 살짝 위로 띄워 보이게 */
.result-text-col .mbtiBadge{ transform: translateY(-4px); }

@media (max-width:768px){
  .mbtiBadge{ padding:10px 14px; gap:10px; }
  .mbtiCode{ min-width:56px; height:32px; font-size:13px; }
}

    .sectionTitle{ margin: 0 0 8px 0; font-size: 16px; font-weight: 700; letter-spacing: -.2px; }
    .resultList{ margin: 8px 0 0; padding-left: 20px; list-style: disc; }
    .resultList li{ margin: 6px 0; line-height: 1.58; font-size: 14px; }
    .resultCardSoft{ padding:16px; border:1px solid var(--cos-line); border-radius:var(--cos-radius-card); background: color-mix(in srgb, var(--cos-accent) 32%, white); }

    @media (max-width:768px){
      .resultGrid{ grid-template-columns: 1fr; gap: 14px; }
      .spanAll{ grid-column: auto; }
    }

    .rowSplit{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
    .stack24{ display:flex; flex-direction:column; gap:24px; }
    .muted{ color:var(--cos-sub); font-size:12px; }
    .mutedNote{ margin-top:10px; font-size:12px; color:var(--cos-sub); }

    /* ===== Result cover (hero) ===== */
    .result-hero-grid{ display: grid; grid-template-columns: 1.05fr 1fr; align-items: center; gap: var(--cover-pad); }
.resultImgWrap{
  position:relative;
  width:100%;
  aspect-ratio: var(--result-aspect, 3 / 4); /* ← 이 줄 추가 */
  border-radius:14px;
  overflow:hidden;                 /* 모서리만 둥글게 */
  background: transparent;         /* 배경색도 제거(원하면 유지 가능) */
  padding:0;                       /* ← 여백 제거 */
  display:flex; align-items:center; justify-content:center;
}
    .result-text-col{ display:grid; grid-template-rows:auto 1fr; gap:20px; }
    .result-logo-wrap{ display:flex; justify-content:center; align-items:flex-start; transform: translateY(-12px); }
    .resultLogo{ height:64px; width:auto; }
.resultCover .result-logo-wrap{ display:none; }
    .resultTitle{ margin:0; font-size:28px; line-height:1.2; font-weight:800; letter-spacing:-.2px; }
.resultTitle{ display:none !important; }
    .resultSub{ margin:6px 0 0; font-size:14px; line-height:1.6; color:var(--cos-sub); max-width:56ch; }
    .ctaRow{ display:flex; gap:8px; margin-top:8px; flex-wrap:wrap; }

    /* compact */
    .resultCover--compact { padding: var(--cover-pad); }

    .divider{ height:1px; background: var(--cos-line); margin: 18px 0; }

 .resultDetails{ display:grid; grid-template-columns: minmax(320px,1fr) minmax(360px,1fr); gap:22px 28px; scroll-margin-top:72px; }
    .resultDetails section{ max-width:none; }
    .resultDetails section.detailBlock{ padding:16px; border:1px solid var(--cos-line); border-radius:12px; background: color-mix(in srgb, var(--cos-accent) 20%, white); box-shadow: 0 6px 16px rgba(0,0,0,.04); }
    .detailBlock--wide{ grid-column: 1 / -1; }
.detailBlock--wide{
  grid-column: 1 / -1;
  position: relative;      /* 버튼 고정용 */
  padding-bottom: 72px;    /* 버튼 들어갈 여백 확보 */
}

.whyCta{
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
@media (max-width:768px){
  .detailBlock--wide{ padding-bottom: 16px; }
  .whyCta{ position: static; justify-content: flex-end; margin-top: 12px; }
}

    .whyGrid{ display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:16px 20px; }
    .whyCard{ padding:14px 16px; border:1px solid var(--cos-line); border-radius:12px; background: color-mix(in srgb, var(--cos-accent) 24%, white); }
    .whyList{ margin:0; padding-left:18px; }
    .whyList li{ margin:6px 0; font-size:14px; line-height:1.58; }
    @media (max-width:1024px){ .whyGrid{ grid-template-columns: repeat(2, minmax(0,1fr)); } }
    @media (max-width:768px){ .whyGrid{ grid-template-columns: 1fr; } }

    #why{ scroll-margin-top:72px; }

    /* ===== Hero (cover) ===== */
    .coverCard{ min-height: clamp(560px, 70vh, 820px); padding: var(--cover-pad); }
    .coverCard .hero-grid{ height: 100%; }

    .hero-grid{ display: grid; grid-template-columns: 1.05fr 1fr; align-items: center; gap: var(--cover-pad); }
.heroImgWrap{
  width:100%;
  aspect-ratio: 3 / 4;         /* NEW: 비율을 래퍼에 부여 */
  border-radius:14px;
  overflow:hidden;
  background: color-mix(in srgb, var(--cos-accent) 60%, white);
}

/* 이미지는 래퍼를 꽉 채우되, 포커스는 좌측 하단 쪽으로 보정 */
.heroImg{
  width:100%;
  height:100%;
  object-fit: cover;
  display:block;
  /* 커버 기본 포커스: X=48%로 살짝 오른쪽을 덜 보게 → 피사체가 중앙으로 */
  object-position: var(--hero-focal, 48% 58%);
}

@media (max-width:768px){
  .heroImgWrap{ aspect-ratio:auto; }
  .heroImg{
    height: min(46vh, 360px);
    object-position: var(--hero-focal-mobile, 50% 60%);
  }
}

    .hero-text-col{ display:grid; grid-template-rows:auto 1fr; min-height:0; text-align:left; gap:24px; }
    .hero-logo-wrap{ display:flex; justify-content:center; align-items:flex-start; padding-left: 0; transform: translateY(-12px); }
    .heroMainLogo{ display:block; height:96px; width:auto; margin:0; transform: translate(var(--logo-x), var(--logo-y)); }

    .heroTitle{ margin:0; font-size:32px; line-height:1.2; letter-spacing:-0.2px; font-weight:800; font-variation-settings: 'wght' 800; }
.heroSub{
  margin: 0 0 12px 0;              /* 버튼과 동일한 12px 하단 간격 부여 */
  font-size: 14px; color: var(--cos-sub);
  max-width: 56ch; line-height: 1.6;
  margin-left: var(--sub-nudge-x);
}

    @media (max-width:768px){
      .coverCard{ min-height: calc(100svh - env(safe-area-inset-top) - env(safe-area-inset-bottom)); padding:20px; }
      .hero-grid{ grid-template-columns: 1fr; gap: 20px; }
      .hero-logo-wrap{ transform: translateY(-6px); }
      .heroMainLogo{ height:72px; }
      .heroTitle{ font-size: clamp(20px, 4.8vw, 28px); }
      .heroSub{ font-size: clamp(12px, 3.4vw, 14px); margin-left: 0; }
      .heroImg{ aspect-ratio: auto; height: min(46vh, 360px); }
      .resultLogo{ height:48px; }
      .resultTitle{ font-size: clamp(20px, 4.8vw, 28px); }
    }
/* Why 블록 우하단 CTA 컨테이너: 오른쪽 정렬 + 여백 */
.whyCta{
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* 순서 교체: Retake가 왼쪽(1), Amazon이 오른쪽(2) */
.whyCta .btnGhostFlat{ order: 1; }
.whyCta .btnPrimary--amazon{ order: 2; }

/* View on Amazon 강조(크게/가독성/그림자) */
/* Amazon brand orange CTA */
.btnPrimary--amazon{
  /* ↓ 기존: min-width: clamp(176px, 22vw, 240px); height: 48px; */
  min-width: clamp(160px, 20vw, 220px);
  height: 44px;
  padding: 0 14px;              /* 폭 살짝 축소 */
  background: var(--amz-orange);
  border-color: var(--amz-orange);
  color:#fff;
  font-weight: 900;
  letter-spacing: .2px;
  box-shadow: 0 10px 24px rgba(255,153,0,.35);
}
.btnPrimary--amazon:hover{
  background: var(--amz-orange-600);
  border-color: var(--amz-orange-600);
  transform: translateY(-1px);
  box-shadow: 0 14px 32px rgba(255,153,0,.45);
}
.btnPrimary--amazon:active{ transform: translateY(0); box-shadow: 0 8px 18px rgba(255,153,0,.30); }
.btnPrimary--amazon:focus-visible{ outline:3px solid rgba(255,153,0,.35); outline-offset:2px; }

/* 버튼 내부 화살표 아이콘(재사용) */
.btn .chev{
  width:12px; height:12px;
  border:2px solid currentColor; border-left:0; border-top:0;
  transform: rotate(-45deg);
  margin-left:8px;
}

/* 첫 3초 동안만 은은한 어텐션(2회) – 접근성 고려 */
@media (prefers-reduced-motion: no-preference){
  @keyframes ctaPop { 0%{transform:scale(1)} 50%{transform:scale(1.03)} 100%{transform:scale(1)} }
  .btnPrimary--amazon.attn{ animation: ctaPop 1500ms ease 2; }
}

/* 모바일에선 위치 고정 대신 아래로 붙이고 Amazon을 더 넓게 */
@media (max-width:768px){
  .detailBlock--wide{ padding-bottom: 16px; }      /* 기존 여백 축소 */
  .whyCta{ position: static; justify-content: flex-end; margin-top: 12px; }
  .whyCta .btnPrimary--amazon{ flex: 1; }
}
/* === Softer OSPW card (borderless + beige background) === */
.result-text-col .mbtiPoster-card{
  /* 기존 얇은 회색 테두리 제거 */
  border: none !important;

  /* 아주 옅은 베이지 배경 */
  background: color-mix(in srgb, var(--cos-accent) 30%, white) !important;

  /* 살짝만 떠 보이게 */
  box-shadow: 0 8px 18px rgba(0,0,0,.06);
  border-radius: 14px;
  padding: 12px 18px;
}

/* 글자 톤과 굵기 부드럽게 */
.result-text-col .mbtiPoster-code{
  /* 굵기: 700(볼드) 권장 — 조금 더 가볍게 보이려면 600으로 바꿔도 OK */
  font-weight: 700; /* ← 600으로 변경 가능 */

  /* 완전 블랙 대신 딥 아쿠아 느낌 */
  color: color-mix(in srgb, var(--cos-primary) 70%, #0E1A18 30%);

  /* 자간 살짝 줄여 세련미 */
  letter-spacing: .08em;

  /* 과확대 방지(원래 값보다 살짝 낮춰도 됨) */
  font-size: clamp(48px, 10vw, 120px);
}

/* 라벨도 살짝 톤 다운(선택 사항) */
.result-text-col .mbtiPoster-label{
  color: var(--cos-sub);
  font-weight: 700;
  text-transform: none;
  letter-spacing: .08em;
}
/* === MBTI 카드: 소프트 보더 버전 === */
.result-text-col .mbtiPoster-card{
  border: 1px solid color-mix(in srgb, var(--cos-primary) 14%, var(--cos-line) 86%) !important;
  background: color-mix(in srgb, var(--cos-accent) 26%, white) !important;
  border-radius: 16px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.6),
    0 8px 16px rgba(0,0,0,.06);
  padding: 12px 18px; /* 테두리 생겨도 여백 유지 */
}

/* 호버 시 살짝 강조 (선택) */
.result-text-col .mbtiPoster-card:hover{
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.7),
    0 10px 22px rgba(0,0,0,.08);
}
    /* 1) 민트 버튼 팔레트 토큰 (원하는 위치: :root 안/밖 아무데나 한 번만 정의) */
    :root{
  --see-bg:        #CDEBE4;
  --see-bg-hover:  #BADFD9;
  --see-bg-press:  #A7D4CD;
  --see-border:    #72BEB1;
  --see-ink-strong:#173B35;
    }

    /* 2) See why 버튼 변형 – 중복 없이 여기 ‘한 번만’ */
.linkBtn.seeWhyBtn--mint{
  background: var(--see-bg);          /* 진한 민트 */
  color: var(--see-ink-strong);       /* 진한 잉크 글자 */
  border-color: var(--see-border);    /* 더 어두운 윤곽선 */

  /* 또렷한 테두리 + 은은한 외곽 halo */
  box-shadow:
    0 10px 24px rgba(0,0,0,.12),
    0 0 0 1px rgba(23,59,53,.06);

  /* 살짝 볼륨감 */
  transform: translateY(0);
  font-weight: 800;
}

.linkBtn.seeWhyBtn--mint:hover{
  background: var(--see-bg-hover);                 /* 한 톤 더 진하게 */
  border-color: color-mix(in srgb, var(--see-border) 88%, black 12%);
  transform: translateY(-1px);
  box-shadow:
    0 14px 32px rgba(0,0,0,.14),
    0 0 0 1px rgba(23,59,53,.08);
}

.linkBtn.seeWhyBtn--mint:active{
  background: var(--see-bg-press);
  transform: translateY(0);
  box-shadow:
    0 8px 18px rgba(0,0,0,.10),
    0 0 0 1px rgba(23,59,53,.08);
}

.linkBtn.seeWhyBtn--mint:focus-visible{
  outline: 3px solid color-mix(in srgb, var(--cos-primary) 34%, transparent);
  outline-offset: 2px;
}

.linkBtn.seeWhyBtn--mint .chev{
  border-color: currentColor; /* 아이콘도 글자색과 동기화 */
}
.resultCover .ctaRow .linkBtn.seeWhyBtn--mint{
  border-radius: 18px;        /* MBTI 카드(18px)와 통일 */
  border-width: 2px;
  border-color: var(--cos-primary); /* 경계 또렷 */
  box-shadow:
    0 8px 18px rgba(13,26,24,.08),
    0 0 0 1px rgba(13,26,24,.05);
  font-size: 15px;
  font-weight: 900;
  letter-spacing: .2px;
  height: 50px;
  padding: 0 20px;
}

.resultCover .ctaRow .linkBtn.seeWhyBtn--mint:hover{
  background: #fff; /* 배경은 깔끔하게 유지, 윤곽만 강조 */
  border-color: color-mix(in srgb, var(--cos-primary) 96%, white 4%);
  box-shadow:
    0 12px 24px rgba(13,26,24,.10),
    0 0 0 1px rgba(13,26,24,.07);
  transform: translateY(-1px);
}

/* 버튼과 MBTI 카드 사이 간격 */
.resultCover .ctaRow{ margin-top: 10px; }
  `}</style>
)
/** =========================
 *  Data / scoring
 *  ========================= */

type FeatureKey =
  | 'oil_prone'
  | 'cleanser_need'
  | 'hvac_dry'
  | 'uv_high'
  | 'hard_water'  | 'sensitivity'
  | 'redness'
  | 'actives_sting'
  | 'goal_calm'
  | 'goal_firm'
  | 'goal_tone'

  | 'gel_layers'
  | 'creamy_one'
  | 'topup_need'

export type FeatureVector = Partial<Record<FeatureKey, number>>

export type Product = {
  id: string
  name: string
  asin?: string
  image?: string
  weights: Partial<Record<FeatureKey, number>>
  fallbackRank: number
  /** NEW: 프로모(이미지 안에 큰 텍스트가 있는) 이미지 표시용 플래그 & 포지션 */
  hasTextInImage?: boolean
  focal?: string           // 예: '30% 55%' → object-position 보정
}

const PRODUCTS: Product[] = [
  {
    id: 'AquaGelCleanser',
    name: 'Calming Effect Aqua Gel Cleanser',
    asin: 'B0C8LR753L',
    image: '/products/AquaGelCleanser.jpg',
    weights: { oil_prone: 3, cleanser_need: 3, hard_water: 2, sensitivity: 1 },
    fallbackRank: 10,
  },
  {
    id: 'HydratingComplexMist',
    name: 'Hydrating Complex Mist',
    asin: 'B0C8M9M63J',
    image: '/products/HydratingComplexMist.jpg',
    weights: { topup_need: 3, hvac_dry: 1, gel_layers: 1 },
    fallbackRank: 9,
  },
  {
    id: 'AzuleneBoostAmpoule',
    name: 'Azulene Boost Ampoule',
    asin: 'B0C8M2KHG4',
    image: '/products/AzuleneBoostAmpoule.jpg',
    weights: { goal_calm: 3, sensitivity: 3, redness: 2, hvac_dry: 1, gel_layers: 2 },
    fallbackRank: 8,
  },
  {
    id: 'UltraCicaRecoveryCream',
    name: 'Ultra Cica Recovery Cream',
    asin: 'B0C8LWW9J5',
    image: '/products/UltraCicaRecoveryCream.jpg',
    weights: { goal_calm: 2, sensitivity: 2, hvac_dry: 2, hard_water: 1, creamy_one: 3 },
    fallbackRank: 7,
  },
  {
    id: 'HyaluronBoostAmpoule',
    name: 'Hyaluron Boost Ampoule',
    asin: 'B0C8LXLCJQ',
    image: '/products/HyaluronBoostAmpoule.jpg',
    weights: { hvac_dry: 3, goal_calm: 1, gel_layers: 2, topup_need: 1 },
    fallbackRank: 6,
  },
  {
    id: 'CeramideSnowCream',
    name: 'Ceramide Snow Cream',
    asin: 'B0C8LWQ1QT',
    image: '/products/CeramideSnowCream.jpg',
    weights: { hvac_dry: 2, hard_water: 2, creamy_one: 3 },
    fallbackRank: 5,
  },
  {
    id: 'VitaC_BoostAmpoule',
    name: 'Vita-C Boost Ampoule',
    asin: 'B0C8LV9TK6',
    image: '/products/VitaC_BoostAmpoule.jpg',
    weights: { goal_tone: 3, uv_high: 3, gel_layers: 1, actives_sting: -2, sensitivity: -1 },
    fallbackRank: 4,
  },
  {
    id: 'BrighteningFirmCream',
    name: 'Brightening Firm Cream',
    asin: 'B0C8LXQWRW',
    image: '/products/BrighteningFirmCream.jpg',
    weights: { goal_tone: 2, uv_high: 1, creamy_one: 3, sensitivity: 1 },
    fallbackRank: 3,
  },
  {
    id: 'EGF_BoostAmpoule',
    name: 'EGF Boost Ampoule',
    asin: 'B0C8M9VLGK',
    image: '/products/EGF_BoostAmpoule.jpg',
    weights: { goal_firm: 3, gel_layers: 2, hvac_dry: 1 },
    fallbackRank: 2,
  },
  {
    id: 'BouncySerum',
    name: 'Bouncy Serum',
    asin: 'B0C8LS29SB',
    image: '/products/BouncySerum.jpg',
    weights: { goal_firm: 2, gel_layers: 2, hvac_dry: 1 },
    fallbackRank: 1,
  },
  {
    id: 'RePerfectCream',
    name: 'Re’Perfect Cream',
    asin: 'B0FBLQ59QD',
    image: '/products/RePerfectCream.jpg',
    weights: { goal_firm: 2, creamy_one: 3, hvac_dry: 1, hard_water: 1 },
    fallbackRank: 0,
  },
  { id: 'TBD_12', name: '[TBD #12]', image: '', weights: {}, fallbackRank: 11 },
]

const FEATURE_MAP: Record<string, Record<string, FeatureVector>> = {
  Q0_age: { under_20: {}, '20~29': {}, '30~39': {}, '40~49': {}, '50~59': {}, '60+': {} },
  Q0_gender: { female: {}, male: {}, nonbinary: {}, prefer_not: {} },
  Q1_tissue: { clear: { oil_prone: 2, cleanser_need: 2 }, faint: { oil_prone: 1 }, none: { hvac_dry: 1 } },
  Q2_sun_no_sunscreen: { burn_quick: { uv_high: 1, sensitivity: 1 }, tan_easily: { uv_high: 2 }, unsure: {} },
  Q3_weekday_env: { indoor_hvac: { hvac_dry: 2 }, midday_sun: { uv_high: 2 }, neither: {} },
  Q4_actives_sting: {
    no_reaction: {},
    brief_sting: { actives_sting: 1 },
    redness_24h: { actives_sting: 2, sensitivity: 1 },
    clear_irritation: { actives_sting: 2, sensitivity: 2 },
  },
  Q5_goal: { calm: { goal_calm: 2 }, firm: { goal_firm: 2 }, tone: { goal_tone: 2 } },
  Q6_topup_need: {
    dry_cracked: { hvac_dry: 1, topup_need: 2 },
    same_as_morning: {},
    oily_meltdown: { oil_prone: 2, cleanser_need: 2 },
  },
  Q7_texture_pref: { gel_light: { gel_layers: 2 }, lotion: { gel_layers: 1, creamy_one: 1 }, rich_cream: { creamy_one: 2 } },
  Q8_after_washing_tight: { often: { hvac_dry: 2, hard_water: 0 }, sometimes: { hvac_dry: 1 }, rarely: {} },
  Q9_breakout_freq: { often: { oil_prone: 2, cleanser_need: 2 }, sometimes: { oil_prone: 1 }, rarely: {} },
  Q10_redness_trigger: { heat_workout: { redness: 2 }, after_cleansing: { sensitivity: 1, hard_water: 1 }, rarely: {} },
  Q11_one_and_done: { yes: { creamy_one: 2 }, no: { gel_layers: 2 }, mix: { creamy_one: 1, gel_layers: 1 } },
  Q12_ingredient_pref: { heal: {}, waterfull: {}, reborn: {}, lively: {}, no_pref: {} },
}

const AXIS_DESC_EN = {
  O: 'O (Oily): Skin with higher sebum—more shine, visible pores, and frequent comedones.',
  D: 'D (Dry): Lacks oil and moisture—feels tight, flakes easily, makeup lifts.',
  S: 'S (Sensitive): Reacts easily—turns red or stings with fragrance, friction, or acids.',
  R: 'R (Resistant): Tolerant to products—few reactions even with active ingredients.',
  P: 'P (Pigmented): Prone to dark marks—post-acne or sun spots linger.',
  N: 'N (Non-pigmented): Marks fade fast—tone stays even.',
  W: 'W (Wrinkle-prone): Fine lines set in easily due to dryness and reduced elasticity.',
  T: 'T (Tight): Good firmness—minimal concern about wrinkles for now.',
} as const

/* At-a-glance (모든 16코드) */
const MBTI_AT_A_GLANCE_EN: Record<string, string[]> = {
  OSPW: [
    'Forehead and nose get shiny fast; pores look more visible.',
    'Skin reacts easily—stings or flushes with friction or strong actives.',
    'Dark marks linger and fine lines show in dry weather.',
  ],
  OSPT: [
    'Shine builds up quickly with occasional clogged pores.',
    'Sensitive to actives or fragrance; brief sting or redness.',
    'Tans/darkens easily and marks can linger.',
  ],
  OSNW: [
    'Oily T-zone with noticeable pores.',
    'Easily flushed or reactive to scrubs and acids.',
    'Marks fade reasonably fast, but fine lines show in dryness.',
  ],
  OSNT: [
    'Shine appears by midday; makeup slides sooner.',
    'Reactive to friction or strong acids.',
    'Post-blemish marks fade quickly; overall tone stays even.',
  ],
  ORPW: [
    'Oilier areas shine with visible pores.',
    'Handles most actives well with minimal irritation.',
    'Prone to lingering dark marks and early fine lines when dry.',
  ],
  ORPT: [
    'Generally clear but gets shiny; pores are noticeable.',
    'Tolerant to actives; can scale up strength.',
    'Tans/darkens easily, though firmness feels decent.',
  ],
  ORNW: [
    'Shine and pores are noticeable, breakouts are occasional.',
    'Rare reactions to products.',
    'Marks fade fast, but surface lines show in dry weather.',
  ],
  ORNT: [
    'Generally clear, but shine and pores are noticeable.',
    'Marks rarely linger; tone stays even.',
    'Handles most actives fine.',
  ],
  DSPW: [
    'Matte overall; tight after washing—flaking on dry days.',
    'Skin stings or reddens easily with acids or fragrance.',
    'Dark marks linger and fine lines show readily.',
  ],
  DSPT: [
    'Dry-tight feel after cleansing; prefers cushy textures.',
    'Reactive—keep actives gentle and spaced out.',
    'Prone to tanning/dark marks that linger.',
  ],
  DSNW: [
    'Matte overall; tight after washing.',
    'Few breakouts; flakes show on dry days.',
    'Fine surface lines appear easily in dry weather.',
  ],
  DSNT: [
    'Matte overall; tight after washing.',
    'Few breakouts; flakes show on dry days.',
    'Fine surface lines appear easily in dry weather.',
  ],
  DRPW: [
    'Dry-leaning skin that feels tight without moisturizer.',
    'Generally tolerant to products and stronger actives.',
    'Dark marks linger and fine lines show in dry weather.',
  ],
  DRPT: [
    'Matte with minimal oil; needs steady hydration.',
    'Tolerates actives well; can use layered routines.',
    'Tans/darkens easily though firmness is still okay.',
  ],
  DRNW: [
    'Matte and tight after washing; benefits from richer creams.',
    'Rarely irritated—acts tolerate well.',
    'Marks fade quickly, but fine lines appear with dryness.',
  ],
  DRNT: [
    'Dry-leaning and tight after cleansing.',
    'Tolerant to most products; minimal sensitivity.',
    'Tone stays even; firmness feels good for now.',
  ],
}

function mbtiAtAGlance(code: string) {
  return MBTI_AT_A_GLANCE_EN[code] ?? []
}

/** utils */
function sumFeatures(answers: Record<string, string>): FeatureVector {
  const acc: FeatureVector = {}
  for (const q of Object.keys(answers)) {
    const delta = (FEATURE_MAP as any)[q]?.[answers[q]] || {}
    for (const fk of Object.keys(delta) as FeatureKey[]) {
      acc[fk] = (acc[fk] || 0) + (delta as any)[fk]
    }
  }
  return acc
}

/* 옵션 키와 일치하도록 타입 수정 */
type Answers = Record<string, string> & {
  Q1_tissue?: 'clear' | 'faint' | 'none'
  Q5_goal?: 'tone' | 'firm' | 'calm'
  Q4_actives_sting?: 'clear_irritation' | 'redness_24h' | 'brief_sting' | 'no_reaction'
  Q6_topup_need?: 'oily_meltdown' | 'dry_cracked' | 'same_as_morning'
}

function gateRecommendation(answers: Answers, products: Product[]): Product | null {
  const q1 = answers['Q1_tissue']
  const qGoal = answers['Q5_goal']
  const qAct = answers['Q4_actives_sting']
  const qPM = answers['Q6_topup_need']
  const pick = (id: string) => products.find((p) => p.id === id) ?? null

  if (q1 === 'clear' && qGoal !== 'tone') return pick('AquaGelCleanser')
  if (qGoal === 'tone' && (qAct === 'redness_24h' || qAct === 'clear_irritation')) return pick('BrighteningFirmCream')
  if (qPM === 'dry_cracked' && qGoal !== 'firm') return pick('HydratingComplexMist')
  if (qPM === 'oily_meltdown') return pick('AquaGelCleanser')
  return null
}

function scoreProducts(features: FeatureVector, answers: Record<string, string>) {
  const preference = answers['Q12_ingredient_pref']
  const scored = PRODUCTS.map((p) => {
    let s = 0
    const detail: Record<FeatureKey, number> = {} as any
    for (const k of Object.keys(p.weights) as FeatureKey[]) {
      const contrib = (features[k] || 0) * (p.weights[k] || 0)
      if (contrib) detail[k] = contrib
      s += contrib
    }
    if (preference) {
      const bonus: { [k: string]: string[] } = {
        heal: ['AzuleneBoostAmpoule', 'UltraCicaRecoveryCream'],
        waterfull: ['HyaluronBoostAmpoule', 'HydratingComplexMist'],
        reborn: ['EGF_BoostAmpoule', 'BouncySerum', 'RePerfectCream'],
        lively: ['VitaC_BoostAmpoule', 'BrighteningFirmCream'],
      }
      if (bonus[preference]?.includes(p.id)) s += 1
    }
    return { product: p, score: s, detail }
  })
  return scored.sort((a, b) => b.score - a.score)
}

function tieBreak(
  scored: { product: Product; score: number; detail: Record<FeatureKey, number> }[],
  _features: FeatureVector,
  answers: Record<string, string>
) {
  if (!scored.length) return null
  const top = scored.filter((x) => x.score === scored[0].score)
  if (top.length === 1) return top[0]

  const gk = (answers['Q5_goal'] === 'calm'
    ? 'goal_calm'
    : answers['Q5_goal'] === 'firm'
    ? 'goal_firm'
    : 'goal_tone') as FeatureKey

  const byGoal = [...top].sort((a, b) => (b.detail[gk] || 0) - (a.detail[gk] || 0))
  if ((byGoal[0].detail[gk] || 0) !== (byGoal[1]?.detail[gk] || 0)) return byGoal[0]

  const tex = (r: any) => (r.detail['creamy_one'] || 0) + (r.detail['gel_layers'] || 0)
  const byTex = [...byGoal].sort((a, b) => tex(b) - tex(a))
  if (tex(byTex[0]) !== tex(byTex[1])) return byTex[0]

  const env = (r: any) => (r.detail['hvac_dry'] || 0) + (r.detail['uv_high'] || 0) + (r.detail['hard_water'] || 0)
  const byEnv = [...byTex].sort((a, b) => env(b) - env(a))
  if (env(byEnv[0]) !== env(byEnv[1])) return byEnv[0]

  const sens = (r: any) => (r.detail['sensitivity'] || 0) - Math.max(0, -(r.detail['actives_sting'] || 0))
  const bySens = [...byEnv].sort((a, b) => sens(b) - sens(a))
  if (sens(bySens[0]) !== sens(bySens[1])) return bySens[0]

  return [...bySens].sort((a, b) => a.product.fallbackRank - b.product.fallbackRank)[0]
}

type SkinMBTI = {
  code: string
  axes: { OD: 'O' | 'D'; SR: 'S' | 'R'; PN: 'P' | 'N'; WT: 'W' | 'T' }
  lines: string[]
}

function computeSkinMBTI(features: FeatureVector, answers: Record<string, string>): SkinMBTI {
  const oil = features.oil_prone || 0
  const hvac = features.hvac_dry || 0
  const sens = (features.sensitivity || 0) + (features.actives_sting || 0)
  const uv = features.uv_high || 0
  const hw = features.hard_water || 0
  const goalFirm = answers['Q5_goal'] === 'firm' ? 1 : 0

  const OD = oil >= 2 || (oil === 1 && hvac === 0) ? 'O' : 'D'
  const SR = sens >= 2 ? 'S' : 'R'
  const PN = uv >= 2 ? 'P' : 'N'
  const WT = goalFirm + hvac + hw >= 2 ? 'W' : 'T'
  const code = `${OD}${SR}${PN}${WT}`
  return { code, axes: { OD, SR, PN, WT }, lines: [AXIS_DESC_EN[OD], AXIS_DESC_EN[SR], AXIS_DESC_EN[PN], AXIS_DESC_EN[WT]] }
}

function productBenefits(product: Product | null, features: FeatureVector, answers: Record<string, string>): string[] {
  if (!product) return []
  const out: string[] = []
  const oil = features.oil_prone || 0,
    hvac = features.hvac_dry || 0,
    hw = features.hard_water || 0
  const sens = (features.sensitivity || 0) + (features.actives_sting || 0)
  const uv = features.uv_high || 0,
    topup = features.topup_need || 0
  const goal = answers['Q5_goal']

  switch (product.id) {
    case 'AquaGelCleanser':
      if (oil >= 1) out.push('Gently lifts afternoon oil without stripping, keeping pores clearer.')
      if (hw >= 1) out.push('Rinses clean even in hard water to reduce tight-feel after cleansing.')
      if (sens >= 1) out.push('Comfort-first surfactants help minimize post-wash redness.')
      break
    case 'HydratingComplexMist':
      if (topup >= 1 || hvac >= 1) out.push('Instant moisture top-up over makeup; great for dry office air.')
      out.push('Layer-friendly spritz to refresh barrier between steps.')
      break
    case 'AzuleneBoostAmpoule':
      if (sens >= 1) out.push('Blue chamazulene complex helps calm visible redness fast.')
      if (hvac >= 1) out.push('Light gel texture rehydrates without heaviness.')
      break
    case 'UltraCicaRecoveryCream':
      out.push('Cica + occlusive comfort to reduce flushing and lock in moisture.')
      if (hw >= 1) out.push('Barrier-forward cream to counter hard-water tightness.')
      break
    case 'HyaluronBoostAmpoule':
      out.push('Multi-weight hyaluron pulls water in for bounce.')
      if (hvac >= 1) out.push('Designed for long HVAC days—layer under or over moisturizer.')
      break
    case 'CeramideSnowCream':
      out.push('Ceramides seal hydration and fortify a taxed barrier.')
      if (hw >= 1) out.push('Great in mineral-heavy water areas to keep skin comfy after cleansing.')
      break
    case 'VitaC_BoostAmpoule':
      out.push('Targets dullness from UV and uneven tone with daily brightening.')
      if (sens >= 1) out.push('Use after moisturizer or every other day to stay comfortable.')
      break
    case 'BrighteningFirmCream':
      out.push('Gentle brightening for tone goals when strong actives sting.')
      if (uv >= 1) out.push('Supports more even-looking tone alongside SPF use.')
      break
    case 'EGF_BoostAmpoule':
      out.push('EGF complex supports a bouncy, firm look—great after sun/wind days.')
      break
    case 'BouncySerum':
      out.push('Peptide-forward plump without sting—good pick when skin is reactive.')
      break
    case 'RePerfectCream':
      out.push('Firming moisturizer locks hydration while supporting elasticity goals.')
      if (hvac + hw >= 1) out.push('Creamy finish shields against office air and hard water tightness.')
      break
    default:
      out.push('Formulated to match your current goal and environment signals.')
  }

  if (out.length < 3) {
    if (goal === 'calm') out.push('Prioritizes calm, comfortable feel by morning.')
    if (goal === 'firm') out.push('Aims for a bouncy, firm feel by morning.')
    if (goal === 'tone') out.push('Focuses on a fresher, more even-looking tone.')
  }
  return out.slice(0, 3)
}
function benefitCopy(p: Product | null){
  if (!p) return '';
  switch(p.id){
    case 'HydratingComplexMist':   return 'Deep bounce • 5-weight HA';
    case 'HyaluronBoostAmpoule':   return 'Long-wear hydration • Multi-HA';
    case 'AquaGelCleanser':        return 'Oil-lift cleanse • No tight feel';
    case 'UltraCicaRecoveryCream': return 'Cica barrier • Calm & lock-in';
    case 'VitaC_BoostAmpoule':     return 'Daily brightening • Tone clarity';
    default: return '';
  }
}
// NEW: concise explanation list used in the result "Why it suits" section
function whyItSuitsItems(
  product: Product | null,
  features: FeatureVector,
  answers: Record<string, string>,
  mbti: SkinMBTI
): string[] {
  if (!product) return []
  const items: string[] = []

  // 1) 제품 핵심 효과
  items.push(...productBenefits(product, features, answers))

  // 2) MBTI 축과의 적합 이유
  items.push(mbti.axes.OD === 'O' ? 'Balances midday shine without over-drying.' : 'Replenishes moisture to relieve tight-feel after washing.')
  items.push(mbti.axes.SR === 'S' ? 'Built for easily-reactive skin—keeps formulas gentle and fragrance-light.' : 'Leaves room to scale up actives when you want results faster.')
  items.push(mbti.axes.PN === 'P' ? 'Helps reduce the look of lingering post-blemish marks.' : 'Maintains an even-looking tone over time.')

  // 3) 환경 신호
  if ((features.hvac_dry || 0) >= 1) items.push('Keeps skin comfortable through long A/C or heater days.')
  if ((features.uv_high || 0) >= 1) items.push('Pairs well with daily SPF to support tone clarity.')

  // 중복 제거 + 길이 제한
  return Array.from(new Set(items)).slice(0, 6)
}

function productAmazonUrl(p: Product | null) {
  if (!p?.asin) return null
  const tag = (typeof process !== 'undefined' && (process as any).env?.NEXT_PUBLIC_AMZ_TAG) || ''
  const qs = tag ? `?tag=${encodeURIComponent(tag)}` : ''
  return `https://www.amazon.com/dp/${p.asin}${qs}`
}

/** =========================
 *  UI bits
 *  ========================= */
function Progress({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current + 1) / total) * 100)
  return (
    <div className="progress" aria-label="progress">
      <div className="progressFill" style={{ width: `${pct}%` }} />
    </div>
  )
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
  describedBy,
}: {
  name: string;
  options: { key: string; label: string }[];
  value?: string;
  onChange: (v: string) => void;
  describedBy?: string;              // ← 추가
}) {
  return (
    <div className="radioList" role="radiogroup" aria-labelledby={`${name}-label`}>
      {options.map((opt) => (
        <label key={opt.key} className={`radioLabel ${value === opt.key ? 'active' : ''}`}>
          <input className="radioInput" type="radio" name={name} value={opt.key} checked={value === opt.key} onChange={() => onChange(opt.key)} />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

/** cover */
function Cover({ onStart }: { onStart: () => void }) {
  return (
    <div className="card coverCard" style={{ maxWidth: 'var(--container-max)', marginLeft: 'auto', marginRight: 'auto' }}>
      <div className="hero-grid">
        {/* 왼쪽: 이미지 */}
        <div className="hero-image-col">
<div className="heroImgWrap">
 <img
  className="heroImg"
  src="/products/Ample4.jpg"
  alt="COSHEAL ampoules (4종)"
  loading="eager"
  style={{ ['--hero-focal' as any]: '48% 58%', ['--hero-focal-mobile' as any]: '50% 60%' }}
/>
</div>
        </div>
        {/* 오른쪽: 로고 + 본문(세로 중앙) */}
        <div className="hero-text-col">
          {/* 로고 (위 고정) */}
          <div className="hero-logo-wrap">
            <img src="/products/Cosheal_logo.png" alt="COSHEAL Logo" className="heroMainLogo" />
          </div>
          {/* 본문 (세로 중앙) */}
          <div className="hero-content-center">
            <div>
              <h2 className="heroTitle" style={{ fontSize: '28px' }}>What's your Cosheal type?</h2>
              <p className="heroSub">14 questions · about 3 minute </p>
            </div>
            <div>
              <button className="btn btnPrimary" onClick={onStart}>Start quiz</button>
              <p className="muted" style={{ marginTop: 12 }}> We’ll tailor recommendations to your skin condition and environmental cues. The result will be one product recommendation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** =========================
 *  Questions
 *  ========================= */

type Question = {
  id: string
  title: string
  options: { key: string; label: string }[]
  help?: string;
};

const QUESTIONS: Question[] = [
  { id: 'Q0_age', title: 'What’s your age range?', options: [
    { key: 'under_20', label: 'Under 20' },
    { key: '20~29', label: '20~29' },
    { key: '30~39', label: '30~39' },
    { key: '40~49', label: '40~49' },
    { key: '50~59', label: '50~59' },
    { key: '60+', label: '60+' },
  ]},
  { id: 'Q0_gender', title: 'How do you describe your gender?', options: [
    { key: 'female', label: 'Female' },
    { key: 'male', label: 'Male' },
    { key: 'nonbinary', label: 'Non-binary' },
    { key: 'prefer_not', label: 'Prefer not to say' },
  ]},
  { id: 'Q1_tissue', title: 'After blotting your T-zone (forehead and nose) with a tissue, what do you see?', options: [
    { key: 'clear', label: 'A clear oil stain, like a grease spot.' },
    { key: 'faint', label: 'A faint, translucent mark.' },
    { key: 'none', label: 'Nothing at all; the tissue is dry.' },
  ]},
  { id: 'Q2_sun_no_sunscreen', title: 'Imagine you’re in the sun for an hour without sunscreen. How does your skin typically react?', options: [
    { key: 'burn_quick', label: 'It turns red or burns easily.' },
    { key: 'tan_easily', label: 'It tans or darkens without much redness.' },
    { key: 'unsure', label: 'I’m not sure / I avoid the sun.' },
  ]},
  { id: 'Q3_weekday_env', title: 'What’s your most common weekday environment?', options: [
    { key: 'indoor_hvac', label: 'Mostly indoors with heating or A/C.' },
    { key: 'midday_sun', label: 'I spend a good amount of time outdoors in the sun.' },
    { key: 'neither', label: 'Neither.' },
  ]},
  { id: 'Q4_actives_sting', title: 'When you use potent “active” ingredients like Vitamin C, Glycolic Acid (AHA), or Retinol, you feel:', help: 'Active ingredients target tone, texture, or firmness. How does your skin feel when you use them?', options: [
    { key: 'clear_irritation', label: 'Obvious irritation, redness, or peeling that lasts.' },
    { key: 'redness_24h', label: 'Some redness or sensitivity for a day.' },
    { key: 'brief_sting', label: 'A brief tingling or stinging that fades quickly.' },
    { key: 'no_reaction', label: 'Not much, my skin handles them well.' },
  ]},
  { id: 'Q5_goal', title: 'What is your primary skin goal right now?', options: [
    { key: 'calm', label: 'To calm redness and sensitivity.' },
    { key: 'firm', label: 'To improve firmness and reduce fine lines.' },
    { key: 'tone', label: 'To brighten dullness and even out skin tone.' },
  ]},
  { id: 'Q6_topup_need', title: 'How does your skin feel in the afternoon, compared to right after your morning skin care routine?', options: [
    { key: 'oily_meltdown', label: 'Shiny and greasy; makeup feels like it’s sliding off.' },
    { key: 'dry_cracked', label: 'Tight and dry, sometimes with flaky patches.' },
    { key: 'same_as_morning', label: 'Pretty much the same as it did in the morning.' },
  ]},
  { id: 'Q7_texture_pref', title: 'You prefer skincare that feels:', options: [
    { key: 'gel_light', label: 'Light and watery, like gels or essences that sink in fast.' },
    { key: 'lotion', label: 'Somewhere in the middle, like a classic lotion.' },
    { key: 'rich_cream', label: 'Nourishing and substantial, like a rich cream.' },
  ]},
  { id: 'Q8_after_washing_tight', title: 'How often does your skin feel tight right after washing your face in the morning?', options: [
    { key: 'often', label: 'Almost always.' },
    { key: 'sometimes', label: 'Sometimes, especially in winter.' },
    { key: 'rarely', label: 'Rarely or never.' },
  ]},
  { id: 'Q9_breakout_freq', title: 'How frequently do you get pimples or blackheads?', options: [
    { key: 'often', label: 'Often, it’s a constant concern.' },
    { key: 'sometimes', label: 'Sometimes, usually around my cycle or when stressed.' },
    { key: 'rarely', label: 'Rarely, if ever.' },
  ]},
  { id: 'Q10_redness_trigger', title: 'Which of these is most likely to make your face flush or turn red?', options: [
    { key: 'heat_workout', label: 'Heat, spicy food, or a workout.' },
    { key: 'after_cleansing', label: 'Right after washing my face or physical touch.' },
    { key: 'rarely', label: 'My face rarely gets red.' },
  ]},
  { id: 'Q11_one_and_done', title: 'Which sounds more like your ideal nightly routine?', options: [
    { key: 'yes', label: '“One and done.” A single, effective cream is all I need.' },
    { key: 'no', label: '“Layer up!” I enjoy using multiple steps like toner, serum, and moisturizer.' },
    { key: 'mix', label: 'A simple mix, like a serum and a cream.' },
  ]},
  { id: 'Q12_ingredient_pref', title: 'Which skincare concept sounds most appealing to you today? (This is for context)', options: [
    { key: 'heal', label: '“Heal & Soothe” - focuses on calming and barrier repair.' },
    { key: 'waterfull', label: '“Water-full” - focuses on deep, layered hydration.' },
    { key: 'reborn', label: '“Reborn Firm” - focuses on elasticity and a bouncy texture.' },
    { key: 'lively', label: '“Lively Tone” - focuses on glow and a bright, even complexion.' },
    { key: 'no_pref', label: 'No preference, just show me what works.' },
  ]},
]

/** =========================
 *  Page
 *  ========================= */


export default function Page() {
  const [coverSeen, setCoverSeen] = useState(false)
  const [ix, setIx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const current = QUESTIONS[ix]
  const total = QUESTIONS.length
  const canNext = Boolean(current && answers[current.id])

  const features = useMemo(() => sumFeatures(answers), [answers])
  const hardGate = useMemo(() => gateRecommendation(answers as Answers, PRODUCTS), [answers])
  const scored = useMemo(() => scoreProducts(features, answers), [features, answers])
  const top = useMemo(() => (scored.length ? tieBreak(scored, features, answers) : null), [scored, features, answers])

  const showResult = submitted
  const finalProduct = hardGate || top?.product || null

  const mbti = useMemo(() => computeSkinMBTI(features, answers), [features, answers])

  const onSelect = (qid: string, key: string) => setAnswers((s) => ({ ...s, [qid]: key }))
  const onNext = () => setIx((i) => Math.min(i + 1, total - 1))
  const onPrev = () => setIx((i) => Math.max(i - 1, 0))
  const onSubmit = () => {
    setSubmitted(true)
    setTimeout(() => document.getElementById('result-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }
  const onRestart = () => {
    setAnswers({})
    setIx(0)
    setSubmitted(false)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToWhy = (e?: React.MouseEvent) => {
    e?.preventDefault()
    if (typeof window === 'undefined') return
    const container = document.getElementById('result-details') || document.getElementById('why')
    if (!container) return
    container.scrollIntoView({ behavior: 'smooth', block: 'start' })
    container.classList.add('flash')
    setTimeout(() => container.classList.remove('flash'), 1000)
  }

  return (
    <div className="page-bg">
      <GlobalPalette />

      {!coverSeen ? (
        /* ===== 커버 ===== */
        <div className="cover-layout">
          <Cover onStart={() => setCoverSeen(true)} />
        </div>
      ) : (
        /* ===== 본문 ===== */
        <div className="wrap">
          <header className="pageHeader">
            <h1>COSHEAL • Skin MBTI</h1>
            <span className="sub">US-tuned · 14 questions</span>
          </header>

          {!showResult ? (
            /* ===== 퀴즈 화면 ===== */
            <div className="stack24">
              <Progress current={ix} total={total} />
              <div className="card">
                <h2 id={`${current.id}-label`} style={{ fontSize: 18, margin: '0 0 12px 0', fontWeight: 600 }}>
                  {current.title}
                </h2>
{current.help && (
  <p id={`${current.id}-help`} className="muted" style={{ margin: '-4px 0 12px 0' }}>
    {current.help}
  </p>
)}
<RadioGroup
  name={current.id}
  options={current.options}
  value={answers[current.id]}
  onChange={(v) => onSelect(current.id, v)}
  describedBy={current.help ? `${current.id}-help` : undefined}   // ← 추가
/>
                <div className="rowSplit" style={{ marginTop: 16 }}>
                  <button className="btn btnGhost" onClick={onPrev} disabled={ix === 0}>Back</button>
                  {ix < total - 1 ? (
                    <button className="btn btnPrimary" onClick={onNext} disabled={!canNext}>Next</button>
                  ) : (
                    <button className="btn btnPrimary" onClick={onSubmit} disabled={!canNext}>See my match</button>
                  )}
                </div>
              </div>

{SHOW_DEV && (
              <div className="card">
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Live signals (dev only)</div>
                <pre
                  style={{
                    background: 'color-mix(in srgb, var(--cos-accent) 30%, white)',
                    padding: 12,
                    borderRadius: 12,
                    fontSize: 12,
                    margin: 0,
                    overflow: 'auto',
                  }}
                >
                  {JSON.stringify(features, null, 2)}
                </pre>
              </div>
)}
            </div>
          ) : (
            /* ===== 결과 화면 ===== */
            <div className="stack24">
              <div
                className="card resultCover resultCover--compact"
                id="result-hero"
                role="region"
                aria-live="polite"
                aria-labelledby="result-title"
              >
                <div className="result-hero-grid">
                  <div
                    className="resultImgWrap"
                    style={{
                      aspectRatio: (finalProduct?.hasTextInImage ? '16 / 10' : '3 / 4') as any,
                    }}
                  >
                    {finalProduct?.image ? (
                      <img
                        className="resultImg"
                        src={finalProduct.image}
                        alt={finalProduct.name}
                        loading="eager"
                        style={{
                          objectFit: 'contain',
                          objectPosition: (finalProduct?.focal as any) || 'center',
                        }}
                      />
                    ) : (
                      <div
                        className="muted"
                        style={{ aspectRatio: '3 / 4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Product image
                      </div>
                    )}
                  </div>

                  <div className="result-text-col">
                    <div className="result-logo-wrap">
                      <img src="/products/Cosheal_logo.png" alt="COSHEAL Logo" className="resultLogo" />
                    </div>
                    <div className="hero-content-center">
                      <div>
                        <h2 id="result-title" className="resultTitle">
                          {finalProduct?.name || 'We need a bit more info'}
                        </h2>
                        <div className="mbtiPoster" role="status" aria-label={`Your Skin MBTI is ${mbti.code}`}>
                          <div className="mbtiPoster-label">Your Skin MBTI</div>
<div className="mbtiPoster-card" role="img" aria-label={`Your Skin MBTI ${mbti.code}`}>
  <span className="mbtiPoster-code">
    {mbti.code.split('').map((ch, i) => (
      <span key={i} className="mbtiGlyph" aria-hidden="true">{ch}</span>
    ))}
  </span>
</div>
                        </div>
                      </div>
                      <div>
                        <div className="ctaRow">
<a className="linkBtn seeWhyBtn seeWhyBtn--mint attn"
  href="#result-details"
  onClick={scrollToWhy}
>
  See why this fits <span className="chev" aria-hidden />
</a>
                        </div>
                        <p className="mutedNote">Cosmetic guidance only. Not medical advice. Patch test recommended for sensitive skin.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="divider" />

                <div className="resultDetails" id="result-details">
<section className="detailBlock">
  <h3 className="sectionTitle">Your Skin MBTI</h3>
  <ul className="resultList axisList">
    {mbti.lines.map((t, i) => {
      const idx = t.indexOf(':');                 // "D (Dry): ..."
      const raw = idx >= 0 ? t.slice(0, idx) : t; // "D (Dry)"
      // 괄호 안만 Title Case 유지 → "D (Dry)"
      const label = raw.replace(/\(([^)]+)\)/, (_, x: string) =>
        `(${x.replace(/\b([a-zA-Z])([a-zA-Z]*)/g, (_, a, b) => a.toUpperCase() + b.toLowerCase())})`
      );
      const desc = idx >= 0 ? t.slice(idx + 1).trim() : '';

      return (
        <li key={i} className="axisItem">
          <span className="axisLabel"><strong>{label}</strong>:</span>
          <span className="axisDesc">{desc}</span>
        </li>
      );
    })}
  </ul>
</section>

                  <section className="detailBlock">
                    <h3 className="sectionTitle">Your skin, at a glance</h3>
                    <ul className="resultList">
                      {mbtiAtAGlance(mbti.code).map((t, i) => (<li key={i}>{t}</li>))}
                    </ul>
                  </section>

                  <section className="detailBlock detailBlock--wide" id="why">
                    <h3 className="sectionTitle">Why it suits {mbti.code}</h3>
                    <ul className="resultList">
                      {whyItSuitsItems(finalProduct, features, answers, mbti).map((t, i) => (<li key={i}>{t}</li>))}
                    </ul>
                    <div className="whyCta">
                      <button className="btn btnGhostFlat" onClick={onRestart}>Retake quiz</button>
                      {productAmazonUrl(finalProduct) ? (
                        <a
                          href={productAmazonUrl(finalProduct)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btnPrimary btnPrimary--amazon attn"
                        >
                          View on Amazon <span className="chev" aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  </section>
                </div>
              </div>

              {SHOW_DEV && (
              <div className="card">
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Top candidates (dev only)</div>
                <ol className="list" style={{ listStyle: 'decimal' }}>
                  {scored.slice(0, 3).map((r) => (
                    <li key={r.product.id}>
                      <strong>{r.product.name}</strong> — score {r.score}
                    </li>
                  ))}
                </ol>
              </div>
)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}