import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../types';

interface ChatPageProps {
  user: UserProfile;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'ai',
    text: `안녕하세요! 어떤 학습 고민이나 공부 계획이 있으신가요? 편하게 말씀해 주세요.\n\n학습 스케줄링, 시험 대비 전략, 집중력 루틴 등 어떤 단계든 제가 함께 최적의 해법을 정리해 드립니다.`,
    timestamp: '방금 전',
    tags: ['맞춤형 진단 대기', '자기주도 코칭']
  }
];

const SUGGESTED_CHIPS = [
  {
    icon: 'calendar_month',
    color: 'text-secondary',
    text: '시험 대비 학습 플랜 세우기',
    prompt: '시험 대비 학습 플랜을 세우고 싶어요. 3주 남은 시점에서 어떻게 일일 시간표와 복습 단계를 배분하면 좋을까요?'
  },
  {
    icon: 'bolt',
    color: 'text-primary',
    text: '집중력 향상 방법',
    prompt: '책상에 앉아도 20분만 지나면 스마트폰을 보게 되고 집중이 흐려져요. 깊은 몰입 상태를 유지하는 실천 팁을 알려주세요.'
  },
  {
    icon: 'troubleshoot',
    color: 'text-secondary',
    text: '과목별 취약점 보완',
    prompt: '문제 풀이 때 오답이 반복되는 취약 과목이 있어요. 단순히 문제를 많이 푸는 것 외에 개념을 확실히 체화하는 오답 노트 전략이 궁금해요.'
  },
  {
    icon: 'psychology_alt',
    color: 'text-primary',
    text: '슬럼프 극복 멘탈 관리법',
    prompt: '계획대로 진도가 안 나가서 자책감이 들고 무기력해지는 슬럼프가 찾아왔어요. 멘탈을 다잡고 다시 루틴을 회복하는 법을 알려주세요.'
  }
];

