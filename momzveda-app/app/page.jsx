'use client';

import { useState, useEffect, useRef } from 'react';

// ── CONSTANTS ──
const GREEN = '#22C55E', GREEN_DARK = '#16A34A', BLUE = '#3B82F6', BG = '#F2F8F5';
const CARD_BG = '#FFFFFF', TEXT_DARK = '#1A2E23', TEXT_MID = '#3D6B50', TEXT_LIGHT = '#6B9A7E';
const BORDER = '#D5E8DC', BORDER_LIGHT = '#E8F2EC';

const AFFIRMATIONS = [
  "You're doing an amazing job, even on the hard days. 💛",
  "It's okay to not have all the answers. You're learning alongside your little ones.",
  "Taking a moment for yourself isn't selfish — it's necessary. You matter too.",
  "Your kids don't need a perfect mom. They need a happy one.",
  "Every small act of love you give is building something beautiful.",
  "You are exactly the mom your children need.",
  "Breathe. You've survived 100% of your hardest days so far.",
  "It's okay to ask for help. Strong moms know when to lean on others.",
  "Your patience today is shaping who they become tomorrow.",
  "Some days you're the superhero. Some days you're surviving. Both count.",
  "You don't have to enjoy every moment to be a great mom.",
  "The laundry can wait. The dishes can wait. Your mental health can't.",
  "Trust your instincts. Nobody knows your child like you do.",
  "You are more than 'just a mom.' You are everything to someone.",
  "Your child isn't giving you a hard time — they're having a hard time.",
];

const DAILY_TIPS = {
  "newborn": [
    "💡 Skin-to-skin contact isn't just for the first day — it helps regulate your baby's temperature, heart rate, and stress hormones for months.",
    "💡 Your newborn can only see 8-12 inches clearly — that's exactly the distance to your face while feeding. Nature is amazing!",
    "💡 It's okay if your house is messy. Your only job right now is to rest, feed, and bond. Everything else can wait.",
  ],
  "infant": [
    "💡 Babies don't need fancy toys. A wooden spoon, a cardboard box, and your face are the best entertainment at this age.",
    "💡 Starting solids? Follow your baby's lead. Let them explore textures and tastes without pressure to eat a certain amount.",
    "💡 When your baby is struggling to reach a toy, wait before helping. Those moments of effort are building their brain!",
  ],
  "toddler": [
    "💡 When your toddler says 'NO!' to everything — that's actually healthy! They're developing autonomy. Try offering two choices instead of yes/no questions.",
    "💡 Tantrums aren't manipulation. Your toddler's brain literally can't regulate big emotions yet. Your calm presence is what teaches them how.",
    "💡 Instead of 'good job!' try 'You did it! You put your shoes on all by yourself!' Specific praise builds real confidence.",
  ],
  "preschool": [
    "💡 'I'm bored' is actually the doorway to creativity. Resist the urge to fix it — give them space and watch the magic happen.",
    "💡 When your preschooler tells a wild, impossible story, go with it! Imagination at this age is building critical thinking skills for later.",
    "💡 Help your child name their emotions: 'It looks like you're feeling frustrated.' This simple act literally helps their brain develop emotional regulation.",
  ],
  "school-age": [
    "💡 Homework battles? Sit nearby doing your own 'work' (reading, writing). Kids this age learn focus by watching you model it.",
    "💡 When your child says 'nobody likes me,' resist the urge to fix it. Say: 'That sounds really hard. Tell me more.' Listening IS helping.",
    "💡 Family dinners (even 3x a week) are one of the strongest predictors of a child's emotional wellbeing. It's not about the food — it's about connection.",
  ],
  "teen": [
    "💡 When your teen pushes you away, they still need you — just differently. Stay available without being intrusive. Think 'lighthouse, not helicopter.'",
    "💡 Their brain is literally rewiring right now. Mood swings, risk-taking, and big emotions are neurological, not personal attacks on you.",
    "💡 Ask 'What was the best part of your day?' instead of 'How was school?' Open-ended questions get real answers.",
  ],
};

