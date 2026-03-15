'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase-browser';
import { useTranslation } from '../i18n';

// ── CONSTANTS ──
const GREEN = '#22C55E', GREEN_DARK = '#16A34A', BLUE = '#3B82F6', BG = '#F2F8F5';
const CARD_BG = '#FFFFFF', TEXT_DARK = '#1A2E23', TEXT_MID = '#3D6B50', TEXT_LIGHT = '#6B9A7E';
const BORDER = '#D5E8DC', BORDER_LIGHT = '#E8F2EC';

// Content arrays are now loaded from i18n/content/ via useTranslation().getContent()


// ── COMPONENTS ──
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 18px', background: '#EBF7F0', borderRadius: 20, borderBottomLeftRadius: 4, width: 'fit-content', marginLeft: 8 }}>
      {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite` }} />)}
    </div>
  );
}

function MessageBubble({ message, isUser }) {
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 12, paddingLeft: isUser ? 48 : 0, paddingRight: isUser ? 0 : 48, animation: 'fadeSlideIn 0.3s ease-out' }}>
      {!isUser && (
        <div style={{ width: 36, height: 36, borderRadius: '50%', marginRight: 8, flexShrink: 0, background: `linear-gradient(135deg, ${GREEN}, ${BLUE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4, boxShadow: '0 2px 8px rgba(34,197,94,0.25)' }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, color: '#FFF' }}>M</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 13, color: '#FFF' }}>v</span>
        </div>
      )}
      <div style={{ padding: '14px 18px', background: isUser ? `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})` : '#EBF7F0', color: isUser ? '#FFF' : TEXT_DARK, borderRadius: 20, borderBottomRightRadius: isUser ? 4 : 20, borderBottomLeftRadius: isUser ? 20 : 4, fontSize: 15, lineHeight: 1.65, boxShadow: isUser ? '0 2px 12px rgba(34,197,94,0.2)' : '0 1px 8px rgba(0,0,0,0.04)', whiteSpace: 'pre-wrap' }}>
        {message}
      </div>
    </div>
  );
}

// ── COUNTRY LIST ──
const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Netherlands", "Germany", "France", "India",
  "Spain", "Italy", "Brazil", "Mexico", "South Africa", "Nigeria", "Kenya", "Japan", "South Korea",
  "Philippines", "Indonesia", "Sweden", "Norway", "Denmark", "Finland", "Belgium", "Switzerland",
  "Austria", "Ireland", "New Zealand", "Portugal", "Poland", "Turkey", "Egypt", "Morocco",
  "Saudi Arabia", "UAE", "Pakistan", "Bangladesh", "Colombia", "Argentina", "Chile", "Peru",
  "Thailand", "Vietnam", "Malaysia", "Singapore", "Israel", "Greece", "Czech Republic", "Romania", "Other"
];

const AGE_RANGES = [
  "Under 18", "18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50+"
];

