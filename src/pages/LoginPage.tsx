import React, { useState } from 'react';
import { Page, UserProfile } from '../types';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { fetchUserProfile, saveUserProfile } from '../lib/userService';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onLoginSuccess: (userProfile: UserProfile) => void;
  noticeMessage?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess, noticeMessage }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const isIdentifierValid = identifier.length > 3 && (identifier.includes('@') || identifier.length >= 5);

  const translateFirebaseError = (errCode: string): string => {
    switch (errCode) {
      case 'auth/operation-not-allowed':
        return 'Firebase 프로젝트에서 [이메일/비밀번호] 로그인이 활성화되지 않았습니다. [Google로 로그인]을 이용하시거나 Firebase 콘솔에서 이메일 로그인을 활성화해 주세요.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
      case 'auth/invalid-email':
        return '유효하지 않은 이메일 형식입니다.';
      case 'auth/user-disabled':
        return '비활성화된 계정입니다. 관리자에게 문의하세요.';
      case 'auth/too-many-requests':
        return '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.';
      case 'auth/popup-closed-by-user':
        return '로그인 팝업이 닫혔습니다.';
      case 'auth/cancelled-popup-request':
        return '이전 로그인 요청이 진행 중입니다.';
      case 'auth/network-request-failed':
        return '네트워크 연결 상태를 확인해 주세요.';
      default:
        return `로그인 중 오류가 발생했습니다 (${errCode || '오류'}). 다시 시도해 주세요.`;
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, identifier.trim(), password);
      const user = userCredential.user;

      // Fetch or initialize profile from Firestore
      let profile = await fetchUserProfile(user.uid);
      if (!profile) {
        const newProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || '학습자',
          email: user.email || identifier.trim(),
          role: '학생 회원',
          avatarUrl:
            user.photoURL ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuApUAMNzsTk57j_L6mIn_c0M5hJnMWasSv310CrU24wT8HYPCTb6v6vEyy-j1zuk9Oz8DIKYvyCwHUTG1_viTaaoKtKNJsVNKUmYs_L6IgyZYISryezMwQkMjbO0-IfsByGjw967hC4x2ETXla7-7I3Bjd15OgzTHEKP8HwcuulKDL4IcBvD9GmKBOGwG9zqN-ytTwsq4yXCa1ZHdit9Vq85U3tToi8PFjHBA-LHy6r5SvL0HYqKkd8',
          joinedDate: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
          daysActive: 1,
          consultationCount: 0,
          targetGoal: '자기주도 학습 역량 강화',
          coachingStyle: '주간 계획 코칭',
          studyCategory: 'cs',
          consultTone: 'mentor',
          notifyGoals: true,
          notifyReport: true,
          agreeDataTraining: false
        };
        await saveUserProfile(user.uid, newProfile);
        profile = newProfile;
      }

      onLoginSuccess(profile);
      onNavigate('chat-consultation');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      setErrorMessage(translateFirebaseError(firebaseError.code || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check existing profile or build new
      let profile = await fetchUserProfile(user.uid);
      if (!profile) {
        const newProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || '구글 학습자',
          email: user.email || '',
          role: '학생 회원',
          avatarUrl:
            user.photoURL ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuApUAMNzsTk57j_L6mIn_c0M5hJnMWasSv310CrU24wT8HYPCTb6v6vEyy-j1zuk9Oz8DIKYvyCwHUTG1_viTaaoKtKNJsVNKUmYs_L6IgyZYISryezMwQkMjbO0-IfsByGjw967hC4x2ETXla7-7I3Bjd15OgzTHEKP8HwcuulKDL4IcBvD9GmKBOGwG9zqN-ytTwsq4yXCa1ZHdit9Vq85U3tToi8PFjHBA-LHy6r5SvL0HYqKkd8',
          joinedDate: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
          daysActive: 1,
          consultationCount: 0,
          targetGoal: '자기주도 학습 역량 강화',
          coachingStyle: '주간 계획 코칭',
          studyCategory: 'cs',
          consultTone: 'mentor',
          notifyGoals: true,
          notifyReport: true,
          agreeDataTraining: false
        };
        await saveUserProfile(user.uid, newProfile);
        profile = newProfile;
      }

      onLoginSuccess(profile);
      onNavigate('chat-consultation');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(translateFirebaseError(firebaseError.code || ''));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotError('');

    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setForgotSent(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSent(false);
        setForgotEmail('');
      }, 3000);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      setForgotError(translateFirebaseError(firebaseError.code || ''));
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-surface relative overflow-hidden py-10 px-4 sm:px-6">
      {/* Background glow orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-primary-container/15 blur-[120px] pointer-events-none -top-40 -left-40"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary-container/10 blur-[100px] pointer-events-none -bottom-20 -right-20"></div>

      <div className="w-full max-w-[440px] z-10 my-auto">
        {/* Top Header controls */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span>홈으로 돌아가기</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-secondary text-xs font-medium border border-border-subtle/50">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            <span>Firebase 인증 보안</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface-card border border-border-subtle rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl relative backdrop-blur-md">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center mb-4 text-primary shadow-sm relative group border border-border-subtle">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-40 group-hover:opacity-75 transition-opacity"></div>
              <span className="material-symbols-outlined text-[28px] relative z-10">psychology</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-on-surface tracking-tight mb-1.5">
              학습 상담 챗봇 로그인
            </h1>
            <p className="text-xs text-on-surface-variant max-w-[280px] leading-relaxed">
              계정에 로그인하여 맞춤형 학습 상담을 이어가세요
            </p>
          </div>

          {/* Notice Banner */}
          {noticeMessage && (
            <div className="mb-4 p-3 rounded-xl bg-primary-container/20 border border-primary-container/40 text-xs text-primary-fixed flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">lock</span>
              <span>{noticeMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-status-danger/10 border border-status-danger/30 text-xs text-status-danger flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Login Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full h-12 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 border border-slate-300"
            >
              {googleLoading ? (
                <svg className="animate-spin h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                </svg>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google로 로그인</span>
                </>
              )}
            </button>
          </div>

          {/* Or Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px bg-surface-container-high flex-1"></div>
            <span className="text-[11px] font-medium text-outline uppercase tracking-wider">
              또는 이메일로 로그인
            </span>
            <div className="h-px bg-surface-container-high flex-1"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            {/* Email / ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-on-surface-variant flex items-center justify-between" htmlFor="userIdentifier">
                <span>이메일 주소</span>
                {isIdentifierValid && (
                  <span className="text-xs text-secondary font-medium">형식 확인됨</span>
                )}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline text-[20px] pointer-events-none">
                  mail
                </span>
                <input
                  id="userIdentifier"
                  type="email"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full h-12 pl-11 pr-4 bg-surface-container rounded-full text-on-surface placeholder:text-outline text-sm border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-elevated transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-on-surface-variant flex items-center justify-between" htmlFor="userPassword">
                <span>비밀번호</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  id="userPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full h-12 pl-11 pr-11 bg-surface-container rounded-full text-on-surface placeholder:text-outline text-sm border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-elevated transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="비밀번호 표시 토글"
                  className="absolute right-4 text-outline hover:text-on-surface transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember & Forgot options */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded bg-surface-container flex items-center justify-center text-primary-container peer-checked:bg-primary peer-checked:text-on-primary transition-all group-hover:bg-surface-elevated border border-border-subtle">
                  <span className="material-symbols-outlined text-[13px] font-bold opacity-0 peer-checked:opacity-100 transition-opacity">
                    check
                  </span>
                </div>
                <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">
                  로그인 유지
                </span>
              </label>

              <div className="flex items-center gap-1.5 text-xs text-outline">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  비밀번호 재설정
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full h-12 rounded-full bg-primary-container hover:bg-primary text-on-primary text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer relative overflow-hidden disabled:opacity-60"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-on-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                  </svg>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span>로그인</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Safe session divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-surface-container-high flex-1"></div>
            <span className="text-[11px] font-medium text-outline uppercase tracking-wider">
              안전한 인공지능 세션
            </span>
            <div className="h-px bg-surface-container-high flex-1"></div>
          </div>

          <div className="flex items-center justify-center p-3 rounded-xl bg-surface-container-low text-xs border border-border-subtle/50">
            <p className="text-on-surface-variant text-center">
              아직 회원이 아니신가요?{' '}
              <button
                onClick={() => onNavigate('signup')}
                className="text-primary font-semibold ml-1.5 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>회원가입하기</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </p>
          </div>
        </div>

        {/* Security footer */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-outline">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-status-success">verified_user</span>
            <span>256비트 종단간 암호화</span>
          </div>
          <span>•</span>
          <span>AI 튜터링 규정 준수</span>
        </div>
      </div>

      {/* Forgot ID/Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-surface-dim/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border-prominent w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-container-high">
              <h3 className="font-semibold text-on-surface text-base">비밀번호 재설정</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            {forgotSent ? (
              <div className="text-center py-4 space-y-2">
                <span className="material-symbols-outlined text-status-success text-[32px]">check_circle</span>
                <p className="text-xs text-on-surface font-medium">재설정 링크가 전송되었습니다.</p>
                <p className="text-[11px] text-on-surface-variant">이메일함을 확인해 주세요.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  가입 시 등록한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 전송해 드립니다.
                </p>
                {forgotError && (
                  <p className="text-xs text-status-danger">{forgotError}</p>
                )}
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-full bg-surface-container text-on-surface text-xs border border-border-subtle focus:outline-none focus:ring-1 focus:ring-primary-container"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-full bg-surface-container-high text-xs text-on-surface cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold cursor-pointer disabled:opacity-60"
                  >
                    {forgotLoading ? '발송 중...' : '재설정 링크 발송'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