export const ChatPage: React.FC<ChatPageProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('study_bot_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [readinessScore, setReadinessScore] = useState(88);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem('study_bot_messages', JSON.stringify(messages));
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Mini Focus Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && activeTimer !== null && activeTimer > 0) {
      interval = setInterval(() => {
        setActiveTimer(prev => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (activeTimer === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, activeTimer]);

  const startFocusTimer = (minutes: number) => {
    setActiveTimer(minutes * 60);
    setTimerRunning(true);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend ?? inputVal).trim();
    if (!prompt || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt,
      timestamp: '지금'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Adjust readiness metric organically with user activity
    setReadinessScore(prev => Math.min(98, prev + 2));

    setTimeout(() => {
      const response = generateIntelligentConsultation(prompt, user.consultTone);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.text,
        timestamp: '방금',
        tags: response.tags,
        suggestedSteps: response.steps
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetSession = () => {
    setMessages(INITIAL_MESSAGES);
    setInputVal('');
    setShowResetConfirm(false);
    setReadinessScore(88);
  };

  return (
    <div className="w-full relative overflow-hidden pb-12">
      {/* Ambient Radial Gradient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-primary/15 via-primary-container/10 to-transparent blur-3xl opacity-60"></div>
      <div className="pointer-events-none absolute top-48 -right-32 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-6">
        {/* Top Session Header Card */}
        <section className="w-full bg-surface-card/90 border border-border-subtle backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary shadow-inner">
                <span className="material-symbols-outlined text-[26px]">neurology</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-status-success"></span>
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-headline-sm text-lg sm:text-xl font-semibold text-on-surface tracking-tight">
                  학습 상담 챗봇 세션
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-status-success/15 text-status-success text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                  실시간 AI 상담 중
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant truncate mt-0.5">
                고유 세션 ID #LRN-2025-089A • 지능형 맞춤 학습 분석기 v3.4 활성화
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container-high hover:bg-surface-elevated text-on-surface-variant hover:text-on-surface transition-all shadow-sm cursor-pointer border border-border-subtle/50"
              title="대화 내역을 비우고 새 상담을 시작합니다"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:rotate-180 transition-transform duration-500">
                restart_alt
              </span>
              <span className="text-xs font-medium">대화 초기화</span>
            </button>
            <div className="h-6 w-px bg-surface-variant hidden sm:block"></div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-[16px] text-secondary">memory</span>
              초기 인지 모델 로드됨
            </span>
          </div>
        </section>

        {/* Main Workspace: Split View with Visual Coaching Dashboard & Chat Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
          {/* Left Visual Sidecard (Analytics & Active Student Persona) */}
          <aside className="lg:col-span-4 flex flex-col gap-5 w-full order-2 lg:order-1">
            {/* Persona Card with student photo */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-5 shadow-lg flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary uppercase tracking-widest font-semibold">
                  상담 프로필 매칭
                </span>
                <span className="px-2 py-0.5 rounded-md bg-secondary/15 text-secondary text-xs font-medium">
                  집중 코칭 모드
                </span>
              </div>

              <div className="relative w-full h-36 rounded-xl overflow-hidden shadow-inner border border-border-subtle/50">
                <img
                  className="w-full h-full object-cover"
                  alt="A focused student studying in modern workspace"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJybnT0HHOiSq3QAUw_DARbqbGKeN-WhoVGGTjMrgO_LDf2lmW9oN14oNe60kCSqb59n57nakeQQ63QjSPeB3B5aOUjui3ZQeaWXdfWiv3PML3p6i48e-kOE7Uq6s8Z6dixQMIUCdKvkLrW1BD-EE_mnfbbwBPvtwuF5SYNR62_F3d_7MH_c_KCBRennjexzS14H6sDe0tWz-HLAHnfrCuMnLR-fZbojfgK2KKGygPqqkbl8ksVrhy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-surface-card/30 to-transparent"></div>
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-on-surface">김지수 님 (자기주도 학습)</p>
                    <p className="text-[11px] text-on-surface-variant">목표: 2학기 전공 역량 강화</p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
                </div>
              </div>

              {/* Mini Cognitive Readiness Metric */}
              <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-2 border border-border-subtle/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface font-medium">학습 몰입 준비도</span>
                  <span className="text-xs text-primary font-bold">{readinessScore}%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-container via-primary to-secondary h-full rounded-full transition-all duration-700"
                    style={{ width: `${readinessScore}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
                  <span>컨디션: 양호</span>
                  <span>추천: 50분 집중 / 10분 휴식</span>
                </div>

                {/* Focus Timer Trigger */}
                <div className="mt-2 pt-2 border-t border-surface-container flex items-center justify-between">
                  {activeTimer !== null ? (
                    <div className="flex items-center gap-2 w-full justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-secondary font-mono font-bold">
                        <span className="material-symbols-outlined text-[16px]">timer</span>
                        <span>{formatTimer(activeTimer)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setTimerRunning(!timerRunning)}
                          className="px-2 py-0.5 text-[11px] rounded bg-surface-container-high hover:bg-surface-elevated text-on-surface cursor-pointer"
                        >
                          {timerRunning ? '일시정지' : '재개'}
                        </button>
                        <button
                          onClick={() => {
                            setActiveTimer(null);
                            setTimerRunning(false);
                          }}
                          className="px-2 py-0.5 text-[11px] rounded bg-surface-container-high hover:text-error text-on-surface-variant cursor-pointer"
                        >
                          종료
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => startFocusTimer(50)}
                      className="w-full py-1.5 px-3 rounded-lg bg-surface-container-high hover:bg-surface-elevated text-xs text-on-surface font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-secondary">play_arrow</span>
                      <span>50분 집중 타이머 시작</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Tip Panel */}
            <div className="bg-surface-container-high/60 backdrop-blur border border-border-subtle rounded-2xl p-5 shadow-md flex flex-col gap-3">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                <span className="text-sm font-semibold text-on-surface">효과적인 질문 팁</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                &ldquo;수학 미적분 풀 때 시간이 부족해요&rdquo;처럼 현재 겪고 있는{' '}
                <strong className="text-on-surface">구체적인 장애물</strong>과{' '}
                <strong className="text-on-surface">목표 시점</strong>을 함께 작성해주시면 훨씬 정교한 시간표를 제시해 드립니다.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-primary font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span> 심층 분석
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span> 맞춤형 로드맵
                </span>
              </div>
            </div>
          </aside>

          {/* Right Main Chat Section */}
          <main className="lg:col-span-8 flex flex-col gap-4 w-full order-1 lg:order-2">
            {/* Conversation Stream Container */}
            <div
              className="bg-surface-card border border-border-subtle rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-6 min-h-[480px] max-h-[640px] overflow-y-auto scroll-smooth"
              id="chatHistory"
            >
              {/* Date/Session Marker */}
              <div className="flex items-center justify-center my-1">
                <div className="px-4 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs tracking-wide border border-border-subtle/50">
                  오늘 • 맞춤형 1:1 상담 세션
                </div>
              </div>

              {/* Messages Flow */}
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3.5 ${
                    msg.sender === 'user'
                      ? 'justify-end max-w-[90%] self-end ml-auto'
                      : 'max-w-[92%] sm:max-w-[85%]'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container flex-shrink-0 shadow-md">
                      <span className="material-symbols-outlined text-[22px]">smart_toy</span>
                    </div>
                  )}

                  <div
                    className={`flex flex-col gap-1.5 min-w-0 ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {msg.sender === 'user' ? (
                        <>
                          <span className="text-[11px] text-on-surface-variant">{msg.timestamp}</span>
                          <span className="text-xs font-semibold text-secondary">나 (학습자)</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-semibold text-primary">학습 멘토 AI</span>
                          <span className="text-[11px] text-on-surface-variant">{msg.timestamp}</span>
                        </>
                      )}
                    </div>

                    <div
                      className={`p-4 sm:p-5 shadow-lg ${
                        msg.sender === 'user'
                          ? 'bg-primary-container text-on-primary-container rounded-2xl rounded-tr-sm shadow-primary-container/20'
                          : 'bg-surface-elevated text-on-surface rounded-2xl rounded-tl-sm border border-border-subtle/60 shadow-black/20'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                      {msg.suggestedSteps && msg.suggestedSteps.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-surface-container-high/60 space-y-2">
                          <p className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">task_alt</span>
                            실행 로드맵
                          </p>
                          <div className="space-y-1">
                            {msg.suggestedSteps.map((step, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-on-surface bg-surface-container/60 p-2 rounded-lg leading-relaxed flex items-start gap-2"
                              >
                                <span className="font-bold text-primary font-mono">{idx + 1}.</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {msg.tags && msg.tags.length > 0 && (
                        <div className="mt-4 pt-3 flex flex-wrap gap-2">
                          {msg.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-full bg-surface-container text-xs text-secondary font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary flex-shrink-0 shadow-md border border-border-subtle">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-3.5 max-w-[85%] animate-in fade-in duration-200">
                  <div className="w-10 h-10 rounded-full bg-primary-container/40 flex items-center justify-center text-primary flex-shrink-0 animate-pulse">
                    <span className="material-symbols-outlined text-[22px]">smart_toy</span>
                  </div>
                  <div className="bg-surface-elevated rounded-2xl rounded-tl-sm px-4 py-3 shadow-md flex items-center gap-3 border border-border-subtle/50">
                    <span className="text-xs text-on-surface-variant font-medium">
                      맞춤형 솔루션 탐색 중...
                    </span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline Suggested Prompts Chips */}
              <div className="flex flex-col gap-2.5 pl-0 sm:pl-12 pr-2 mt-2">
                <span className="text-xs text-on-surface-variant flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-secondary">tips_and_updates</span>
                  빠른 시작 추천 주제
                </span>
                <div className="flex flex-wrap gap-2" id="quickChipsContainer">
                  {SUGGESTED_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip.prompt)}
                      className="group px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-all flex items-center gap-2 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-border-subtle/40"
                      type="button"
                    >
                      <span className={`material-symbols-outlined text-[16px] ${chip.color} group-hover:rotate-12 transition-transform`}>
                        {chip.icon}
                      </span>
                      <span>{chip.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div ref={chatBottomRef} />
            </div>

            {/* Bottom Sticky Consultation Input Bar Area */}
            <div className="bg-surface-card border border-border-subtle rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col gap-3">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex flex-col gap-2"
              >
                <div className="relative flex items-end gap-2 bg-surface-container-low rounded-2xl p-2 sm:p-3 focus-within:bg-surface-container focus-within:ring-1 focus-within:ring-primary-container transition-all border border-border-subtle/50">
                  <div className="flex items-center pl-1 pb-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[22px]">edit_note</span>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={500}
                    placeholder="학습 관련 질문이나 상담 내용을 입력해 주세요..."
                    rows={2}
                    className="w-full bg-transparent text-on-surface text-sm placeholder:text-outline focus:outline-none resize-none px-2 py-1 max-h-36 leading-relaxed"
                  />

                  {/* Actions inside input row */}
                  <div className="flex items-center gap-1.5 pb-0.5 flex-shrink-0">
                    {inputVal.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setInputVal('')}
                        title="입력 내용 지우기"
                        className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">backspace</span>
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!inputVal.trim() || isTyping}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed text-on-primary-container hover:text-on-primary text-sm font-semibold shadow-lg shadow-primary-container/30 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                    >
                      <span>전송</span>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                  </div>
                </div>

                {/* Input Footer Meta & Clear Action */}
                <div className="flex items-center justify-between px-2 pt-0.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
                      상담 내역은 암호화되어 안전하게 보호됩니다.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className={inputVal.length > 450 ? 'text-status-danger font-medium' : ''}>
                      {inputVal.length} / 500자
                    </span>
                    <span className="hidden sm:inline">• Enter로 전송 (Shift+Enter 줄바꿈)</span>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-surface-dim/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border-prominent w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-3 text-secondary">
              <span className="material-symbols-outlined text-[26px]">restart_alt</span>
              <h3 className="text-lg font-semibold text-on-surface">대화 세션 초기화</h3>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              현재 진행 중인 상담 대화를 초기화하고 초기 안내 메시지 상태로 되돌리시겠습니까?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface text-sm transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={resetSession}
                className="px-5 py-2 rounded-full bg-status-danger text-white hover:bg-opacity-90 text-sm font-medium transition-all cursor-pointer shadow-md"
              >
                초기화 확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Intelligent mentor response generator
function generateIntelligentConsultation(prompt: string, tone?: string) {
  const isGentle = tone === 'mentor';
  const isAnalytical = tone === 'analytical';

  if (prompt.includes('플랜') || prompt.includes('계획') || prompt.includes('시험') || prompt.includes('일정')) {
    return {
      text: isGentle
        ? `시험 대비를 위한 역산 플래닝(Reverse Planning) 솔루션을 정리해 드립니다!\n\n시험일까지 남은 기간을 크게 3단계로 쪼개고, 매일 무리하지 않는 선에서 성취감을 느낄 수 있는 작은 마이크로 목표를 세우는 것이 불안감을 줄이는 지름길이에요.`
        : `시험 대비를 위해서는 체계적인 역산(Reverse Planning) 프레임워크가 가장 정밀합니다.\n\n각 과목별 개념 압축, 기출 분석, 취약 오답 회독을 아래 3단계 타임라인으로 배치하십시오.`,
      steps: [
        'D-21 ~ D-14: 핵심 개념 1회독 완독 및 단원별 기본 문제 풀이',
        'D-14 ~ D-7: 최근 3개년 기출문제 풀이 및 취약 유형 오답 인덱싱',
        'D-7 ~ D-1: 백지 복습법(Blank Sheet Recall) & 오답 노트 최종 정리',
        '시험 전날: 마인드셋 안정 및 컨디션 조절을 위한 가벼운 요약서 열람'
      ],
      tags: ['✓ 3단계 플랜 권장', '역산 플래닝 적용', '시간 블록 관리법']
    };
  }

  if (prompt.includes('집중') || prompt.includes('몰입') || prompt.includes('스마트폰') || prompt.includes('딴짓')) {
    return {
      text: `집중력이 흐려질 때는 뇌의 인지 부하를 줄여주는 '포모도로 변형 기법(50분 몰입 + 10분 완전 휴식)'이 가장 효과적입니다.\n\n시작 전 첫 5분 동안 가장 만만한 2문제를 먼저 풀면 뇌에서 도파민과 작업흥분(Working Excitement)이 발생해 장시간 집중 상태로 자연스럽게 유입됩니다. 좌측 패널의 '50분 집중 타이머'를 지금 바로 작동시켜 보세요!`,
      steps: [
        '시작 5분: 가장 쉬운 개념 확인 문제 2개 먼저 풀기 (시작 저항성 제거)',
        '본 학습 45분: 알림이 차단된 상태에서 한 가지 과제에만 몰입',
        '휴식 10분: 스마트폰 화면을 보지 않고 눈 휴식 및 가벼운 스트레칭'
      ],
      tags: ['포모도로 50/10 권장', '작업흥분 기법', '도파민 리셋']
    };
  }

  if (prompt.includes('수학') || prompt.includes('미적분') || prompt.includes('취약') || prompt.includes('오답')) {
    return {
      text: `취약 단원 정복의 핵심은 단순 양치기가 아닌 '오답 원인 인덱싱(3분류 분석)'입니다.\n\n미적분이나 고난도 영역은 계산 실수인지, 개념 미체화인지, 문제 독해 오류인지를 분리해야 문제 풀이 속도가 2배 이상 빨라집니다.`,
      steps: [
        '유형 A (개념 부족): 관련 공식의 유도 과정과 정의를 직접 손으로 3회 필기',
        '유형 B (계산 실수): 풀이 과정을 줄글로 반듯하게 적는 연습(암산 금지)',
        '유형 C (접근법 부재): 해설지의 첫 줄 아이디어만 확인 후 나머지 스스로 전개'
      ],
      tags: ['오답 원인 3분류', '시간제한 스프린트 풀이', '개념 정착도 진단']
    };
  }

  if (prompt.includes('슬럼프') || prompt.includes('멘탈') || prompt.includes('불안') || prompt.includes('자책') || prompt.includes('무기력')) {
    return {
      text: isAnalytical
        ? `슬럼프는 의지력의 결핍이 아니라 과도한 인지적 피로와 비현실적인 일일 목표 설정에서 기인하는 뇌의 보호 반응입니다.\n\n기존 계획의 분량을 40% 즉시 감축하고, 최소 성공 기준(Minimum Viable Routine)을 가동하세요.`
        : `공부하다 보면 누구나 지치고 불안한 시기가 찾아옵니다. 스스로를 다그치지 말고 지금까지 열심히 달려온 자신을 먼저 인정해 주는 것이 회복의 첫걸음이에요.\n\n오늘은 분량을 딱 절반으로 줄이고, 가장 성취감이 큰 작은 1가지만 달성한 뒤 푹 쉬어보는 건 어떨까요?`,
      steps: [
        '목표 다이어트: 일일 투두리스트를 단 2가지 핵심 과제로 압축',
        '성취감 기록: 밤에 "오늘 해낸 사소한 3가지"를 메모장에 기록하기',
        '수면 골든타임: 최소 7시간 이상의 규칙적인 수면으로 뇌 피로 회복'
      ],
      tags: ['최소 성공 루틴', '자기 효능감 회복', '멘탈 안정화']
    };
  }

  return {
    text: `말씀해주신 학습 고민을 정밀 분석했습니다. 막막하게 느껴지는 단계일수록 거대한 목표를 더 작은 마이크로 단위(Micro-goals)로 쪼개어 접근하는 것이 핵심입니다.\n\n현재 세션에서 이번 주 가장 우선순위로 두고 싶은 핵심 과제 1가지만 골라보시겠어요? 그에 맞춘 현실적인 분량 가이드와 오답 극복 루틴을 제안해 드리겠습니다.`,
    steps: [
      '이번 주 가장 시급한 1개 과목 또는 단원 선정하기',
      '하루 25~50분 단위의 고정 학습 블록 시간 지정하기',
      '챗봇에게 세부 과목명을 알려주시면 정밀 일정표 자동 도출'
    ],
    tags: ['마이크로 골 분해', '우선순위 재정렬', '심층 분석 대기']
  };
}