// ── QUICK TOPICS (fixed set for all moms) ──
const QUICK_TOPICS = [
  { emoji: '😰', label: "I'm overwhelmed", prompt: "I'm feeling really anxious and overwhelmed today. Everything feels like too much. I just need someone to talk to who understands." },
  { emoji: '💪', label: 'I need a pep talk', prompt: "I'm having a rough day and I just need someone to remind me that I'm doing okay. Can you give me a pep talk?" },
  { emoji: '😴', label: 'Sleep help', prompt: "I'm struggling with sleep — either my kid's sleep or my own. Any tips for better bedtime routines and actually getting rest?" },
  { emoji: '😤', label: 'Tantrums & big emotions', prompt: "My kid is having big emotions and meltdowns. How do I handle tantrums calmly without losing my own cool?" },
  { emoji: '🍳', label: 'Quick dinner idea', prompt: "It's almost dinner time and I have no plan. Give me one quick, easy, kid-friendly recipe I can make in under 30 minutes with common ingredients." },
  { emoji: '💔', label: 'Mom guilt', prompt: "I'm struggling with mom guilt today. I feel like I'm not doing enough or not doing it right. Can you help me get some perspective?" },
  { emoji: '🧘‍♀️', label: 'Self-care ideas', prompt: "I need realistic self-care ideas for a busy mom. I have almost no time but I'm running on empty. What can I actually do?" },
  { emoji: '🎉', label: 'Fun activity ideas', prompt: "I need fun activity ideas for today with my kids. Indoor or outdoor, easy to set up, no special supplies needed. What should we do?" },
];


const GUIDED_JOURNEYS = [
  { emoji: '🏠', title: 'First Week Home', desc: 'Navigate the newborn days', prompt: "I just brought my baby home from the hospital. Can you walk me through what to expect in the first week? What are the most important things I should focus on? I'm feeling nervous and excited." },
  { emoji: '🥄', title: 'Starting Solids', desc: 'When and how to begin', prompt: "I think my baby is ready to start solids. Can you guide me through how to begin? What signs should I look for, what foods to start with, and how to make it a positive experience?" },
  { emoji: '😤', title: 'Taming Tantrums', desc: 'Understand the meltdowns', prompt: "My toddler's tantrums are really intense and happening more often. Can you help me understand what's going on developmentally and walk me through how to handle them without losing my own cool?" },
  { emoji: '🌙', title: 'Bedtime Battles', desc: 'Peaceful sleep routines', prompt: "Bedtime is a battle every single night. Can you walk me through creating a peaceful bedtime routine that actually works? I need a step-by-step approach." },
  { emoji: '🎒', title: 'School Ready', desc: 'Prep for the big day', prompt: "My child is starting school soon and I want to make sure they're ready — not just academically but emotionally and socially. What should I focus on?" },
  { emoji: '📱', title: 'Screen Time Balance', desc: 'Healthy digital habits', prompt: "I'm struggling with managing screen time for my kids. How do I find a healthy balance without it turning into a daily fight?" },
];

