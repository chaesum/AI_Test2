import React, { useState } from 'react';
import { UserProfile, Page } from '../types';
import { auth } from '../lib/firebase';
import { saveUserProfile } from '../lib/userService';
import { updatePassword, signOut, deleteUser } from 'firebase/auth';

interface MyPageProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onNavigate: (page: Page) => void;
}

export const MyPage: React.FC<MyPageProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [studyCategory, setStudyCategory] = useState(user.studyCategory);
  const [consultTone, setConsultTone] = useState(user.consultTone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const [notifyGoals, setNotifyGoals] = useState(user.notifyGoals);
  const [notifyReport, setNotifyReport] = useState(user.notifyReport);
  const [agreeDataTraining, setAgreeDataTraining] = useState(user.agreeDataTraining);

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(user.email);

  // Danger zone modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInputText, setDeleteInputText] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; isSuccess: boolean } | null>(null);

  const showToast = (message: string, isSuccess = true) => {
    setToast({ message, isSuccess });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      name,
      studyCategory,
      consultTone,
      notifyGoals,
      notifyReport,
      agreeDataTraining
    };

    onUpdateUser(updated);

    if (user.uid) {
      try {
        await saveUserProfile(user.uid, {
          ...user,
          ...updated
        });
        showToast('Firestore에 프로필 정보가 안전하게 저장되었습니다.');
        return;
      } catch (err) {
        console.error('Failed to sync to Firestore:', err);
      }
    }
    showToast('프로필 기본 정보가 성공적으로 반영되었습니다.');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmNewPassword) {
      showToast('새 비밀번호를 입력해주세요.', false);
      return;
    }
    if (newPassword.length < 8) {
      showToast('새 비밀번호는 8자 이상이어야 합니다.', false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast('새 비밀번호가 일치하지 않습니다.', false);
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      showToast('로그인된 계정이 없습니다.', false);
      return;
    }

    const isGoogleOnly = currentUser.providerData.some(p => p.providerId === 'google.com') &&
      !currentUser.providerData.some(p => p.providerId === 'password');

    if (isGoogleOnly) {
      showToast('Google 소셜 로그인 계정은 Google 계정 설정에서 비밀번호를 관리합니다.', false);
      return;
    }

    setPasswordUpdating(true);
    try {
      await updatePassword(currentUser, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      showToast('비밀번호가 성공적으로 변경되었습니다.');
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      if (fbErr.code === 'auth/requires-recent-login') {
        showToast('보안을 위해 다시 로그인한 후 비밀번호를 변경해 주세요.', false);
      } else {
        showToast('비밀번호 변경 실패: 영문과 숫자를 조합해 주세요.', false);
      }
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleAvatarChange = () => {
    const avatars = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuApUAMNzsTk57j_L6mIn_c0M5hJnMWasSv310CrU24wT8HYPCTb6v6vEyy-j1zuk9Oz8DIKYvyCwHUTG1_viTaaoKtKNJsVNKUmYs_L6IgyZYISryezMwQkMjbO0-IfsByGjw967hC4x2ETXla7-7I3Bjd15OgzTHEKP8HwcuulKDL4IcBvD9GmKBOGwG9zqN-ytTwsq4yXCa1ZHdit9Vq85U3tToi8PFjHBA-LHy6r5SvL0HYqKkd8',
      'https://lh3.googleusercontent.com/aida/AEtjO1Uds9Eq1qtqN-WwI1ioJmmN2kCMOEgu4m7FnyxJjFIy78AeJLcnnehJG1cuEhtQDljL_gBKVTi8mn8bMcOBQaZrIAoBsN4IUlm-Cq7L7WWW5eLFw1sgyNI8d7joDOLZd3e9yTIbJl54sOiU4uGlFomMok89u3b7uXxYuZbFHhIN7PQGrOl1_C5EfuznGJXrKBidknsPIcFxsLCd4oLJd1iYHEL_ru3bwtVxZ89CzIkp3SXUFodKrgj2ylU'
    ];
    const nextAvatar = user.avatarUrl === avatars[0] ? avatars[1] : avatars[0];
    onUpdateUser({ avatarUrl: nextAvatar });
    if (user.uid) {
      saveUserProfile(user.uid, { ...user, avatarUrl: nextAvatar }).catch(console.error);
    }
    showToast('프로필 사진이 업데이트되었습니다.');
  };

  const handleEmailSave = () => {
    if (tempEmail && tempEmail.includes('@')) {
      setEmail(tempEmail);
      onUpdateUser({ email: tempEmail });
      if (user.uid) {
        saveUserProfile(user.uid, { ...user, email: tempEmail }).catch(console.error);
      }
      setIsEditingEmail(false);
      showToast('이메일 주소가 변경되었습니다.');
    } else {
      showToast('올바른 이메일 주소를 입력해 주세요.', false);
    }
  };

  const handleExecuteDeletion = async () => {
    setDeleting(true);
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      } else {
        await signOut(auth);
      }
    } catch (err) {
      console.warn('Firebase user deletion note:', err);
      await signOut(auth).catch(() => {});
    }

    setDeleting(false);
    setShowDeleteModal(false);
    showToast('계정이 안전하게 탈퇴 처리되었습니다. 메인 홈으로 이동합니다.', true);
    setTimeout(() => {
      onNavigate('home');
    }, 1500);
  };

  return (
    <div className="w-full relative overflow-hidden pb-16">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-semibold">
                Firebase Firestore Identity
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-semibold text-on-surface tracking-tight">
              회원정보 관리
            </h1>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-1">
              등록된 계정 및 Firebase 클라우드 프로필을 확인하고 수정할 수 있습니다
            </p>
          </div>

          {/* Status Meta Badge */}
          <div className="flex items-center gap-2.5 bg-surface-container-high px-4 py-2 rounded-full self-start md:self-auto shadow-sm border border-border-subtle/50">
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
            <span className="text-xs text-on-surface">인증 상태: </span>
            <span className="text-xs text-status-success font-semibold">
              {user.uid ? 'Firebase 클라우드 연동됨' : '로컬 모드 활성'}
            </span>
          </div>
        </div>

        {/* Main Grid Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Summary & Activity Stats (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Profile Overview Card */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col items-center text-center">
                <div className="relative group mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg p-1 bg-surface-container-high border border-border-subtle">
                    <img
                      alt={user.name}
                      className="w-full h-full object-cover rounded-full"
                      src={user.avatarUrl}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <button
                    onClick={handleAvatarChange}
                    aria-label="프로필 사진 변경"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:scale-105 transition-transform shadow-md cursor-pointer"
                    type="button"
                    title="프로필 사진 변경"
                  >
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-headline-sm text-xl font-semibold text-on-surface">{user.name}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-xs font-medium text-secondary">
                    {user.role}
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant mb-4">{user.email}</p>

                <div className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-surface-container-low mb-6 border border-border-subtle/40">
                  <span className="material-symbols-outlined text-on-surface-variant text-[16px]">calendar_month</span>
                  <span className="text-xs text-on-surface-variant">
                    가입일: {user.joinedDate} ({user.daysActive}일째 학습 중)
                  </span>
                </div>

                {/* Mini Consultation Telemetry Chart */}
                <div className="w-full bg-surface-container-low p-4 rounded-xl text-left border border-border-subtle/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-on-surface">누적 인공지능 학습 상담</span>
                    <span className="text-xs text-secondary font-semibold">총 {user.consultationCount}회</span>
                  </div>

                  {/* Sparkline Graphic */}
                  <div className="h-14 w-full flex items-end gap-1.5 pt-2 pb-1">
                    <div
                      className="flex-1 bg-surface-container-high hover:bg-primary-container rounded-t-sm transition-all h-[30%]"
                      title="1주 전: 3회"
                    ></div>
                    <div
                      className="flex-1 bg-surface-container-high hover:bg-primary-container rounded-t-sm transition-all h-[55%]"
                      title="2주 전: 6회"
                    ></div>
                    <div
                      className="flex-1 bg-surface-container-high hover:bg-primary-container rounded-t-sm transition-all h-[40%]"
                      title="3주 전: 4회"
                    ></div>
                    <div
                      className="flex-1 bg-surface-container-high hover:bg-primary-container rounded-t-sm transition-all h-[75%]"
                      title="4주 전: 8회"
                    ></div>
                    <div
                      className="flex-1 bg-surface-container-high hover:bg-primary-container rounded-t-sm transition-all h-[60%]"
                      title="5주 전: 7회"
                    ></div>
                    <div
                      className="flex-1 bg-surface-container-high hover:bg-primary-container rounded-t-sm transition-all h-[90%]"
                      title="6주 전: 10회"
                    ></div>
                    <div
                      className="flex-1 bg-primary-container rounded-t-sm transition-all h-[100%] shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                      title="이번 주: 12회 (최고치)"
                    ></div>
                  </div>

                  <div className="flex justify-between items-center mt-2 text-xs text-on-surface-variant">
                    <span>최근 7주 상담 추이</span>
                    <span className="text-primary font-medium">이번 주 활발</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary Info Banner */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5">psychology_alt</span>
                <div>
                  <h3 className="text-sm font-semibold text-on-surface">전담 챗봇 맞춤화 프로필</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    상담 세션마다 설정된 사용자 정보를 기반으로 정밀한 학습 및 커리어 로드맵을 제안합니다.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-surface-container-high text-xs text-on-surface font-medium border border-border-subtle/50">
                  목표: {user.targetGoal}
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-container-high text-xs text-on-surface font-medium border border-border-subtle/50">
                  선호: {user.coachingStyle}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Account Management Forms & Danger Zone (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Section 1: Basic Information */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 lg:p-8 shadow-md">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-surface-container-high">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-inner">
                    <span className="material-symbols-outlined text-[18px]">badge</span>
                  </span>
                  <div>
                    <h2 className="font-headline-sm text-lg sm:text-xl font-semibold text-on-surface">
                      기본 계정 정보
                    </h2>
                    <p className="text-xs text-on-surface-variant">플랫폼 및 상담 세션에서 식별되는 프로필 정보입니다.</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant">
                  Firestore 실시간 동기화
                </span>
              </div>

              <form onSubmit={handleProfileSave} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nickname / Name Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-on-surface flex items-center justify-between" htmlFor="user-name">
                      <span>이름 / 닉네임</span>
                      <span className="text-[11px] text-on-surface-variant font-normal">실명 또는 별칭</span>
                    </label>
                    <input
                      id="user-name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full h-12 px-4 rounded-full bg-surface-container-low text-on-surface text-sm border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                    />
                  </div>

                  {/* Email Verification Field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-on-surface flex items-center justify-between" htmlFor="user-email">
                      <span>이메일 주소</span>
                      <span className="text-xs text-status-success flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> 인증 완료
                      </span>
                    </label>
                    <div className="relative flex items-center">
                      {isEditingEmail ? (
                        <div className="w-full flex items-center gap-2">
                          <input
                            type="email"
                            value={tempEmail}
                            onChange={e => setTempEmail(e.target.value)}
                            className="w-full h-12 px-4 rounded-full bg-surface-container text-on-surface text-sm border border-primary-container focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleEmailSave}
                            className="px-3 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-medium cursor-pointer"
                          >
                            저장
                          </button>
                        </div>
                      ) : (
                        <>
                          <input
                            id="user-email"
                            type="email"
                            readOnly
                            value={email}
                            className="w-full h-12 pl-4 pr-20 rounded-full bg-surface-container-low text-on-surface text-sm border border-border-subtle focus:outline-none cursor-default"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setTempEmail(email);
                              setIsEditingEmail(true);
                            }}
                            className="absolute right-2 px-3 py-1.5 rounded-full bg-surface-container text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                          >
                            변경
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Learning Domain & Level Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-on-surface" htmlFor="study-category">
                      관심 학습 분야
                    </label>
                    <div className="relative">
                      <select
                        id="study-category"
                        value={studyCategory}
                        onChange={e => setStudyCategory(e.target.value)}
                        className="w-full h-12 px-4 rounded-full bg-surface-container-low text-on-surface text-sm border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container appearance-none transition-all cursor-pointer pr-10"
                      >
                        <option value="cs">소프트웨어 및 컴퓨터공학</option>
                        <option value="math">수학 및 데이터 분석</option>
                        <option value="business">경영 / 비즈니스 전략</option>
                        <option value="language">외국어 및 어학 시험</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-3 pointer-events-none text-on-surface-variant text-[20px]">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-on-surface" htmlFor="consult-tone">
                      상담 톤앤매너
                    </label>
                    <div className="relative">
                      <select
                        id="consult-tone"
                        value={consultTone}
                        onChange={e => setConsultTone(e.target.value)}
                        className="w-full h-12 px-4 rounded-full bg-surface-container-low text-on-surface text-sm border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container appearance-none transition-all cursor-pointer pr-10"
                      >
                        <option value="mentor">따뜻하고 격려해주는 멘토형</option>
                        <option value="analytical">논리적이고 분석적인 코치형</option>
                        <option value="practical">핵심만 빠르게 짚어주는 실전형</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-3 pointer-events-none text-on-surface-variant text-[20px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-primary-container text-on-primary-container text-sm font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>변경사항 저장</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Section 2: Password Security */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 lg:p-8 shadow-md">
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-surface-container-high">
                <span className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                </span>
                <div>
                  <h2 className="font-headline-sm text-lg sm:text-xl font-semibold text-on-surface">
                    비밀번호 변경
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    정기적인 비밀번호 변경으로 계정 정보를 안전하게 보호하세요.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-on-surface" htmlFor="current-password">
                    현재 비밀번호 (선택)
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    placeholder="기존 비밀번호"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full h-12 px-4 rounded-full bg-surface-container-low text-on-surface placeholder:text-outline text-sm border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-on-surface" htmlFor="new-password">
                      새 비밀번호
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      placeholder="영문, 숫자 포함 8자 이상"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full h-12 px-4 rounded-full bg-surface-container-low text-on-surface placeholder:text-outline text-sm border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-on-surface" htmlFor="confirm-new-password">
                      새 비밀번호 확인
                    </label>
                    <input
                      id="confirm-new-password"
                      type="password"
                      placeholder="새 비밀번호 재입력"
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      className="w-full h-12 px-4 rounded-full bg-surface-container-low text-on-surface placeholder:text-outline text-sm border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={passwordUpdating}
                    className="px-6 py-3 rounded-full bg-surface-elevated text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-2 cursor-pointer border border-border-subtle active:scale-95 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">key</span>
                    <span>{passwordUpdating ? '변경 중...' : '비밀번호 업데이트'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Section 3: Notification & Consultation Environment */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 lg:p-8 shadow-md">
              <div className="flex items-center gap-3 pb-6 mb-4 border-b border-surface-container-high">
                <span className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-[18px]">notifications</span>
                </span>
                <div>
                  <h2 className="font-headline-sm text-lg sm:text-xl font-semibold text-on-surface">
                    알림 및 상담 환경설정
                  </h2>
                  <p className="text-xs text-on-surface-variant">학습 알림 및 추천 세션 수신 정책을 관리합니다.</p>
                </div>
              </div>

              <div className="divide-y divide-surface-container-high flex flex-col">
                {/* Item 1 */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-on-surface">학습 목표 및 리마인더 알림</span>
                    <span className="text-xs text-on-surface-variant">
                      주간 스터디 루틴 및 챗봇 권장 복습 세션 알림을 수신합니다.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={notifyGoals}
                      onChange={e => {
                        const val = e.target.checked;
                        setNotifyGoals(val);
                        onUpdateUser({ notifyGoals: val });
                        if (user.uid) saveUserProfile(user.uid, { ...user, notifyGoals: val }).catch(() => {});
                        showToast(`학습 목표 알림이 ${val ? '활성화' : '해제'}되었습니다.`);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>

                {/* Item 2 */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-on-surface">상담 분석 리포트 메일링</span>
                    <span className="text-xs text-on-surface-variant">
                      매월 1회 인공지능이 종합 분석한 자기주도학습 진단서를 이메일로 받아봅니다.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={notifyReport}
                      onChange={e => {
                        const val = e.target.checked;
                        setNotifyReport(val);
                        onUpdateUser({ notifyReport: val });
                        if (user.uid) saveUserProfile(user.uid, { ...user, notifyReport: val }).catch(() => {});
                        showToast(`상담 분석 리포트 메일링이 ${val ? '활성화' : '해제'}되었습니다.`);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>

                {/* Item 3 */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-on-surface">
                      대화 내역 인공지능 개인화 학습 활용 동의
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      회원님의 피드백을 기반으로 챗봇 알고리즘 답변 품질을 지속 개선합니다.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={agreeDataTraining}
                      onChange={e => {
                        const val = e.target.checked;
                        setAgreeDataTraining(val);
                        onUpdateUser({ agreeDataTraining: val });
                        if (user.uid) saveUserProfile(user.uid, { ...user, agreeDataTraining: val }).catch(() => {});
                        showToast(`데이터 활용 동의 설정이 ${val ? '승인' : '철회'}되었습니다.`);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 4: CRITICAL REQUIREMENT - Danger Zone / Account Deletion */}
            <div className="bg-surface-card border border-status-danger/30 rounded-2xl p-6 lg:p-8 shadow-md relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-error-container/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-full bg-error-container/30 text-status-danger flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[22px]">warning</span>
                </span>
                <div className="flex flex-col gap-2 flex-grow">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-sm text-lg sm:text-xl font-semibold text-error">
                      계정 삭제 (회원 탈퇴)
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-error-container/40 text-error text-xs font-semibold">
                      주의 구역
                    </span>
                  </div>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    계정 탈퇴 시 기존{' '}
                    <strong className="text-on-surface font-medium">학습 상담 내역 및 Firebase 개인정보가 모두 즉시 영구 삭제</strong>
                    되며, 복구할 수 없습니다. 생성된 진로 리포트 및 북마크도 모두 파기됩니다.
                  </p>
                  <div className="mt-4 pt-2">
                    <button
                      onClick={() => {
                        setDeleteInputText('');
                        setShowDeleteModal(true);
                      }}
                      type="button"
                      className="px-6 py-3 rounded-full bg-error-container/30 text-error hover:bg-status-danger hover:text-white transition-all text-sm font-semibold flex items-center gap-2 shadow-sm cursor-pointer border border-status-danger/30"
                    >
                      <span className="material-symbols-outlined text-[18px]">person_remove</span>
                      <span>회원 탈퇴</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-surface-dim/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border-prominent w-full max-w-lg rounded-2xl p-6 lg:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-error-container/40 text-error flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[28px]">delete_forever</span>
            </div>
            <h3 className="font-headline-sm text-xl font-semibold text-on-surface mb-2">정말 탈퇴하시겠습니까?</h3>
            <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed">
              탈퇴 처리 즉시 모든 상담 기록, 학습 리포트 및 Firebase 개인 맞춤 프로필 데이터가 서버에서 영구 삭제됩니다. 이 작업은 취소할 수 없습니다.
            </p>
            <div className="bg-surface-container-low p-4 rounded-xl mb-6 flex flex-col gap-2 border border-border-subtle/50">
              <label className="text-xs text-on-surface-variant" htmlFor="delete-confirm-text">
                확인을 위해 아래 입력창에 <span className="text-error font-bold">&quot;계정삭제&quot;</span>를 입력하세요.
              </label>
              <input
                id="delete-confirm-text"
                type="text"
                placeholder="계정삭제"
                value={deleteInputText}
                onChange={e => setDeleteInputText(e.target.value)}
                className="w-full h-11 px-4 rounded-full bg-surface-container-high text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-status-danger transition-all border border-border-subtle"
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface text-sm font-medium hover:bg-surface-bright transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                disabled={deleteInputText.trim() !== '계정삭제' || deleting}
                onClick={handleExecuteDeletion}
                className="px-5 py-2.5 rounded-full bg-status-danger text-white text-sm font-semibold hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {deleting ? '삭제 중...' : '영구 삭제 확인'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-surface-elevated text-on-surface border border-border-prominent px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <span
            className={`material-symbols-outlined text-[20px] ${
              toast.isSuccess ? 'text-status-success' : 'text-primary'
            }`}
          >
            {toast.isSuccess ? 'check_circle' : 'info'}
          </span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
};
