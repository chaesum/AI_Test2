import React from 'react';
import { Page, UserProfile } from '../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: UserProfile;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  user,
  isAuthenticated = false,
  onLogout
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.2)] border-b border-border-subtle/40">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6 sm:gap-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer"
          >
            <span className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-inner">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </span>
            <div className="flex flex-col">
              <span className="font-headline-sm text-base sm:text-lg font-semibold tracking-tight text-on-surface group-hover:text-primary transition-colors">
                학습 상담 챗봇
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                currentPage === 'home'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-md'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              서비스 소개
            </button>
            <button
              onClick={() => onNavigate('chat-consultation')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                currentPage === 'chat-consultation'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-md'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              챗봇 상담
            </button>
            <button
              onClick={() => onNavigate('mypage')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                currentPage === 'mypage'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-md'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title={isAuthenticated ? '마이페이지' : '로그인 후 이용 가능'}
            >
              <span>마이페이지</span>
              {!isAuthenticated && (
                <span className="material-symbols-outlined text-[13px] text-outline opacity-80" title="로그인 필요">
                  lock
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Auth & Profile Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => onNavigate('mypage')}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-border-subtle/60 transition-colors cursor-pointer"
                title="마이페이지로 이동"
              >
                <img
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-surface-container-high"
                  src={user.avatarUrl}
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-medium text-on-surface max-w-[90px] truncate hidden sm:inline-block">
                  {user.name}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border border-border-subtle flex items-center gap-1"
                title="로그아웃"
              >
                <span className="material-symbols-outlined text-[15px]">logout</span>
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === 'login'
                    ? 'bg-surface-container-highest text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                로그인
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors cursor-pointer shadow-sm hover:shadow-primary/20"
              >
                회원가입
              </button>
            </div>
          )}

          {/* Mobile direct nav to chat if needed */}
          <button
            onClick={() => onNavigate(currentPage === 'chat-consultation' ? 'mypage' : 'chat-consultation')}
            className="md:hidden p-2 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high cursor-pointer"
            title="상담 챗봇 바로가기"
          >
            <span className="material-symbols-outlined text-[20px]">
              {currentPage === 'chat-consultation' ? 'person' : 'forum'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