const EMERGENCY_RESOURCES = [
  { name: 'Suicide & Crisis Lifeline', number: '988', desc: 'Call or text' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', desc: '' },
  { name: 'Postpartum Support Intl', number: '1-800-944-4773', desc: 'Call or text' },
  { name: 'Domestic Violence Hotline', number: '1-800-799-7233', desc: 'Call or text START to 88788' },
  { name: 'Childhelp Abuse Hotline', number: '1-800-422-4453', desc: '24/7' },
  { name: 'Parent Helpline', number: '1-855-427-2736', desc: 'Emotional support' },
  { name: 'Poison Control', number: '1-800-222-1222', desc: '24/7' },
];

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
          <div style={{ fontSize: 11, color: TEXT_LIGHT, marginTop: 5, textAlign: 'center' }}>Step {step} of {totalSteps - 1}</div>
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
              <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>Welcome, Mama!</h2>
              <p style={{ fontSize: 15, color: TEXT_MID, lineHeight: 1.7, marginBottom: 0 }}>
                Let's set up your space so I can be the best mom friend for you. It only takes a minute — and everything stays private.
              </p>
            </div>
            <button onClick={goNext} style={{ ...btnPrimary, width: '100%', padding: '16px', fontSize: 17 }}>
              Let's Get Started →
            </button>
          </div>
        )}

        {/* ════════ STEP 1: ABOUT YOU (Name + Age + Country) ════════ */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 36, marginBottom: 8 }}>👋</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>Tell me about you</h2>
            <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 20 }}>So our chats feel personal and I can give you relevant tips.</p>

            {/* Name */}
            <label style={sectionLabel}>Your first name</label>
            <input type="text" value={momName} onChange={e => setMomName(e.target.value)}
              placeholder="What should I call you?" style={{ ...inputStyle, marginBottom: 16 }} autoFocus />

            {/* Age Range */}
            <label style={sectionLabel}>Your age range</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
              {AGE_RANGES.map(r => (
                <button key={r} onClick={() => setMomAge(r)} style={chipSelected(momAge === r)}>{r}</button>
              ))}
            </div>

            {/* Country */}
            <label style={sectionLabel}>Where do you live?</label>
            <input type="text" value={countrySearch}
              onChange={e => { setCountrySearch(e.target.value); setCountry(''); setShowCountryList(true); }}
              onFocus={() => setShowCountryList(true)}
              placeholder="Search your country..." style={inputStyle} />
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
            <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>Tell me about your little ones!</h2>
            <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 16 }}>Add each child's name and age so I can give personalized, age-specific tips and call them by name.</p>

            {children.map((child, i) => (
              <div key={child.id} style={{
                background: CARD_BG, borderRadius: 14, padding: 14, marginBottom: 10,
                border: `1px solid ${BORDER_LIGHT}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: GREEN_DARK }}>👧 Child {i + 1}</span>
                  {children.length > 1 && (
                    <button onClick={() => removeChild(child.id)} style={{
                      background: 'none', border: 'none', color: '#EF4444', fontSize: 12,
                      cursor: 'pointer', fontWeight: 600, padding: '2px 6px',
                    }}>✕ Remove</button>
                  )}
                </div>
                <input type="text" value={child.name} onChange={e => updateChild(child.id, 'name', e.target.value)}
                  placeholder="Child's name (or nickname)"
                  style={{ ...inputStyle, fontSize: 14, padding: '10px 14px', marginBottom: 8 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" value={child.age} onChange={e => updateChild(child.id, 'age', e.target.value)}
                    placeholder="Age (e.g. 2, 0.5)"
                    style={{ ...inputStyle, fontSize: 14, padding: '10px 14px', flex: 1 }} />
                  <select value={child.age} onChange={e => updateChild(child.id, 'age', e.target.value)}
                    style={{ ...inputStyle, fontSize: 12, padding: '10px 8px', flex: 1, appearance: 'auto', cursor: 'pointer' }}>
                    <option value="">Or pick...</option>
                    <option value="0.08">Newborn (0-3 mo)</option>
                    <option value="0.5">Baby (3-12 mo)</option>
                    <option value="1.5">Toddler (1-2 yr)</option>
                    <option value="3">Preschool (3-5 yr)</option>
                    <option value="8">School-age (6-12)</option>
                    <option value="14">Teen (13-17)</option>
                    <option value="expecting">Expecting!</option>
                  </select>
                </div>
              </div>
            ))}

            <button onClick={addChild} style={{
              width: '100%', background: '#F0FAF4', border: `1.5px dashed ${GREEN}`,
              borderRadius: 12, padding: '10px', fontSize: 14, color: GREEN_DARK,
              fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>+ Add Another Child</button>
            <p style={{ fontSize: 11, color: TEXT_LIGHT, marginTop: 6, textAlign: 'center' }}>
              Expecting? Type "expecting" as age. You can always update later in the Kids tab!
            </p>
          </div>
        )}

        {/* ════════ STEP 3: PARENTING STYLE + CHALLENGES + SUPPORT ════════ */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🌱</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>Your parenting journey</h2>
            <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 18 }}>Help me understand your style so I can match your vibe.</p>

            {/* Parenting Style */}
            <label style={sectionLabel}>What feels right to you?</label>
            <div style={{ display: 'grid', gap: 8, marginBottom: 18 }}>
              {[
                { id: 'gentle', emoji: '💚', title: 'Gentle & Conscious', desc: 'Connection over control' },
                { id: 'structured', emoji: '📋', title: 'Structured & Routine', desc: 'Clear boundaries & consistency' },
                { id: 'balanced', emoji: '⚖️', title: 'Balanced Mix', desc: 'Structure with flexibility' },
                { id: 'instinctive', emoji: '✨', title: 'Go With the Flow', desc: 'Trust my instincts' },
                { id: 'figuring-out', emoji: '🤷‍♀️', title: 'Still Figuring It Out', desc: "Learning as I go!" },
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
            <label style={sectionLabel}>What's hardest right now? <span style={{ fontWeight: 400, color: TEXT_LIGHT }}>(pick up to 4)</span></label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 4 }}>
              {[
                { id: 'sleep', emoji: '😴', label: 'Sleep' },
                { id: 'tantrums', emoji: '😤', label: 'Tantrums' },
                { id: 'feeding', emoji: '🥦', label: 'Feeding' },
                { id: 'guilt', emoji: '💔', label: 'Mom guilt' },
                { id: 'work-life', emoji: '⏰', label: 'Work-life' },
                { id: 'loneliness', emoji: '🫂', label: 'Loneliness' },
                { id: 'anxiety', emoji: '😰', label: 'Anxiety' },
                { id: 'partner', emoji: '💬', label: 'Partner' },
                { id: 'screen-time', emoji: '📱', label: 'Screen time' },
                { id: 'milestones', emoji: '📈', label: 'Dev worries' },
                { id: 'discipline', emoji: '🚦', label: 'Boundaries' },
                { id: 'self-care', emoji: '🧘‍♀️', label: 'Me-time' },
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
            <p style={{ fontSize: 11, color: TEXT_LIGHT, marginBottom: 18, textAlign: 'center' }}>{challenges.length}/4 selected</p>

            {/* Support System */}
            <label style={sectionLabel}>What does your support look like?</label>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { id: 'partner-home', emoji: '👫', title: 'Partner at home' },
                { id: 'partner-busy', emoji: '💼', title: 'Partner, but often busy' },
                { id: 'family-nearby', emoji: '👨‍👩‍👧', title: 'Family nearby' },
                { id: 'family-far', emoji: '🌍', title: 'Family far away' },
                { id: 'solo', emoji: '💪', title: 'Solo parent' },
                { id: 'community', emoji: '👩‍👩‍👦', title: 'Friends / community' },
                { id: 'mixed', emoji: '🧩', title: 'A mix / it varies' },
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
            <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>Almost there!</h2>
            <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 16 }}>Please review and accept our terms before we start.</p>

            <div style={{
              background: CARD_BG, borderRadius: 14, padding: 18, marginBottom: 14,
              border: `1px solid ${BORDER_LIGHT}`, maxHeight: 180, overflowY: 'auto',
              fontSize: 13, color: TEXT_MID, lineHeight: 1.7,
            }}>
              <p style={{ fontWeight: 700, marginBottom: 8, color: TEXT_DARK }}>Key Points:</p>
              <p style={{ marginBottom: 8 }}><strong>General Tips Only:</strong> All parenting tips, recipes, and guidance are general in nature. They are NOT tailored to your specific child or situation.</p>
              <p style={{ marginBottom: 8 }}><strong>Not Medical or Professional Advice:</strong> MomzVeda is powered by AI and does NOT provide medical, psychological, or any other professional advice. Always consult a qualified professional.</p>
              <p style={{ marginBottom: 8 }}><strong>No Liability:</strong> MomzVeda is NOT responsible or liable — directly or indirectly — for any harm, injury, loss, or damage of any kind to you, your children, your family members, or any other person in any shape or form.</p>
              <p style={{ marginBottom: 8 }}><strong>Your Responsibility:</strong> You are solely responsible for all parenting decisions. You use this service entirely at your own risk.</p>
              <p style={{ marginBottom: 8 }}><strong>Emergency:</strong> MomzVeda is NOT an emergency service. In case of emergency, call 911 or your local emergency number.</p>
              <p style={{ marginBottom: 0 }}><strong>Privacy:</strong> Your data stays private. Chat messages are processed by AI but not permanently stored.</p>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <a href="/terms" target="_blank" style={{
                flex: 1, textAlign: 'center', padding: '9px', borderRadius: 10,
                background: '#F0FAF4', color: GREEN_DARK, fontSize: 13, fontWeight: 600,
                textDecoration: 'none', border: `1px solid ${BORDER}`,
              }}>📄 Full Terms</a>
              <a href="/privacy" target="_blank" style={{
                flex: 1, textAlign: 'center', padding: '9px', borderRadius: 10,
                background: '#EFF6FF', color: '#2563EB', fontSize: 13, fontWeight: 600,
                textDecoration: 'none', border: '1px solid #BFDBFE',
              }}>🔒 Privacy Policy</a>
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
                <span style={{ fontSize: 13, color: TEXT_DARK, lineHeight: 1.5 }}>
                  I understand that MomzVeda provides <strong>general tips only</strong> and is <strong>not responsible for any harm</strong> — direct or indirect — to myself, my children, or anyone else. I accept the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
                </span>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {step > 0 && (
        <div style={{ padding: '12px 24px 24px', display: 'flex', gap: 12, maxWidth: 480, width: '100%', margin: '0 auto' }}>
          <button onClick={goBack} style={btnSecondary}>← Back</button>
          <button onClick={step === 4 ? finish : goNext} style={{ ...btnPrimary, flex: 1 }}>
            {step === 4 ? "🎉 Let's Go!" : 'Continue →'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──
export default function Home() {
  const [onboarded, setOnboarded] = useState(false);
  const [momProfile, setMomProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [childProfiles, setChildProfiles] = useState([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChild, setNewChild] = useState({ name: '', age: '', notes: '' });
  const [momWins, setMomWins] = useState([]);
  const [newWin, setNewWin] = useState('');
  const [showEmergency, setShowEmergency] = useState(false);
  const [dailyTip, setDailyTip] = useState('');
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [dailyMsgCount, setDailyMsgCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const FREE_MSG_LIMIT = 5;
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Stripe checkout handler
  const handleUpgrade = async (plan) => {
    try {
      const priceId = plan === 'yearly'
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY;

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  const handleOnboardingComplete = (profile) => {
    setMomProfile(profile);
    setChildProfiles(profile.children);
    updateDailyTip(profile.children);
    setOnboarded(true);
  };

  useEffect(() => {
    setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
    updateDailyTip([]);

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

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Show onboarding if not completed
  if (!onboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const updateDailyTip = (profiles) => {
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
    const tips = DAILY_TIPS[category] || DAILY_TIPS['toddler'];
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);
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
      const text2 = data.content?.map(c => c.text || '').join('') || "Hmm, let me try that again 💛";
      setMessages(prev => [...prev, { role: 'assistant', content: text2 }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Something went sideways! 😅 Try again in a sec. I'm here for you! 💛" }]);
    }
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const addChild = () => {
    if (!newChild.name.trim() || !newChild.age.trim()) return;
    const updated = [...childProfiles, { ...newChild, id: Date.now() }];
    setChildProfiles(updated);
    setNewChild({ name: '', age: '', notes: '' });
    setShowAddChild(false);
    updateDailyTip(updated);
  };

  const removeChild = (id) => {
    const updated = childProfiles.filter(c => c.id !== id);
    setChildProfiles(updated);
    updateDailyTip(updated);
  };

  const addWin = () => {
    if (!newWin.trim()) return;
    setMomWins(prev => [{ text: newWin, date: new Date().toLocaleDateString(), id: Date.now() }, ...prev]);
    setNewWin('');
  };

  const inputStyle = { border: 'none', fontSize: 14, color: TEXT_DARK, background: '#F0FAF4', borderRadius: 12, padding: '10px 14px', width: '100%', fontFamily: "'DM Sans', sans-serif", outline: 'none' };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Archivo+Black&display=swap');
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
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
          <div style={{ marginTop: 4, fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.35)', fontWeight: 500, textTransform: 'uppercase' }}>Your Mom Friend.&nbsp;&nbsp;Always Here.</div>
        </div>
        {/* Emergency button */}
        <button onClick={() => setShowEmergency(!showEmergency)} style={{ position: 'absolute', right: 16, top: 16, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '6px 10px', cursor: 'pointer', fontSize: 11, color: '#FCA5A5', fontWeight: 600 }}>
          🆘 Help
        </button>
      </div>

      {/* ── EMERGENCY PANEL ── */}
      {showEmergency && (
        <div style={{ background: '#FEF2F2', padding: '16px', borderBottom: '1px solid #FECACA' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#991B1B', marginBottom: 10 }}>🆘 Emergency Resources</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {EMERGENCY_RESOURCES.map((r, i) => (
              <div key={i} style={{ background: '#FFF', borderRadius: 12, padding: '10px 14px', border: '1px solid #FECACA' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#991B1B' }}>{r.name}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#DC2626' }}>{r.number}</div>
                {r.desc && <div style={{ fontSize: 11, color: '#B91C1C' }}>{r.desc}</div>}
              </div>
            ))}
          </div>
          <button onClick={() => setShowEmergency(false)} style={{ marginTop: 10, background: 'none', border: 'none', color: '#991B1B', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Close ✕</button>
        </div>
      )}

      {/* ── INSTALL APP BANNER ── */}
      {showInstallPrompt && (
        <div style={{ background: 'linear-gradient(135deg, #EBF7F0, #E0F2E7)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 24 }}>📲</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK }}>Install MomzVeda</div>
            <div style={{ fontSize: 11, color: TEXT_MID }}>Add to your home screen for quick access</div>
          </div>
          <button onClick={async () => {
            if (deferredPrompt) {
              deferredPrompt.prompt();
              const result = await deferredPrompt.userChoice;
              if (result.outcome === 'accepted') setShowInstallPrompt(false);
              setDeferredPrompt(null);
            }
          }} style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`, color: '#FFF', border: 'none', borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
            Install
          </button>
          <button onClick={() => setShowInstallPrompt(false)} style={{ background: 'none', border: 'none', color: TEXT_LIGHT, fontSize: 16, cursor: 'pointer', padding: '0 4px' }}>✕</button>
        </div>
      )}

      {/* ── PREMIUM SUCCESS BANNER ── */}
      {isPremium && messages.length === 0 && showWelcome && (
        <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #FDE68A' }}>
          <span style={{ fontSize: 20 }}>✨</span>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#92400E' }}>Welcome to Premium! Unlimited messages & all Guides unlocked 💛</div>
        </div>
      )}

      {/* ── TAB BAR ── */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${BORDER_LIGHT}`, background: CARD_BG }}>
        {[
          { id: 'chat', label: '💬 Chat' },
          { id: 'journeys', label: isPremium ? '🗺️ Guides' : '🗺️ Guides 🔒' },
          { id: 'profiles', label: '👶 Kids' },
          { id: 'wins', label: '🌟 Wins' },
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
          {/* Affirmation */}
          {affirmation && showWelcome && (
            <div style={{ background: 'linear-gradient(135deg, #E8F7EE, #DCEFFE)', borderRadius: 20, padding: '22px 20px', marginBottom: 16, position: 'relative', overflow: 'hidden', boxShadow: '0 2px 16px rgba(34,197,94,0.08)' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.35)' }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: GREEN_DARK, marginBottom: 6, letterSpacing: '0.05em' }}>✨ TODAY'S AFFIRMATION</div>
              <div style={{ fontSize: 16, color: TEXT_DARK, lineHeight: 1.6, fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>{affirmation}</div>
              <button onClick={() => { let n; do { n = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]; } while (n === affirmation); setAffirmation(n); }} style={{ marginTop: 12, background: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 10, padding: '6px 14px', cursor: 'pointer', fontSize: 12, color: GREEN_DARK, fontWeight: 600 }}>↻ New</button>
            </div>
          )}
          {/* Welcome */}
          {showWelcome && messages.length === 0 && (
            <div style={{ animation: 'fadeSlideIn 0.5s ease-out' }}>
              <div style={{ textAlign: 'center', padding: '8px 0 20px', color: TEXT_MID, fontSize: 14, lineHeight: 1.6 }}>
                Hey {momProfile?.momName || 'mama'}! 👋 I'm here whenever you need me.<br />
                {momProfile?.children?.length > 0 && (
                  <span style={{ fontSize: 13, color: GREEN_DARK, fontWeight: 600 }}>
                    I know all about {momProfile.children.map(c => c.name).join(' & ')} — let's chat! 💚<br />
                  </span>
                )}
                <span style={{ fontSize: 12, color: TEXT_LIGHT }}>Tap a topic or type anything!</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {QUICK_TOPICS.map((t, i) => (
                  <button key={i} onClick={() => sendMessage(t.prompt)} style={{ background: CARD_BG, border: `1.5px solid ${BORDER}`, borderRadius: 14, padding: '12px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.03)', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <span style={{ fontSize: 20 }}>{t.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_DARK }}>{t.label}</span>
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
              <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK }}>Guided Journeys</div>
              {!isPremium && <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706', background: '#FEF3C7', padding: '3px 10px', borderRadius: 8 }}>✨ PREMIUM</span>}
            </div>
            <div style={{ fontSize: 13, color: TEXT_LIGHT, marginBottom: 16 }}>Step-by-step guidance for common milestones</div>

            {isPremium ? (
              <div style={{ display: 'grid', gap: 10 }}>
                {GUIDED_JOURNEYS.map((j, i) => (
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
                  {GUIDED_JOURNEYS.map((j, i) => (
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
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#92400E', marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>Unlock Guided Journeys</div>
                  <p style={{ fontSize: 14, color: '#B45309', lineHeight: 1.6, marginBottom: 12 }}>
                    Get step-by-step guidance for sleep training, starting solids, taming tantrums, and more — plus unlimited daily messages.
                  </p>
                  <div style={{ background: '#FFF', borderRadius: 10, padding: '8px 14px', marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #FDE68A' }}>
                    <span style={{ fontSize: 14 }}>🎁</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: GREEN_DARK }}>First 30 days free!</span>
                  </div>
                  <br />
                  <button onClick={() => setShowUpgrade(true)} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFF', border: 'none', borderRadius: 14, padding: '14px 28px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}>
                    Start Free Trial
                  </button>
                  <div style={{ fontSize: 12, color: '#B45309', marginTop: 8 }}>Then €9.99/mo or €69.99/year — cancel anytime</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHILD PROFILES TAB */}
        {activeTab === 'profiles' && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, marginBottom: 4 }}>Your Children</div>
            <div style={{ fontSize: 13, color: TEXT_LIGHT, marginBottom: 16 }}>Add your kids so MomzVeda can give personalized, age-specific advice</div>
            {childProfiles.map(c => (
              <div key={c.id} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: TEXT_MID }}>Age: {c.age} {c.notes && `· ${c.notes}`}</div>
                </div>
                <button onClick={() => removeChild(c.id)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontSize: 12, color: '#DC2626', fontWeight: 600 }}>Remove</button>
              </div>
            ))}
            {showAddChild ? (
              <div style={{ background: CARD_BG, border: `1.5px solid ${GREEN}`, borderRadius: 16, padding: '16px', marginTop: 8 }}>
                <input value={newChild.name} onChange={e => setNewChild({ ...newChild, name: e.target.value })} placeholder="Child's name" style={{ ...inputStyle, marginBottom: 8 }} />
                <input value={newChild.age} onChange={e => setNewChild({ ...newChild, age: e.target.value })} placeholder="Age (e.g., 2, 6 months, 10)" style={{ ...inputStyle, marginBottom: 8 }} />
                <input value={newChild.notes} onChange={e => setNewChild({ ...newChild, notes: e.target.value })} placeholder="Notes (allergies, interests...)" style={{ ...inputStyle, marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={addChild} style={{ flex: 1, background: GREEN, color: '#FFF', border: 'none', borderRadius: 12, padding: '10px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Add Child</button>
                  <button onClick={() => setShowAddChild(false)} style={{ background: '#F5F0EB', border: 'none', borderRadius: 12, padding: '10px 16px', cursor: 'pointer', fontSize: 13, color: TEXT_MID }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddChild(true)} style={{ width: '100%', background: '#EBF7F0', border: `1.5px dashed ${GREEN}`, borderRadius: 16, padding: '14px', cursor: 'pointer', fontSize: 14, color: GREEN_DARK, fontWeight: 600, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
                + Add a child
              </button>
            )}
          </div>
        )}

        {/* MOM WINS TAB */}
        {activeTab === 'wins' && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, marginBottom: 4 }}>Mom Wins 🌟</div>
            <div style={{ fontSize: 13, color: TEXT_LIGHT, marginBottom: 16 }}>Celebrate the small victories — you deserve it!</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input value={newWin} onChange={e => setNewWin(e.target.value)} onKeyDown={e => e.key === 'Enter' && addWin()} placeholder="What's your win today?" style={{ ...inputStyle, flex: 1 }} />
              <button onClick={addWin} disabled={!newWin.trim()} style={{ background: newWin.trim() ? GREEN : '#D5E8DC', color: '#FFF', border: 'none', borderRadius: 12, padding: '10px 18px', cursor: newWin.trim() ? 'pointer' : 'default', fontWeight: 600, fontSize: 14, transition: 'all 0.2s' }}>+</button>
            </div>
            {momWins.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: TEXT_LIGHT, fontSize: 14, lineHeight: 1.6 }}>
                No wins logged yet — but you're here, and that's already a win! 💛<br />
                <span style={{ fontSize: 12 }}>Try: "Baby slept 5 hours" or "Made dinner from scratch"</span>
              </div>
            ) : (
              momWins.map(w => (
                <div key={w.id} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, color: TEXT_DARK, fontWeight: 500 }}>🌟 {w.text}</div>
                    <div style={{ fontSize: 11, color: TEXT_LIGHT, marginTop: 2 }}>{w.date}</div>
                  </div>
                  <button onClick={() => setMomWins(prev => prev.filter(x => x.id !== w.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: TEXT_LIGHT }}>✕</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── QUICK TOPICS (mid-chat) ── */}
      {activeTab === 'chat' && !showWelcome && !isTyping && (
        <div style={{ padding: '6px 16px', overflowX: 'auto', display: 'flex', gap: 6, borderTop: `1px solid ${BORDER_LIGHT}` }}>
          {QUICK_TOPICS.slice(0, 5).map((t, i) => (
            <button key={i} onClick={() => sendMessage(t.prompt)} style={{ background: '#EBF7F0', border: `1px solid ${BORDER}`, borderRadius: 20, padding: '5px 12px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 12, color: TEXT_MID, fontWeight: 500, transition: 'all 0.2s', flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={e => { e.target.style.background = '#D5F0DC'; e.target.style.borderColor = GREEN; }}
              onMouseLeave={e => { e.target.style.background = '#EBF7F0'; e.target.style.borderColor = BORDER; }}
            >{t.emoji} {t.label}</button>
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
                  {FREE_MSG_LIMIT - dailyMsgCount} free message{FREE_MSG_LIMIT - dailyMsgCount !== 1 ? 's' : ''} left today
                  {dailyMsgCount >= 4 && ' ⚡'}
                </span>
              ) : (
                <button onClick={() => setShowUpgrade(true)} style={{ fontSize: 11, color: '#D97706', fontWeight: 700, background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 8, padding: '3px 12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  Daily limit reached — Start free trial for unlimited ✨
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
              placeholder={!isPremium && dailyMsgCount >= FREE_MSG_LIMIT ? 'Upgrade for unlimited messages ✨' : `Talk to me, ${momProfile?.momName || 'mama'}... 💬`} rows={1}
              disabled={!isPremium && dailyMsgCount >= FREE_MSG_LIMIT}
              style={{ flex: 1, border: 'none', resize: 'none', fontSize: 15, color: TEXT_DARK, background: 'transparent', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, padding: '6px 0', maxHeight: 80, overflowY: 'auto', opacity: (!isPremium && dailyMsgCount >= FREE_MSG_LIMIT) ? 0.5 : 1 }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'; }}
            />
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
                Try Premium Free
              </h2>
              <div style={{ fontSize: 15, fontWeight: 700, color: GREEN_DARK, marginBottom: 6 }}>First 30 days free — cancel anytime</div>
              <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 24 }}>
                Get the full MomzVeda experience — because you deserve unlimited support, mama.
              </p>

              {/* Features */}
              <div style={{ textAlign: 'left', marginBottom: 24 }}>
                {[
                  { emoji: '💬', text: 'Unlimited daily messages' },
                  { emoji: '🗺️', text: 'Full Guided Journeys library' },
                  { emoji: '⚡', text: 'Priority response speed' },
                  { emoji: '🆕', text: 'New guides added monthly' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 3 ? `1px solid ${BORDER_LIGHT}` : 'none' }}>
                    <span style={{ fontSize: 20 }}>{f.emoji}</span>
                    <span style={{ fontSize: 14, color: TEXT_DARK, fontWeight: 500 }}>{f.text}</span>
                    <span style={{ marginLeft: 'auto', color: GREEN, fontWeight: 700, fontSize: 14 }}>✓</span>
                  </div>
                ))}
              </div>

              {/* Free trial badge */}
              <div style={{ background: '#EBF7F0', border: `1.5px solid ${GREEN}`, borderRadius: 12, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🎁</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: GREEN_DARK }}>30 days free — no charge until day 31</span>
              </div>

              {/* Pricing buttons */}
              <button onClick={() => handleUpgrade('monthly')} style={{
                width: '100%', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFF', border: 'none',
                borderRadius: 16, padding: '16px', fontSize: 17, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 20px rgba(245,158,11,0.3)', marginBottom: 10,
              }}>
                Start Free Trial — then €9.99/mo
              </button>
              <button onClick={() => handleUpgrade('yearly')} style={{
                width: '100%', background: '#FFF7ED', color: '#92400E', border: '2px solid #FDE68A',
                borderRadius: 16, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", marginBottom: 16,
              }}>
                Start Free Trial — then €69.99/yr <span style={{ fontSize: 12, fontWeight: 500, color: '#B45309' }}>save 42%</span>
              </button>

              <button onClick={() => setShowUpgrade(false)} style={{
                background: 'none', border: 'none', color: TEXT_LIGHT, fontSize: 14, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", padding: '8px',
              }}>
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