// ── ONBOARDING (5 steps: Welcome → About You → Children → Parenting → Terms) ──
function OnboardingFlow({ onComplete }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  // Step 1 — About You
  const [momName, setMomName] = useState('');
  const [momAge, setMomAge] = useState('');
  const [country, setCountry] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryList, setShowCountryList] = useState(false);
  // Step 2 — Children
  const [children, setChildren] = useState([{ name: '', age: '', id: 1 }]);
  // Step 3 — Parenting
  const [parentingStyle, setParentingStyle] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [supportSystem, setSupportSystem] = useState('');
  // Step 4 — Terms
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [animating, setAnimating] = useState(false);

  const filteredCountries = COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));

  const addChild = () => setChildren(prev => [...prev, { name: '', age: '', id: Date.now() }]);
  const removeChild = (id) => setChildren(prev => prev.filter(c => c.id !== id));
  const updateChild = (id, field, value) => setChildren(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));

  const goNext = () => { setAnimating(true); setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 300); };
  const goBack = () => { setAnimating(true); setTimeout(() => { setStep(s => s - 1); setAnimating(false); }, 300); };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return momName.trim().length >= 1 && momAge !== '' && country !== '';
    if (step === 2) return children.some(c => c.name.trim() && c.age.trim());
    if (step === 3) return parentingStyle !== '' && challenges.length > 0 && supportSystem !== '';
    if (step === 4) return acceptedTerms;
    return true;
  };

  const toggleChallenge = (c) => {
    setChallenges(prev => prev.includes(c) ? prev.filter(x => x !== c) : prev.length < 4 ? [...prev, c] : prev);
  };

  const finish = () => {
    const validChildren = children.filter(c => c.name.trim() && c.age.trim()).map(c => ({ ...c, notes: '' }));
    onComplete({ momName: momName.trim(), momAge, country, children: validChildren, parentingStyle, challenges, supportSystem });
  };

  const totalSteps = 5;
  const progress = ((step) / (totalSteps - 1)) * 100;

  const inputStyle = {
    border: `2px solid ${BORDER}`, fontSize: 15, color: TEXT_DARK, background: '#FAFDF7',
    borderRadius: 14, padding: '12px 16px', width: '100%', fontFamily: "'DM Sans', sans-serif",
    outline: 'none', transition: 'border-color 0.2s',
  };
  const btnPrimary = {
    background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`, color: '#FFF', border: 'none',
    borderRadius: 16, padding: '14px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
    transition: 'all 0.2s', opacity: canProceed() ? 1 : 0.4, pointerEvents: canProceed() ? 'auto' : 'none',
  };
  const btnSecondary = {
    background: 'transparent', color: TEXT_MID, border: `1.5px solid ${BORDER}`,
    borderRadius: 16, padding: '14px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
  };
  const sectionLabel = { fontSize: 13, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, display: 'block' };
  const chipSelected = (sel) => ({
    background: sel ? `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})` : CARD_BG,
    color: sel ? '#FFF' : TEXT_DARK,
    border: sel ? 'none' : `1.5px solid ${BORDER}`,
    borderRadius: 12, padding: '10px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
    boxShadow: sel ? '0 3px 10px rgba(34,197,94,0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
  });
  const optionCard = (sel) => ({
    background: sel ? '#EBF7F0' : CARD_BG,
    border: sel ? `2px solid ${GREEN}` : `1.5px solid ${BORDER_LIGHT}`,
    borderRadius: 14, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
    display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s',
    boxShadow: sel ? '0 3px 10px rgba(34,197,94,0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
    fontFamily: "'DM Sans', sans-serif",
  });

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Archivo+Black&display=swap');
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-16px)} }
        *{box-sizing:border-box} input:focus,select:focus{outline:none;border-color:${GREEN}!important}
      `}</style>

      {/* Progress Bar */}
      {step > 0 && (
        <div style={{ padding: '14px 20px 0', background: BG }}>
          <div style={{ height: 5, background: BORDER_LIGHT, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: `linear-gradient(90deg, ${GREEN}, ${BLUE})`, borderRadius: 3, width: `${progress}%`, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ fontSize: 11, color: TEXT_LIGHT, marginTop: 5, textAlign: 'center' }}>{t('onboarding.step', { current: step, total: totalSteps - 1 })}</div>
        </div>
      )}

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '16px 24px', maxWidth: 480, width: '100%', margin: '0 auto',
        animation: animating ? 'fadeOut 0.3s ease' : 'fadeSlideIn 0.5s ease',
        overflowY: 'auto',
      }}>

        {/* ════════ STEP 0: WELCOME ════════ */}
        {step === 0 && (
          <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ width: 100, height: 1.5, background: `linear-gradient(90deg, ${GREEN}, ${BLUE})`, borderRadius: 2, opacity: 0.4, margin: '0 auto 10px' }} />
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 36, color: GREEN, letterSpacing: 2 }}>Momz</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: 'italic', fontSize: 36, color: BLUE, letterSpacing: 2 }}>Veda</span>
              </div>
              <div style={{ width: 100, height: 1.5, background: `linear-gradient(90deg, ${GREEN}, ${BLUE})`, borderRadius: 2, opacity: 0.4, margin: '10px auto 0' }} />
            </div>
            <p style={{ fontSize: 13, color: TEXT_LIGHT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 32, fontWeight: 500 }}>
              Your Mom Friend. Always Here.
            </p>
            <div style={{
              background: CARD_BG, borderRadius: 24, padding: '28px 24px', marginBottom: 32,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: `1px solid ${BORDER_LIGHT}`,
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💚</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>{t('onboarding.welcome.title')}</h2>
              <p style={{ fontSize: 15, color: TEXT_MID, lineHeight: 1.7, marginBottom: 0 }}>
                {t('onboarding.welcome.description')}
              </p>
            </div>
            <button onClick={goNext} style={{ ...btnPrimary, width: '100%', padding: '16px', fontSize: 17 }}>
              {t('onboarding.welcome.startButton')}
            </button>
          </div>
        )}

        {/* ════════ STEP 1: ABOUT YOU (Name + Age + Country) ════════ */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 36, marginBottom: 8 }}>👋</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>{t('onboarding.aboutYou.title')}</h2>
            <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 20 }}>{t('onboarding.aboutYou.subtitle')}</p>

            {/* Name */}
            <label style={sectionLabel}>{t('onboarding.aboutYou.nameLabel')}</label>
            <input type="text" value={momName} onChange={e => setMomName(e.target.value)}
              placeholder={t('onboarding.aboutYou.namePlaceholder')} style={{ ...inputStyle, marginBottom: 16 }} autoFocus />

            {/* Age Range */}
            <label style={sectionLabel}>{t('onboarding.aboutYou.ageLabel')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
              {AGE_RANGES.map(r => (
                <button key={r} onClick={() => setMomAge(r)} style={chipSelected(momAge === r)}>{r}</button>
              ))}
            </div>

            {/* Country */}
            <label style={sectionLabel}>{t('onboarding.aboutYou.countryLabel')}</label>
            <input type="text" value={countrySearch}
              onChange={e => { setCountrySearch(e.target.value); setCountry(''); setShowCountryList(true); }}
              onFocus={() => setShowCountryList(true)}
              placeholder={t('onboarding.aboutYou.countryPlaceholder')} style={inputStyle} />
            {showCountryList && countrySearch && !country && (
              <div style={{ maxHeight: 120, overflowY: 'auto', borderRadius: 10, border: `1px solid ${BORDER_LIGHT}`, marginTop: 4, background: CARD_BG }}>
                {filteredCountries.map(c => (
                  <button key={c} onClick={() => { setCountry(c); setCountrySearch(c); setShowCountryList(false); }} style={{
                    width: '100%', textAlign: 'left', background: CARD_BG, border: 'none',
                    borderBottom: `1px solid ${BORDER_LIGHT}`, padding: '9px 14px',
                    fontSize: 14, color: TEXT_DARK, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  }}>{c}</button>
                ))}
              </div>
            )}
            {country && <div style={{ fontSize: 13, color: GREEN_DARK, fontWeight: 600, marginTop: 6 }}>✓ {country}</div>}
          </div>
        )}

        {/* ════════ STEP 2: YOUR CHILDREN (Names + Ages) ════════ */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 36, marginBottom: 8 }}>👶</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>{t('onboarding.children.title')}</h2>
            <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 16 }}>{t('onboarding.children.subtitle')}</p>

            {children.map((child, i) => (
              <div key={child.id} style={{
                background: CARD_BG, borderRadius: 14, padding: 14, marginBottom: 10,
                border: `1px solid ${BORDER_LIGHT}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: GREEN_DARK }}>👧 {t('onboarding.children.childNumber', { number: i + 1 })}</span>
                  {children.length > 1 && (
                    <button onClick={() => removeChild(child.id)} style={{
                      background: 'none', border: 'none', color: '#EF4444', fontSize: 12,
                      cursor: 'pointer', fontWeight: 600, padding: '2px 6px',
                    }}>{t('onboarding.children.removeChild')}</button>
                  )}
                </div>
                <input type="text" value={child.name} onChange={e => updateChild(child.id, 'name', e.target.value)}
                  placeholder={t('onboarding.children.namePlaceholder')}
                  style={{ ...inputStyle, fontSize: 14, padding: '10px 14px', marginBottom: 8 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" value={child.age} onChange={e => updateChild(child.id, 'age', e.target.value)}
                    placeholder={t('onboarding.children.agePlaceholder')}
                    style={{ ...inputStyle, fontSize: 14, padding: '10px 14px', flex: 1 }} />
                  <select value={child.age} onChange={e => updateChild(child.id, 'age', e.target.value)}
                    style={{ ...inputStyle, fontSize: 12, padding: '10px 8px', flex: 1, appearance: 'auto', cursor: 'pointer' }}>
                    <option value="">{t('onboarding.children.agePickLabel')}</option>
                    <option value="0.08">{t('onboarding.children.newborn')}</option>
                    <option value="0.5">{t('onboarding.children.baby')}</option>
                    <option value="1.5">{t('onboarding.children.toddler')}</option>
                    <option value="3">{t('onboarding.children.preschool')}</option>
                    <option value="8">{t('onboarding.children.schoolAge')}</option>
                    <option value="14">{t('onboarding.children.teen')}</option>
                    <option value="expecting">{t('onboarding.children.expecting')}</option>
                  </select>
                </div>
              </div>
            ))}

            <button onClick={addChild} style={{
              width: '100%', background: '#F0FAF4', border: `1.5px dashed ${GREEN}`,
              borderRadius: 12, padding: '10px', fontSize: 14, color: GREEN_DARK,
              fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>{t('onboarding.children.addAnother')}</button>
            <p style={{ fontSize: 11, color: TEXT_LIGHT, marginTop: 6, textAlign: 'center' }}>
              {t('onboarding.children.expectingNote')}
            </p>
          </div>
        )}

        {/* ════════ STEP 3: PARENTING STYLE + CHALLENGES + SUPPORT ════════ */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🌱</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>{t('onboarding.parenting.title')}</h2>
            <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 18 }}>{t('onboarding.parenting.subtitle')}</p>

            {/* Parenting Style */}
            <label style={sectionLabel}>{t('onboarding.parenting.styleLabel')}</label>
            <div style={{ display: 'grid', gap: 8, marginBottom: 18 }}>
              {[
                { id: 'gentle', emoji: '💚', title: t('onboarding.parenting.gentle'), desc: t('onboarding.parenting.gentleDesc') },
                { id: 'structured', emoji: '📋', title: t('onboarding.parenting.structured'), desc: t('onboarding.parenting.structuredDesc') },
                { id: 'balanced', emoji: '⚖️', title: t('onboarding.parenting.balanced'), desc: t('onboarding.parenting.balancedDesc') },
                { id: 'instinctive', emoji: '✨', title: t('onboarding.parenting.instinctive'), desc: t('onboarding.parenting.instinctiveDesc') },
                { id: 'figuring-out', emoji: '🤷‍♀️', title: t('onboarding.parenting.figuringOut'), desc: t('onboarding.parenting.figuringOutDesc') },
              ].map(s => (
                <button key={s.id} onClick={() => setParentingStyle(s.id)} style={optionCard(parentingStyle === s.id)}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{s.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: parentingStyle === s.id ? GREEN_DARK : TEXT_DARK }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: TEXT_MID }}>{s.desc}</div>
                  </div>
                  {parentingStyle === s.id && <span style={{ color: GREEN, fontWeight: 700 }}>✓</span>}
                </button>
              ))}
            </div>

            {/* Challenges */}
            <label style={sectionLabel}>{t('onboarding.parenting.challengesLabel')} <span style={{ fontWeight: 400, color: TEXT_LIGHT }}>{t('onboarding.parenting.challengesHint')}</span></label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 4 }}>
              {[
                { id: 'sleep', emoji: '😴', label: t('onboarding.parenting.sleep') },
                { id: 'tantrums', emoji: '😤', label: t('onboarding.parenting.tantrums') },
                { id: 'feeding', emoji: '🥦', label: t('onboarding.parenting.feeding') },
                { id: 'guilt', emoji: '💔', label: t('onboarding.parenting.guilt') },
                { id: 'work-life', emoji: '⏰', label: t('onboarding.parenting.workLife') },
                { id: 'loneliness', emoji: '🫂', label: t('onboarding.parenting.loneliness') },
                { id: 'anxiety', emoji: '😰', label: t('onboarding.parenting.anxiety') },
                { id: 'partner', emoji: '💬', label: t('onboarding.parenting.partner') },
                { id: 'screen-time', emoji: '📱', label: t('onboarding.parenting.screenTime') },
                { id: 'milestones', emoji: '📈', label: t('onboarding.parenting.milestones') },
                { id: 'discipline', emoji: '🚦', label: t('onboarding.parenting.discipline') },
                { id: 'self-care', emoji: '🧘‍♀️', label: t('onboarding.parenting.selfCare') },
              ].map(ch => {
                const sel = challenges.includes(ch.id);
                return (
                  <button key={ch.id} onClick={() => toggleChallenge(ch.id)} style={{
                    ...chipSelected(sel), display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                  }}>
                    <span style={{ fontSize: 18 }}>{ch.emoji}</span>
                    <span style={{ fontSize: 12 }}>{ch.label}</span>
                    {sel && <span style={{ marginLeft: 'auto', fontSize: 12 }}>✓</span>}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 11, color: TEXT_LIGHT, marginBottom: 18, textAlign: 'center' }}>{t('onboarding.parenting.challengesCount', { count: challenges.length })}</p>

            {/* Support System */}
            <label style={sectionLabel}>{t('onboarding.parenting.supportLabel')}</label>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { id: 'partner-home', emoji: '👫', title: t('onboarding.parenting.partnerHome') },
                { id: 'partner-busy', emoji: '💼', title: t('onboarding.parenting.partnerBusy') },
                { id: 'family-nearby', emoji: '👨‍👩‍👧', title: t('onboarding.parenting.familyNearby') },
                { id: 'family-far', emoji: '🌍', title: t('onboarding.parenting.familyFar') },
                { id: 'solo', emoji: '💪', title: t('onboarding.parenting.solo') },
                { id: 'community', emoji: '👩‍👩‍👦', title: t('onboarding.parenting.community') },
                { id: 'mixed', emoji: '🧩', title: t('onboarding.parenting.mixed') },
              ].map(s => (
                <button key={s.id} onClick={() => setSupportSystem(s.id)} style={optionCard(supportSystem === s.id)}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{s.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: supportSystem === s.id ? GREEN_DARK : TEXT_DARK }}>{s.title}</span>
                  {supportSystem === s.id && <span style={{ marginLeft: 'auto', color: GREEN, fontWeight: 700 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════════ STEP 4: TERMS & PRIVACY ════════ */}
        {step === 4 && (
          <div>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>{t('onboarding.terms.title')}</h2>
            <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 20 }}>{t('onboarding.terms.subtitle')}</p>

            <div style={{
              background: CARD_BG, borderRadius: 16, padding: '20px', marginBottom: 20,
              border: `1px solid ${BORDER_LIGHT}`, textAlign: 'center',
            }}>
              <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.7, marginBottom: 16 }}>
                {t('onboarding.terms.description')}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href="/terms" target="_blank" style={{
                  flex: 1, textAlign: 'center', padding: '12px', borderRadius: 12,
                  background: '#F0FAF4', color: GREEN_DARK, fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', border: `1.5px solid ${BORDER}`,
                }}>{t('onboarding.terms.termsLink')}</a>
                <a href="/privacy" target="_blank" style={{
                  flex: 1, textAlign: 'center', padding: '12px', borderRadius: 12,
                  background: '#EFF6FF', color: '#2563EB', fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', border: '1.5px solid #BFDBFE',
                }}>{t('onboarding.terms.privacyLink')}</a>
              </div>
            </div>

            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
              background: acceptedTerms ? '#EBF7F0' : CARD_BG,
              border: acceptedTerms ? `2px solid ${GREEN}` : `2px solid ${BORDER}`,
              borderRadius: 14, padding: 14, transition: 'all 0.2s',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                background: acceptedTerms ? GREEN : '#FFF',
                border: acceptedTerms ? 'none' : `2px solid ${BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', marginTop: 1,
              }}>
                {acceptedTerms && <span style={{ color: '#FFF', fontSize: 14, fontWeight: 700 }}>✓</span>}
              </div>
              <div>
                <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} style={{ display: 'none' }} />
                <span style={{ fontSize: 13, color: TEXT_DARK, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: t('onboarding.terms.acceptCheckbox') }} />
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {step > 0 && (
        <div style={{ padding: '12px 24px 24px', display: 'flex', gap: 12, maxWidth: 480, width: '100%', margin: '0 auto' }}>
          <button onClick={goBack} style={btnSecondary}>{t('onboarding.backButton')}</button>
          <button onClick={step === 4 ? finish : goNext} style={{ ...btnPrimary, flex: 1 }}>
            {step === 4 ? t('onboarding.finishButton') : t('onboarding.continueButton')}
          </button>
        </div>
      )}
    </div>
  );
}

// ── localStorage helpers ──
function loadStored(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem('momzveda_' + key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function saveStored(key, value) {
  try { localStorage.setItem('momzveda_' + key, JSON.stringify(value)); } catch {}
}

// ── MAIN APP ──
export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const { t, tp, lang, getContent, isRTL: rtl } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(() => loadStored('onboarded', false));
  const [momProfile, setMomProfile] = useState(() => loadStored('momProfile', null));
  const [messages, setMessages] = useState(() => loadStored('messages', []));
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [childProfiles, setChildProfiles] = useState(() => loadStored('childProfiles', []));
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChild, setNewChild] = useState({ name: '', age: '', notes: '' });
  const [momWins, setMomWins] = useState(() => loadStored('momWins', []));
  const [newWin, setNewWin] = useState('');
  const [dailyTip, setDailyTip] = useState('');
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPremium, setIsPremium] = useState(() => loadStored('isPremium', false));
  const [dailyMsgCount, setDailyMsgCount] = useState(() => {
    const saved = loadStored('dailyMsgData', null);
    if (saved && saved.date === new Date().toDateString()) return saved.count;
    return 0;
  });
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [weeklyTip, setWeeklyTip] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);
  const FREE_MSG_LIMIT = 5;
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ── Load user session + data from Supabase ──
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);

      // Load profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile && profile.onboarded) {
        const momProf = {
          momName: profile.mom_name, momAge: profile.mom_age, country: profile.country,
          parentingStyle: profile.parenting_style, challenges: profile.challenges || [],
          supportSystem: profile.support_system,
        };
        setMomProfile(momProf); setOnboarded(true); setIsPremium(profile.is_premium || false);
        saveStored('momProfile', momProf); saveStored('onboarded', true); saveStored('isPremium', profile.is_premium || false);
      }

      // Load children
      const { data: kids } = await supabase.from('children').select('*').eq('user_id', user.id).order('created_at');
      if (kids && kids.length > 0) {
        const mapped = kids.map(k => ({ id: k.id, name: k.name, age: k.age, notes: k.notes || '' }));
        setChildProfiles(mapped); saveStored('childProfiles', mapped);
      }

      // Load messages
      const { data: msgs } = await supabase.from('messages').select('*').eq('user_id', user.id).order('created_at');
      if (msgs && msgs.length > 0) {
        const mapped = msgs.map(m => ({ role: m.role, content: m.content }));
        setMessages(mapped); saveStored('messages', mapped);
      }

      // Load wins
      const { data: wins } = await supabase.from('mom_wins').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (wins && wins.length > 0) {
        const mapped = wins.map(w => ({ id: w.id, text: w.text, date: w.date }));
        setMomWins(mapped); saveStored('momWins', mapped);
      }

      // Load daily usage
      const today = new Date().toDateString();
      const { data: usage } = await supabase.from('daily_usage').select('*').eq('user_id', user.id).eq('date', today).maybeSingle();
      if (usage) setDailyMsgCount(usage.msg_count);

      // Verify premium status with Stripe (authoritative source)
      try {
        const stripeRes = await fetch('/api/stripe/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerEmail: user.email }),
        });
        const stripeData = await stripeRes.json();
        setIsPremium(stripeData.isPremium);
        saveStored('isPremium', stripeData.isPremium);
      } catch {}

      setLoading(false);
    }
    init();
  }, []);

  // ── Persist state to localStorage ──
  useEffect(() => { saveStored('onboarded', onboarded); }, [onboarded]);
  useEffect(() => { saveStored('momProfile', momProfile); }, [momProfile]);
  useEffect(() => { saveStored('messages', messages); }, [messages]);
  useEffect(() => { saveStored('childProfiles', childProfiles); }, [childProfiles]);
  useEffect(() => { saveStored('momWins', momWins); }, [momWins]);
  useEffect(() => { saveStored('isPremium', isPremium); }, [isPremium]);
  useEffect(() => { saveStored('dailyMsgData', { count: dailyMsgCount, date: new Date().toDateString() }); }, [dailyMsgCount]);

  // ── Sync profile changes to Supabase ──
  useEffect(() => {
    if (!user || !momProfile) return;
    supabase.from('profiles').update({
      mom_name: momProfile.momName, mom_age: momProfile.momAge, country: momProfile.country,
      parenting_style: momProfile.parentingStyle, challenges: momProfile.challenges,
      support_system: momProfile.supportSystem, onboarded: true, updated_at: new Date().toISOString(),
    }).eq('id', user.id).then(() => {});
  }, [momProfile]);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').update({ is_premium: isPremium, updated_at: new Date().toISOString() }).eq('id', user.id).then(() => {});
  }, [isPremium]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    ['onboarded','momProfile','messages','childProfiles','momWins','isPremium','dailyMsgData'].forEach(k => {
      localStorage.removeItem('momzveda_' + k);
    });
    router.push('/login');
  };

  // Stripe checkout handler
  const handleUpgrade = async (plan) => {
    try {
      const priceId = plan === 'yearly'
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY;

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, customerEmail: user?.email }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  const handleOnboardingComplete = async (profile) => {
    setMomProfile(profile);
    setChildProfiles(profile.children);
    updateDailyTip(profile.children);
    updateWeeklyTip(profile.children);
    setOnboarded(true);

    // Notify i18n provider of country change
    window.dispatchEvent(new CustomEvent('momzveda:profileUpdate', { detail: { country: profile.country } }));

    // Sync to Supabase
    if (user) {
      await supabase.from('profiles').update({
        mom_name: profile.momName, mom_age: profile.momAge, country: profile.country,
        parenting_style: profile.parentingStyle, challenges: profile.challenges,
        support_system: profile.supportSystem, onboarded: true, updated_at: new Date().toISOString(),
      }).eq('id', user.id);
      const childRows = profile.children.map(c => ({ user_id: user.id, name: c.name, age: c.age, notes: c.notes || '' }));
      if (childRows.length > 0) await supabase.from('children').insert(childRows);
    }
  };

  useEffect(() => {
    const affirmations = getContent('affirmations');
    if (affirmations?.length) setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
    updateDailyTip(childProfiles);
    updateWeeklyTip(childProfiles);

    // Check if returning from Stripe checkout
    const params = new URLSearchParams(window.location.search);
    if (params.get('premium') === 'success') {
      setIsPremium(true);
      setShowUpgrade(false);
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }

    // PWA install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Only hide if already running as installed app
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setShowInstallPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? prev + ' ' + transcript : transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const updateDailyTip = (profiles) => {
    const dailyTipsContent = getContent('dailyTips');
    if (!dailyTipsContent) return;
    const ages = profiles.length > 0 ? profiles.map(c => {
      const a = parseFloat(c.age);
      if (a < 0.25) return 'newborn';
      if (a < 1) return 'infant';
      if (a <= 3) return 'toddler';
      if (a <= 5) return 'preschool';
      if (a <= 12) return 'school-age';
      return 'teen';
    }) : ['toddler'];
    const category = ages[0];
    const tips = dailyTipsContent[category] || dailyTipsContent['toddler'];
    if (tips) setDailyTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  const updateWeeklyTip = (profiles) => {
    const weeklyTipsContent = getContent('weeklyTips');
    if (!weeklyTipsContent) return;
    const ages = profiles.length > 0 ? profiles.map(c => {
      const a = parseFloat(c.age);
      if (a < 0.25) return 'newborn';
      if (a < 1) return 'infant';
      if (a <= 3) return 'toddler';
      if (a <= 5) return 'preschool';
      if (a <= 12) return 'school-age';
      return 'teen';
    }) : ['toddler'];
    const category = ages[0];
    const tips = weeklyTipsContent[category] || weeklyTipsContent['toddler'];
    if (tips) {
      const dayOfWeek = new Date().getDay();
      setWeeklyTip(tips[dayOfWeek % tips.length]);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Check daily message limit for free users
    if (!isPremium && dailyMsgCount >= FREE_MSG_LIMIT) {
      setShowUpgrade(true);
      return;
    }

    setShowWelcome(false);
    setActiveTab('chat');
    const userMsg = { role: 'user', content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);

    // Increment daily message count
    if (!isPremium) {
      const newCount = dailyMsgCount + 1;
      setDailyMsgCount(newCount);
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs, childProfiles, momProfile }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const text2 = data.content?.map(c => c.text || '').join('') || t('chat.errorRetry');
      setMessages(prev => [...prev, { role: 'assistant', content: text2 }]);
      // Sync messages to Supabase
      if (user) {
        supabase.from('messages').insert([
          { user_id: user.id, role: 'user', content: text },
          { user_id: user.id, role: 'assistant', content: text2 },
        ]).then(() => {});
        const today = new Date().toDateString();
        supabase.from('daily_usage').upsert({ user_id: user.id, date: today, msg_count: dailyMsgCount + 1 }, { onConflict: 'user_id,date' }).then(() => {});
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: t('chat.errorGeneral') }]);
    }
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const addChild = async () => {
    if (!newChild.name.trim() || !newChild.age.trim()) return;
    const updated = [...childProfiles, { ...newChild, id: Date.now() }];
    setChildProfiles(updated);
    setNewChild({ name: '', age: '', notes: '' });
    setShowAddChild(false);
    updateDailyTip(updated);
    updateWeeklyTip(updated);
    if (user) {
      supabase.from('children').insert({ user_id: user.id, name: newChild.name, age: newChild.age, notes: newChild.notes || '' }).then(() => {});
    }
  };

  const removeChild = (id) => {
    const updated = childProfiles.filter(c => c.id !== id);
    setChildProfiles(updated);
    updateDailyTip(updated);
    updateWeeklyTip(updated);
    if (user) {
      supabase.from('children').delete().eq('id', id).eq('user_id', user.id).then(() => {});
    }
  };

  const addWin = () => {
    if (!newWin.trim()) return;
    setMomWins(prev => [{ text: newWin, date: new Date().toLocaleDateString(), id: Date.now() }, ...prev]);
    if (user) {
      supabase.from('mom_wins').insert({ user_id: user.id, text: newWin, date: new Date().toLocaleDateString() }).then(() => {});
    }
    setNewWin('');
  };

  const inputStyle = { border: 'none', fontSize: 14, color: TEXT_DARK, background: '#F0FAF4', borderRadius: 12, padding: '10px 14px', width: '100%', fontFamily: "'DM Sans', sans-serif", outline: 'none' };

  // Loading screen while fetching user data
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, color: GREEN }}>Momz</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 28, color: BLUE }}>Veda</span>
          </div>
          <div style={{ fontSize: 14, color: TEXT_LIGHT }}>{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  // Show onboarding if not completed
  if (!onboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Archivo+Black&display=swap');
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 70%{box-shadow:0 0 0 10px rgba(239,68,68,0)} 100%{box-shadow:0 0 0 0 rgba(239,68,68,0)} }
        *{box-sizing:border-box} textarea:focus,input:focus{outline:none}
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:${BORDER};border-radius:3px}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: 'linear-gradient(135deg, #0F1F15, #152B1E)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ width: 140, height: 1.5, background: `linear-gradient(90deg, ${GREEN}, ${BLUE})`, borderRadius: 2, opacity: 0.4, marginBottom: 8 }} />
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, color: GREEN, letterSpacing: 2 }}>Momz</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: 'italic', fontSize: 22, color: BLUE, letterSpacing: 2 }}>Veda</span>
          </div>
          <div style={{ width: 140, height: 1.5, background: `linear-gradient(90deg, ${GREEN}, ${BLUE})`, borderRadius: 2, opacity: 0.4, marginTop: 8 }} />
          <div style={{ marginTop: 4, fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.35)', fontWeight: 500, textTransform: 'uppercase' }}>Your Mom Friend. Always Here.</div>
        </div>
        {/* Logout button */}
        <button onClick={handleLogout} style={{ position: 'absolute', left: 16, top: 16, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '6px 10px', cursor: 'pointer', fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
          {t('common.logout')}
        </button>
        {/* Premium button */}
        {!isPremium && (
          <button onClick={() => setShowUpgrade(true)} style={{ position: 'absolute', right: 16, top: 16, background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', borderRadius: 12, padding: '6px 12px', cursor: 'pointer', fontSize: 11, color: '#FFF', fontWeight: 700, boxShadow: '0 2px 8px rgba(245,158,11,0.3)', animation: 'fadeSlideIn 0.5s ease' }}>
            ✨ Premium
          </button>
        )}
      </div>


      {/* ── INSTALL APP BANNER ── */}
      {showInstallPrompt && (
        <div style={{ background: 'linear-gradient(135deg, #EBF7F0, #D4EDDA)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 26 }}>📱</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK }}>Get the MomzVeda App!</div>
            <div style={{ fontSize: 11, color: TEXT_MID }}>Install for free — faster access, offline support & push notifications</div>
          </div>
          <button onClick={async () => {
            if (deferredPrompt) {
              deferredPrompt.prompt();
              const result = await deferredPrompt.userChoice;
              if (result.outcome === 'accepted') setShowInstallPrompt(false);
              setDeferredPrompt(null);
            } else {
              alert('To install MomzVeda:\\n\\n• iPhone/iPad: Tap the Share button ⬆️ then \"Add to Home Screen\"\\n\\n• Android Chrome: Tap the menu ⋮ then \"Install app\" or \"Add to Home Screen\"\\n\\n• Desktop: Click the install icon in your browser address bar');
            }
          }} style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`, color: '#FFF', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(46,125,50,0.3)' }}>
            Install Free
          </button>
          <button onClick={() => setShowInstallPrompt(false)} style={{ background: 'none', border: 'none', color: TEXT_LIGHT, fontSize: 14, cursor: 'pointer', padding: '0 4px' }} title="Remind me later">✕</button>
        </div>
      )}

      {/* ── PREMIUM SUCCESS BANNER ── */}
      {isPremium && messages.length === 0 && showWelcome && (
        <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #FDE68A' }}>
          <span style={{ fontSize: 20 }}>✨</span>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#92400E' }}>{t('premiumBanner')}</div>
        </div>
      )}

      {/* ── TAB BAR ── */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${BORDER_LIGHT}`, background: CARD_BG }}>
        {[
          { id: 'chat', label: t('tabs.chat') },
          { id: 'journeys', label: isPremium ? t('tabs.guides') : t('tabs.guidesLocked') },
          { id: 'profiles', label: t('tabs.kids') },
          { id: 'wins', label: t('tabs.wins') },
          { id: 'help', label: 'Help' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            background: activeTab === tab.id ? '#EBF7F0' : 'transparent',
            color: activeTab === tab.id ? GREEN_DARK : TEXT_LIGHT,
            borderBottom: activeTab === tab.id ? `2px solid ${GREEN}` : '2px solid transparent',
            transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
          }}>{tab.label}</button>
        ))}
      </div>

      {/* ── CONTENT AREA ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

        {/* CHAT TAB */}
        {activeTab === 'chat' && (<>
          {/* Daily Tip */}
          {dailyTip && (
            <div style={{ background: 'linear-gradient(135deg, #EBF7F0, #E0F0FF)', borderRadius: 16, padding: '14px 16px', marginBottom: 12, fontSize: 14, color: TEXT_DARK, lineHeight: 1.5 }}>
              {dailyTip}
            </div>
          )}
          {/* Weekly Premium Tip */}
          {showWelcome && weeklyTip && (
            isPremium ? (
              <div style={{ background: 'linear-gradient(135deg, #FEF9E7, #FFF7ED)', borderRadius: 16, padding: '14px 16px', marginBottom: 12, border: '1px solid #FDE68A', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -10, right: -10, width: 50, height: 50, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: '#D97706', letterSpacing: '0.05em', marginBottom: 6 }}>🎯 {t('chat.weeklyTipLabel')}</div>
                <div style={{ fontSize: 14, color: TEXT_DARK, lineHeight: 1.5 }}>{weeklyTip}</div>
              </div>
            ) : (
              <div onClick={() => setShowUpgrade(true)} style={{ background: 'linear-gradient(135deg, #F5F5F5, #EBEBEB)', borderRadius: 16, padding: '14px 16px', marginBottom: 12, border: '1px solid #E0E0E0', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                <div style={{ filter: 'blur(4px)', fontSize: 14, color: '#999', lineHeight: 1.5 }}>{t('chat.weeklyTipBlurred')}</div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFF', fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 12, boxShadow: '0 2px 8px rgba(245,158,11,0.3)' }}>🎯 {t('chat.weeklyTipUnlock')}</span>
                </div>
              </div>
            )
          )}
          {/* Affirmation */}
          {affirmation && showWelcome && (
            <div style={{ background: 'linear-gradient(135deg, #E8F7EE, #DCEFFE)', borderRadius: 20, padding: '22px 20px', marginBottom: 16, position: 'relative', overflow: 'hidden', boxShadow: '0 2px 16px rgba(34,197,94,0.08)' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.35)' }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: GREEN_DARK, marginBottom: 6, letterSpacing: '0.05em' }}>✨ {t('chat.todayAffirmation')}</div>
              <div style={{ fontSize: 16, color: TEXT_DARK, lineHeight: 1.6, fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>{affirmation}</div>
              <button onClick={() => { const aff = getContent('affirmations'); if (!aff?.length) return; let n; do { n = aff[Math.floor(Math.random() * aff.length)]; } while (n === affirmation && aff.length > 1); setAffirmation(n); }} style={{ marginTop: 12, background: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 10, padding: '6px 14px', cursor: 'pointer', fontSize: 12, color: GREEN_DARK, fontWeight: 600 }}>{t('chat.newAffirmation')}</button>
            </div>
          )}
          {/* Welcome */}
          {showWelcome && messages.length === 0 && (
            <div style={{ animation: 'fadeSlideIn 0.5s ease-out' }}>
              <div style={{ textAlign: 'center', padding: '8px 0 20px', color: TEXT_MID, fontSize: 14, lineHeight: 1.6 }}>
                {t('chat.welcomeGreeting', { name: momProfile?.momName || 'mama' })}<br />
                {momProfile?.children?.length > 0 && (
                  <span style={{ fontSize: 13, color: GREEN_DARK, fontWeight: 600 }}>
                    {t('chat.welcomeKidsIntro', { kids: momProfile.children.map(c => c.name).join(' & ') })}<br />
                  </span>
                )}
                <span style={{ fontSize: 12, color: TEXT_LIGHT }}>{t('chat.tapPrompt')}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {(getContent('quickTopics') || []).map((qt, i) => (
                  <button key={i} onClick={() => sendMessage(qt.prompt)} style={{ background: CARD_BG, border: `1.5px solid ${BORDER}`, borderRadius: 14, padding: '12px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.03)', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <span style={{ fontSize: 20 }}>{qt.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_DARK }}>{qt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => <MessageBubble key={i} message={m.content} isUser={m.role === 'user'} />)}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </>)}

        {/* GUIDED JOURNEYS TAB */}
        {activeTab === 'journeys' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK }}>{t('journeys.title')}</div>
              {!isPremium && <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706', background: '#FEF3C7', padding: '3px 10px', borderRadius: 8 }}>{t('journeys.premium')}</span>}
            </div>
            <div style={{ fontSize: 13, color: TEXT_LIGHT, marginBottom: 16 }}>{t('journeys.subtitle')}</div>

            {isPremium ? (
              <div style={{ display: 'grid', gap: 10 }}>
                {(getContent('guidedJourneys') || []).map((j, i) => (
                  <button key={i} onClick={() => sendMessage(j.prompt)} style={{ background: CARD_BG, border: `1.5px solid ${BORDER}`, borderRadius: 16, padding: '16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.boxShadow = '0 4px 12px rgba(34,197,94,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <span style={{ fontSize: 28 }}>{j.emoji}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>{j.title}</div>
                      <div style={{ fontSize: 12, color: TEXT_LIGHT }}>{j.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                {/* Show journeys but locked */}
                <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
                  {(getContent('guidedJourneys') || []).map((j, i) => (
                    <div key={i} onClick={() => setShowUpgrade(true)} style={{ background: CARD_BG, border: `1.5px solid ${BORDER}`, borderRadius: 16, padding: '16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, fontFamily: "'DM Sans', sans-serif", opacity: 0.6, position: 'relative' }}>
                      <span style={{ fontSize: 28 }}>{j.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>{j.title}</div>
                        <div style={{ fontSize: 12, color: TEXT_LIGHT }}>{j.desc}</div>
                      </div>
                      <span style={{ fontSize: 18 }}>🔒</span>
                    </div>
                  ))}
                </div>

                {/* Upgrade CTA */}
                <div style={{ background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)', borderRadius: 20, padding: '24px 20px', textAlign: 'center', border: '1.5px solid #FDE68A' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#92400E', marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>{t('journeys.unlockTitle')}</div>
                  <p style={{ fontSize: 14, color: '#B45309', lineHeight: 1.6, marginBottom: 12 }}>
                    {t('journeys.unlockDesc')}
                  </p>
                  <button onClick={() => setShowUpgrade(true)} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFF', border: 'none', borderRadius: 14, padding: '14px 28px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}>
                    {t('journeys.upgradeButton')}
                  </button>
                  <div style={{ fontSize: 12, color: '#B45309', marginTop: 8 }}>{t('journeys.priceNote')}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHILD PROFILES TAB */}
        {activeTab === 'profiles' && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, marginBottom: 4 }}>{t('kids.title')}</div>
            <div style={{ fontSize: 13, color: TEXT_LIGHT, marginBottom: 16 }}>{t('kids.subtitle')}</div>
            {childProfiles.map(c => (
              <div key={c.id} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: TEXT_MID }}>{t('kids.ageLabel', { age: c.age })} {c.notes && `· ${c.notes}`}</div>
                </div>
                <button onClick={() => removeChild(c.id)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontSize: 12, color: '#DC2626', fontWeight: 600 }}>{t('common.remove')}</button>
              </div>
            ))}
            {showAddChild ? (
              <div style={{ background: CARD_BG, border: `1.5px solid ${GREEN}`, borderRadius: 16, padding: '16px', marginTop: 8 }}>
                <input value={newChild.name} onChange={e => setNewChild({ ...newChild, name: e.target.value })} placeholder={t('kids.namePlaceholder')} style={{ ...inputStyle, marginBottom: 8 }} />
                <input value={newChild.age} onChange={e => setNewChild({ ...newChild, age: e.target.value })} placeholder={t('kids.agePlaceholder')} style={{ ...inputStyle, marginBottom: 8 }} />
                <input value={newChild.notes} onChange={e => setNewChild({ ...newChild, notes: e.target.value })} placeholder={t('kids.notesPlaceholder')} style={{ ...inputStyle, marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={addChild} style={{ flex: 1, background: GREEN, color: '#FFF', border: 'none', borderRadius: 12, padding: '10px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>{t('kids.addButton')}</button>
                  <button onClick={() => setShowAddChild(false)} style={{ background: '#F5F0EB', border: 'none', borderRadius: 12, padding: '10px 16px', cursor: 'pointer', fontSize: 13, color: TEXT_MID }}>{t('common.cancel')}</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddChild(true)} style={{ width: '100%', background: '#EBF7F0', border: `1.5px dashed ${GREEN}`, borderRadius: 16, padding: '14px', cursor: 'pointer', fontSize: 14, color: GREEN_DARK, fontWeight: 600, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
                {t('kids.addChild')}
              </button>
            )}
          </div>
        )}

        {/* MOM WINS TAB */}
        {activeTab === 'wins' && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, marginBottom: 4 }}>{t('wins.title')}</div>
            <div style={{ fontSize: 13, color: TEXT_LIGHT, marginBottom: 16 }}>{t('wins.subtitle')}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input value={newWin} onChange={e => setNewWin(e.target.value)} onKeyDown={e => e.key === 'Enter' && addWin()} placeholder={t('wins.placeholder')} style={{ ...inputStyle, flex: 1 }} />
              <button onClick={addWin} disabled={!newWin.trim()} style={{ background: newWin.trim() ? GREEN : '#D5E8DC', color: '#FFF', border: 'none', borderRadius: 12, padding: '10px 18px', cursor: newWin.trim() ? 'pointer' : 'default', fontWeight: 600, fontSize: 14, transition: 'all 0.2s' }}>+</button>
            </div>
            {momWins.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: TEXT_LIGHT, fontSize: 14, lineHeight: 1.6 }}>
                {t('wins.emptyTitle')}<br />
                <span style={{ fontSize: 12 }}>{t('wins.emptyHint')}</span>
              </div>
            ) : (
              momWins.map(w => (
                <div key={w.id} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, color: TEXT_DARK, fontWeight: 500 }}>🌟 {w.text}</div>
                    <div style={{ fontSize: 11, color: TEXT_LIGHT, marginTop: 2 }}>{w.date}</div>
                  </div>
                  <button onClick={() => { setMomWins(prev => prev.filter(x => x.id !== w.id)); if (user) supabase.from('mom_wins').delete().eq('id', w.id).eq('user_id', user.id).then(() => {}); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: TEXT_LIGHT }}>✕</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* HELP TAB */}
        {activeTab === 'help' && (
          <div>
            {/* Contact Section */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, marginBottom: 4 }}>Contact Us</div>
              <div style={{ fontSize: 13, color: TEXT_LIGHT, marginBottom: 16 }}>Have a question, suggestion, or just want to say hi? We would love to hear from you.</div>
              <a href="mailto:info@momzveda.com" style={{ display: 'inline-block', background: GREEN, color: '#FFFFFF', padding: '12px 32px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>
                Email Us
              </a>
              <div style={{ fontSize: 12, color: TEXT_LIGHT, marginTop: 8 }}>info@momzveda.com</div>
            </div>

            {/* FAQ Section */}
            <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, marginBottom: 16 }}>Frequently Asked Questions</div>

            {[
              { q: 'What is MomzVeda?', a: 'MomzVeda is your AI-powered mom friend — a chat companion that provides parenting tips, emotional support, daily affirmations, and quick recipes. Think of it as having a supportive friend who is always available, never judges, and actually understands what you are going through.' },
              { q: 'Is MomzVeda free?', a: 'Yes! You can use MomzVeda for free with 5 messages per day. This gives you access to the chat, daily tips, and affirmations. If you want unlimited messages, voice input, guided journeys, and personalized weekly tips, you can upgrade to Premium.' },
              { q: 'How much does Premium cost?', a: 'Premium is available for \u20ac6.99 per month or \u20ac69.99 per year (save 17%). You can cancel anytime.' },
              { q: 'How does the AI work?', a: 'MomzVeda uses advanced AI to have warm, supportive conversations with you. It is personalized to your parenting style, your children\'s ages, and your unique situation. The more you chat, the better it understands your needs.' },
              { q: 'Is my data private?', a: 'Absolutely. Your conversations are private and encrypted. We never share your personal data with third parties. You can read our full privacy policy at momzveda.com/privacy.' },
              { q: 'Who is MomzVeda for?', a: 'MomzVeda is for every mom — first-time moms, experienced parents, working moms, stay-at-home moms, single moms, and everyone in between. Whether your child is a newborn or a teenager, MomzVeda adapts to your stage of parenthood.' },
              { q: 'Can I use MomzVeda in my language?', a: 'Yes! MomzVeda is available in 10+ languages including English, Dutch, German, French, Spanish, Italian, Portuguese, Turkish, Arabic, Japanese, and Korean. It automatically detects your language based on your profile.' },
              { q: 'Is MomzVeda a replacement for professional help?', a: 'No. MomzVeda is a supportive daily companion, not a substitute for medical advice, therapy, or professional help. If you are experiencing a mental health crisis, please reach out to a healthcare professional.' },
            ].map((faq, i) => (
              <details key={i} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px', marginBottom: 8, cursor: 'pointer' }}>
                <summary style={{ fontSize: 14, fontWeight: 600, color: TEXT_DARK, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {faq.q}
                  <span style={{ color: GREEN, fontSize: 18, fontWeight: 300 }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: TEXT_MID, lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>{faq.a}</p>
              </details>
            ))}

            {/* Blog Link */}
            <div style={{ textAlign: 'center', marginTop: 24, padding: 20, background: '#EBF7F0', borderRadius: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_DARK, marginBottom: 8 }}>Looking for parenting tips?</div>
              <a href="/blog" style={{ color: GREEN, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                Visit our Blog &rarr;
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ── QUICK TOPICS (mid-chat) ── */}
      {activeTab === 'chat' && !showWelcome && !isTyping && (
        <div style={{ padding: '6px 16px', overflowX: 'auto', display: 'flex', gap: 6, borderTop: `1px solid ${BORDER_LIGHT}` }}>
          {(getContent('quickTopics') || []).slice(0, 5).map((qt, i) => (
            <button key={i} onClick={() => sendMessage(qt.prompt)} style={{ background: '#EBF7F0', border: `1px solid ${BORDER}`, borderRadius: 20, padding: '5px 12px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 12, color: TEXT_MID, fontWeight: 500, transition: 'all 0.2s', flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={e => { e.target.style.background = '#D5F0DC'; e.target.style.borderColor = GREEN; }}
              onMouseLeave={e => { e.target.style.background = '#EBF7F0'; e.target.style.borderColor = BORDER; }}
            >{qt.emoji} {qt.label}</button>
          ))}
        </div>
      )}

      {/* ── INPUT ── */}
      {activeTab === 'chat' && (
        <div style={{ padding: '10px 16px 18px', background: BG, borderTop: `1px solid ${BORDER_LIGHT}` }}>
          {/* Message counter for free users */}
          {!isPremium && (
            <div style={{ textAlign: 'center', marginBottom: 6 }}>
              {dailyMsgCount < FREE_MSG_LIMIT ? (
                <span style={{ fontSize: 11, color: dailyMsgCount >= 4 ? '#D97706' : TEXT_LIGHT }}>
                  {tp('chat.freeMessagesLeft', FREE_MSG_LIMIT - dailyMsgCount)}
                  {dailyMsgCount >= 4 && ' ⚡'}
                </span>
              ) : (
                <button onClick={() => setShowUpgrade(true)} style={{ fontSize: 11, color: '#D97706', fontWeight: 700, background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 8, padding: '3px 12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  {t('chat.limitReached')}
                </button>
              )}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, background: CARD_BG, borderRadius: 24, border: `2px solid ${BORDER}`, padding: '6px 6px 6px 16px', transition: 'border-color 0.2s', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            onFocus={e => e.currentTarget.style.borderColor = GREEN}
            onBlur={e => e.currentTarget.style.borderColor = BORDER}
          >
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder={!isPremium && dailyMsgCount >= FREE_MSG_LIMIT ? t('chat.inputPlaceholderLimited') : t('chat.inputPlaceholder', { name: momProfile?.momName || 'mama' })} rows={1}
              disabled={!isPremium && dailyMsgCount >= FREE_MSG_LIMIT}
              style={{ flex: 1, border: 'none', resize: 'none', fontSize: 15, color: TEXT_DARK, background: 'transparent', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, padding: '6px 0', maxHeight: 80, overflowY: 'auto', opacity: (!isPremium && dailyMsgCount >= FREE_MSG_LIMIT) ? 0.5 : 1 }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'; }}
            />
            {/* Voice button */}
            {speechSupported && (
              <button onClick={() => {
                if (!isPremium) { setShowUpgrade(true); return; }
                if (isRecording) {
                  recognitionRef.current?.stop();
                  setIsRecording(false);
                } else {
                  try {
                    const langMap = { en: 'en-US', nl: 'nl-NL', de: 'de-DE', fr: 'fr-FR', es: 'es-ES', it: 'it-IT', pt: 'pt-PT', tr: 'tr-TR', ar: 'ar-SA', ja: 'ja-JP', ko: 'ko-KR' };
                    recognitionRef.current.lang = langMap[lang] || 'en-US';
                    recognitionRef.current.start();
                    setIsRecording(true);
                  } catch { setIsRecording(false); }
                }
              }}
                style={{ width: 36, height: 36, borderRadius: '50%', background: isRecording ? '#EF4444' : (isPremium ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.05)'), border: isRecording ? '2px solid #EF4444' : `1px solid ${isPremium ? BORDER : '#E0E0E0'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0, animation: isRecording ? 'pulse 1.5s infinite' : 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isRecording ? '#FFF' : (isPremium ? GREEN_DARK : '#999')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
            )}
            {/* Send button */}
            <button onClick={() => (!isPremium && dailyMsgCount >= FREE_MSG_LIMIT) ? setShowUpgrade(true) : sendMessage(input)} disabled={(!isPremium && dailyMsgCount >= FREE_MSG_LIMIT) ? false : (!input.trim() || isTyping)}
              style={{ width: 40, height: 40, borderRadius: '50%', background: (!isPremium && dailyMsgCount >= FREE_MSG_LIMIT) ? 'linear-gradient(135deg, #F59E0B, #D97706)' : (input.trim() && !isTyping ? `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})` : '#D5E8DC'), border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
              {(!isPremium && dailyMsgCount >= FREE_MSG_LIMIT) ? (
                <span style={{ color: '#FFF', fontSize: 16 }}>✨</span>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !isTyping ? '#FFF' : TEXT_LIGHT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── UPGRADE MODAL ── */}
      {showUpgrade && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowUpgrade(false); }}>
          <div style={{ background: '#FFF', borderRadius: 24, padding: '32px 24px', maxWidth: 380, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'fadeSlideIn 0.3s ease' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: TEXT_DARK, marginBottom: 4, fontFamily: "'Playfair Display', serif" }}>
                {t('upgrade.title')}
              </h2>
              <div style={{ fontSize: 15, fontWeight: 700, color: GREEN_DARK, marginBottom: 6 }}>{t('upgrade.cancelAnytime')}</div>
              <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 24 }}>
                {t('upgrade.subtitle')}
              </p>

              {/* Features */}
              <div style={{ textAlign: 'left', marginBottom: 24 }}>
                {[
                  { emoji: '💬', text: t('upgrade.unlimitedMessages') },
                  { emoji: '🗺️', text: t('upgrade.fullJourneys') },
                  { emoji: '⚡', text: t('upgrade.prioritySpeed') },
                  { emoji: '🎯', text: t('upgrade.weeklyTips') },
                  { emoji: '🎙️', text: t('upgrade.voiceMessages') },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 4 ? `1px solid ${BORDER_LIGHT}` : 'none' }}>
                    <span style={{ fontSize: 20 }}>{f.emoji}</span>
                    <span style={{ fontSize: 14, color: TEXT_DARK, fontWeight: 500 }}>{f.text}</span>
                    <span style={{ marginLeft: 'auto', color: GREEN, fontWeight: 700, fontSize: 14 }}>✓</span>
                  </div>
                ))}
              </div>

              {/* Pricing buttons */}
              <button onClick={() => handleUpgrade('monthly')} style={{
                width: '100%', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFF', border: 'none',
                borderRadius: 16, padding: '16px', fontSize: 17, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 20px rgba(245,158,11,0.3)', marginBottom: 10,
              }}>
                {t('upgrade.monthly')}
              </button>
              <button onClick={() => handleUpgrade('yearly')} style={{
                width: '100%', background: '#FFF7ED', color: '#92400E', border: '2px solid #FDE68A',
                borderRadius: 16, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", marginBottom: 16,
              }}>
                {t('upgrade.yearly')} <span style={{ fontSize: 12, fontWeight: 500, color: '#B45309' }}>{t('upgrade.yearlySave')}</span>
              </button>

              <button onClick={() => setShowUpgrade(false)} style={{
                background: 'none', border: 'none', color: TEXT_LIGHT, fontSize: 14, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", padding: '8px',
              }}>
                {t('upgrade.maybeLater')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
