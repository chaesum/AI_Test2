import React, { useState } from 'react';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [featureModal, setFeatureModal] = useState<{ title: string; desc: string; items: string[] } | null>(null);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalMessages, setTerminalMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: '안녕하세요! 오늘 집중력 점검과 함께 주간 스케줄 조정을 도와드릴게요. 최근 취약했던 영역이 수학 단원인가요?'
    },
    {
      sender: 'user',
      text: '네, 미적분 문제 풀이 속도가 너무 더뎌서 시험 시간 배분이 고민이에요.'
    }
  ]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    const userMsg = terminalInput.trim();
    setTerminalMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setTerminalInput('');

    setTimeout(() => {
      setTerminalMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `"${userMsg}"에 대한 심층 진단이 준비되었습니다. 정밀한 주간 시간표와 오답 극복 루틴은 챗봇 상담실에서 바로 확인하실 수 있습니다!`
        }
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Interactive Ambient Atmospheric Canvas */}
      <div className="relative w-full overflow-hidden">
        {/* Ambient Radial Gradient Glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[840px] h-[480px] bg-primary/10 rounded-full blur-[140px]"></div>
        <div className="pointer-events-none absolute top-96 -left-32 w-[420px] h-[360px] bg-secondary-container/10 rounded-full blur-[120px]"></div>

        {/* 1. Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-24 lg:pt-20 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Column: Copy & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start z-10">
              {/* Overline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high text-primary text-xs font-semibold shadow-sm mb-6 border border-border-subtle/50">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span>차세대 AI 인지 코칭 &amp; 자기주도 학습 시스템</span>
              </div>

              {/* Main Hero Headline */}
              <h1 className="font-headline-xl text-3xl sm:text-5xl lg:text-6xl font-bold text-on-surface tracking-tight leading-tight mb-6">
                나만의 맞춤형 학습 파트너,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-fixed to-secondary">
                  학습 상담 챗봇
                </span>
              </h1>

              {/* Value Proposition Body */}
              <p className="font-dandi text-lg sm:text-xl text-on-surface-variant max-w-2xl mb-10 leading-relaxed tracking-wide">
                방대한 학습량 앞에서 길을 잃지 마세요. 개인의 학습 성향과 목표를 정밀하게 분석하여 매일의 실행 플랜, 과목별 취약점 보완, 슬럼프 멘탈 코칭까지 AI 전문가가 1:1로 함께 설계합니다.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => onNavigate('chat-consultation')}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-primary-container text-on-primary-container font-semibold shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all group cursor-pointer"
                >
                  <span>챗봇 상담 시작하기</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-surface-container text-on-surface font-semibold shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer border border-border-subtle/60"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">person_add</span>
                  <span>로그인 / 회원가입</span>
                </button>
              </div>

              {/* Proof Metrics Bar */}
              <div className="mt-12 pt-8 flex items-center gap-6 sm:gap-8 text-on-surface-variant border-t border-surface-container-high/60 w-full max-w-xl">
                <div className="flex flex-col">
                  <span className="font-headline-sm text-xl sm:text-2xl text-on-surface font-bold">24 / 7</span>
                  <span className="font-label-sm text-xs text-on-surface-variant">실시간 인지 진단 대기</span>
                </div>
                <div className="w-px h-8 bg-surface-container-highest"></div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-xl sm:text-2xl text-on-surface font-bold">1:1 최적화</span>
                  <span className="font-label-sm text-xs text-on-surface-variant">성향 맞춤 학습 루틴</span>
                </div>
                <div className="w-px h-8 bg-surface-container-highest"></div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-xl sm:text-2xl text-on-surface font-bold">100% 비공개</span>
                  <span className="font-label-sm text-xs text-on-surface-variant">철저한 고민 데이터 보호</span>
                </div>
              </div>
            </div>

            {/* Hero Right Column: Dynamic AI Interactive Consultation Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-surface-card border border-border-subtle rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                {/* Terminal Header */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-surface-container-high">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-status-danger/80"></span>
                    <span className="w-3 h-3 rounded-full bg-secondary-container/80"></span>
                    <span className="w-3 h-3 rounded-full bg-status-success/80"></span>
                    <span className="ml-2 text-xs font-medium text-on-surface-variant">
                      AI 학습 어드바이저 • 라이브 세션
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-status-success font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-status-success animate-ping"></span>
                    동기화됨
                  </span>
                </div>

                {/* Dialogue Simulation Flow */}
                <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                  {terminalMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 text-primary">
                          <span className="material-symbols-outlined text-[18px]">psychology</span>
                        </div>
                      )}
                      <div
                        className={`rounded-2xl p-4 text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-primary-container text-on-primary-container rounded-tr-sm max-w-[85%] shadow-md'
                            : 'bg-surface-elevated text-on-surface rounded-tl-sm shadow-sm'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* AI Analysis Card Block */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 text-secondary">
                      <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                    <div className="bg-surface-elevated rounded-2xl rounded-tl-sm p-4 w-full shadow-sm space-y-3 border border-border-subtle/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-secondary">진단 솔루션 제안</span>
                        <span className="text-xs text-on-surface-variant">소요 시간 25분 단위</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-on-surface-variant">
                          <span>개념 정착도</span>
                          <span className="text-on-surface font-semibold">82% (안정)</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                          <div className="bg-secondary-container h-full rounded-full w-[82%]"></div>
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        개념은 충분히 정립되었습니다. 오늘부터는{' '}
                        <strong className="text-on-surface font-medium">유형별 시간제한 스프린트 풀이</strong> 3회를 추천합니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simulated Input Box */}
                <form onSubmit={handleTerminalSubmit} className="mt-5 pt-4 flex items-center gap-2 border-t border-surface-container-high">
                  <div className="flex-1 bg-surface-container-low rounded-full px-4 py-2.5 flex items-center justify-between text-on-surface-variant focus-within:bg-surface-container transition-colors">
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={e => setTerminalInput(e.target.value)}
                      placeholder="스프린트 루틴 자세히 보기..."
                      className="bg-transparent text-xs text-on-surface placeholder:text-outline focus:outline-none w-full mr-2"
                    />
                    <span className="material-symbols-outlined text-[18px] text-outline">mic</span>
                  </div>
                  <button
                    type="submit"
                    className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
                    title="전송"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 2. Service Core Values & Feature Bento Grid */}
      <section className="w-full bg-surface-container-lowest py-24 border-y border-border-subtle/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="font-label-md text-xs uppercase tracking-wider text-primary font-bold">
                Core Features
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-semibold text-on-surface mt-2 tracking-tight">
                학습 고민을 해결하는 3가지 핵심 솔루션
              </h2>
            </div>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-md leading-relaxed">
              단순한 질의응답을 넘어 목표 수립부터 슬럼프 관리까지 체계적인 인지 학습 프레임워크를 경험해 보세요.
            </p>
          </div>

          {/* Feature Bento Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Goal Alignment */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:bg-surface-elevated transition-colors group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <span className="material-symbols-outlined text-[28px]">flag</span>
                </div>
                <h3 className="font-headline-sm text-xl font-medium text-on-surface mb-3">
                  정밀한 학습 목표 설정
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  장기 목표를 실현 가능한 주간·일간 마일스톤으로 세분화합니다. 나의 현재 수준에 꼭 맞춘 맞춤형 타임라인을 자동 생성하세요.
                </p>
              </div>
              <button
                onClick={() =>
                  setFeatureModal({
                    title: '정밀한 학습 목표 수립 가이드',
                    desc: '실현 가능하고 측정 가능한 목표 수립 3단계 프로세스를 소개합니다.',
                    items: [
                      '1. 최종 목표 역산법(Reverse Planning): 시험일 기준 역순 마일스톤 도출',
                      '2. 마이크로 골(Micro-goal) 단위 분해: 1회 학습 분량을 25~45분 블록으로 구조화',
                      '3. 인지 버퍼 데이(Buffer Day): 주 1일 미진한 분량을 보충하는 안전장치 배치'
                    ]
                  })
                }
                className="mt-8 pt-6 border-t border-surface-container-high flex items-center gap-2 text-primary text-sm font-semibold hover:underline cursor-pointer"
              >
                <span>목표 수립 가이드 살펴보기</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* Feature 2: Plan Review */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:bg-surface-elevated transition-colors group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <span className="material-symbols-outlined text-[28px]">fact_check</span>
                </div>
                <h3 className="font-headline-sm text-xl font-medium text-on-surface mb-3">
                  공부 계획 &amp; 루틴 점검
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  진행 중인 스케줄의 실행률을 정량적으로 분석하고 피드백합니다. 무리한 계획으로 인한 피로도를 방지하고 꾸준한 몰입을 견인합니다.
                </p>
              </div>
              <button
                onClick={() =>
                  setFeatureModal({
                    title: '주간 점검 및 루틴 피드백 프로세스',
                    desc: '과열된 피로도를 방지하고 꾸준한 몰입을 보장하는 스마트 점검 기법입니다.',
                    items: [
                      '1. 일일 달성률 트래킹: 계획 대비 순공 시간 및 이해도 5점 척도 체크',
                      '2. 병목 구간 탐색: 시간 지연이 잦은 과목 및 단원 자동 식별',
                      '3. 유연한 스케줄 재편: 누적 학습 데이터 기반 주간 재조정 권장안 제시'
                    ]
                  })
                }
                className="mt-8 pt-6 border-t border-surface-container-high flex items-center gap-2 text-secondary text-sm font-semibold hover:underline cursor-pointer"
              >
                <span>주간 점검 프로세스</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* Feature 3: Deep Coaching & Problem Solving */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:bg-surface-elevated transition-colors group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-tertiary mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <span className="material-symbols-outlined text-[28px]">support_agent</span>
                </div>
                <h3 className="font-headline-sm text-xl font-medium text-on-surface mb-3">
                  실시간 학습 고민 해결
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  시험 불안, 집중력 저하, 과목별 슬럼프 등 혼자 앓기 쉬운 정서적·전략적 난제를 편안하게 털어놓고 즉각적인 심리 피드백을 받으세요.
                </p>
              </div>
              <button
                onClick={() =>
                  setFeatureModal({
                    title: '인지 행동 기반 심리 코칭 원리',
                    desc: '불안감을 완화하고 긍정적 자기 효능감을 극대화하는 코칭 전략입니다.',
                    items: [
                      '1. 감정 환기 & 수용: 막연한 학업 스트레스의 구체적 원인 언어화',
                      '2. 작업흥분 유도: 시작 저항감을 없애는 5분 초간단 과제 세팅',
                      '3. 멘탈 리셋 프로토콜: 과도한 시험 불안 발생 시 호흡 및 긍정적 시각화 기법'
                    ]
                  })
                }
                className="mt-8 pt-6 border-t border-surface-container-high flex items-center gap-2 text-tertiary text-sm font-semibold hover:underline cursor-pointer"
              >
                <span>심리 코칭 원리</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Navigation Hub: Clear Pathways to Core Screens */}
      <section className="w-full py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-label-md text-xs uppercase tracking-wider text-secondary font-bold">
              Service Navigation Hub
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-semibold text-on-surface mt-2 tracking-tight">
              필요한 화면으로 빠르고 명확하게 이동하세요
            </h2>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-3">
              학습 상담 챗봇은 학생 한 명 한 명의 사용 흐름에 맞춰 설계되었습니다.
            </p>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Entry 1: Chatbot Workspace */}
            <div
              onClick={() => onNavigate('chat-consultation')}
              className="bg-surface-card border border-border-subtle rounded-2xl p-8 shadow-sm hover:shadow-xl hover:bg-surface-container transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">forum</span>
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
                    대화면
                  </span>
                </div>
                <h3 className="font-headline-sm text-lg font-semibold text-on-surface group-hover:text-primary transition-colors mb-2">
                  챗봇 상담 화면
                </h3>
                <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                  AI 멘토와 1:1 대화를 시작하고 학습 로드맵 및 맞춤형 피드백을 실시간으로 확인합니다.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-primary">
                <span>상담실 바로가기</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1.5 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>

            {/* Entry 2: Auth Flow (Login & Register) */}
            <div
              onClick={() => onNavigate('login')}
              className="bg-surface-card border border-border-subtle rounded-2xl p-8 shadow-sm hover:shadow-xl hover:bg-surface-container transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="w-12 h-12 rounded-full bg-secondary-container/10 text-secondary flex items-center justify-center group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-colors">
                    <span className="material-symbols-outlined text-[24px]">vpn_key</span>
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
                    계정
                  </span>
                </div>
                <h3 className="font-headline-sm text-lg font-semibold text-on-surface group-hover:text-secondary transition-colors mb-2">
                  로그인 및 회원가입
                </h3>
                <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                  이전 상담 내역과 나의 성향 데이터를 안전하게 누적하고 관리할 수 있도록 계정을 연결하세요.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-secondary">
                <span>로그인 / 가입하기</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1.5 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>

            {/* Entry 3: Profile & History (My Page) */}
            <div
              onClick={() => onNavigate('mypage')}
              className="bg-surface-card border border-border-subtle rounded-2xl p-8 shadow-sm hover:shadow-xl hover:bg-surface-container transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="w-12 h-12 rounded-full bg-tertiary-container/10 text-tertiary flex items-center justify-center group-hover:bg-tertiary-container group-hover:text-on-tertiary-container transition-colors">
                    <span className="material-symbols-outlined text-[24px]">badge</span>
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
                    마이페이지
                  </span>
                </div>
                <h3 className="font-headline-sm text-lg font-semibold text-on-surface group-hover:text-tertiary transition-colors mb-2">
                  회원정보 및 상담 기록
                </h3>
                <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                  과거 나눈 상담 요약 리포트를 확인하고 학습 목표 및 내 계정 설정을 자유롭게 업데이트합니다.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-tertiary">
                <span>정보 관리 열기</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1.5 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works: Minimal 3-Step Process */}
      <section className="w-full bg-surface-container-low py-20 border-y border-border-subtle/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-12">
            <span className="font-label-md text-xs uppercase tracking-wider text-primary font-bold">
              Process
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl font-semibold text-on-surface mt-2 tracking-tight">
              간단한 3단계로 시작하는 학습 코칭
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col bg-surface-card border border-border-subtle p-6 rounded-2xl shadow-sm relative">
              <span className="font-headline-xl text-4xl text-primary/20 font-bold mb-4">01</span>
              <h4 className="font-headline-sm text-lg font-medium text-on-surface mb-2">상담 질문 입력</h4>
              <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                오늘 학습하며 마주한 어려움이나 점검받고 싶은 계획을 자유롭게 메신저 창에 입력하세요.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col bg-surface-card border border-border-subtle p-6 rounded-2xl shadow-sm relative">
              <span className="font-headline-xl text-4xl text-secondary/20 font-bold mb-4">02</span>
              <h4 className="font-headline-sm text-lg font-medium text-on-surface mb-2">AI 정밀 분석 &amp; 진단</h4>
              <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                AI 엔진이 문제의 본질을 진단하고, 목표 달성에 최적화된 학습 전략과 루틴을 즉시 도출합니다.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col bg-surface-card border border-border-subtle p-6 rounded-2xl shadow-sm relative">
              <span className="font-headline-xl text-4xl text-tertiary/20 font-bold mb-4">03</span>
              <h4 className="font-headline-sm text-lg font-medium text-on-surface mb-2">실행 및 기록 보관</h4>
              <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                제공된 솔루션을 실천하고 상담 리포트를 마이페이지에 보관하여 장기적인 성장을 완성하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Commitment Banner */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full">
        <div className="bg-gradient-to-br from-surface-card via-surface-elevated to-surface-card border border-border-subtle rounded-3xl p-8 sm:p-10 lg:p-14 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary flex-shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-[36px]">verified_user</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-headline-md text-xl sm:text-2xl text-on-surface font-semibold">
                안심하고 대화할 수 있는 안전한 상담 환경
              </h3>
              <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
                학생 여러분의 모든 상담 대화 내용과 개인 데이터는 강력한 암호화 프로토콜에 따라 안전하게 보호되며, 오직 본인만의 학습 분석 및 코칭 개선 목적으로만 엄격하게 활용됩니다.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => onNavigate('chat-consultation')}
              className="px-8 py-4 rounded-full bg-primary-container text-on-primary-container text-sm font-semibold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary-container/30 cursor-pointer"
            >
              <span>지금 바로 상담해보기</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Guide Modal */}
      {featureModal && (
        <div className="fixed inset-0 z-50 bg-surface-dim/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border-prominent w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container-high">
              <h3 className="font-headline-sm text-lg font-semibold text-on-surface">
                {featureModal.title}
              </h3>
              <button
                onClick={() => setFeatureModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">{featureModal.desc}</p>
            <div className="space-y-2.5 mb-6">
              {featureModal.items.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface leading-relaxed border border-border-subtle/50">
                  {item}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setFeatureModal(null);
                  onNavigate('chat-consultation');
                }}
                className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container hover:bg-primary font-medium text-sm transition-all cursor-pointer"
              >
                챗봇에게 바로 질문하기
              </button>
              <button
                onClick={() => setFeatureModal(null)}
                className="px-4 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface text-sm transition-all cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
