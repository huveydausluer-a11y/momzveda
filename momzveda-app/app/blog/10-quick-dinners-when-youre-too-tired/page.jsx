export const metadata = {
  title: '10 Quick Dinner Ideas When You Are Too Tired to Cook — MomzVeda',
  description: 'Easy, healthy meals that take 15 minutes or less. Perfect for exhausted moms who still want to feed their family well.',
  keywords: 'quick dinner ideas, easy meals for moms, busy mom recipes, 15 minute meals, family dinner ideas, MomzVeda',
  alternates: {
    canonical: '/blog/10-quick-dinners-when-youre-too-tired',
  },
  openGraph: {
    title: '10 Quick Dinner Ideas When You Are Too Tired to Cook',
    description: 'Easy, healthy meals that take 15 minutes or less. Perfect for exhausted moms who still want to feed their family well.',
    url: '/blog/10-quick-dinners-when-youre-too-tired',
    type: 'article',
  },
};

export default function BlogPost() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: '10 Quick Dinner Ideas When You Are Too Tired to Cook',
    description: 'Easy, healthy meals that take 15 minutes or less. Perfect for exhausted moms who still want to feed their family well.',
    author: { '@type': 'Organization', name: 'MomzVeda', url: 'https://www.momzveda.com' },
    publisher: { '@type': 'Organization', name: 'MomzVeda', url: 'https://www.momzveda.com' },
    datePublished: '2026-03-12',
    dateModified: '2026-03-12',
    mainEntityOfPage: 'https://www.momzveda.com/blog/10-quick-dinners-when-youre-too-tired',
  };

  const recipes = [
    { name: 'One-Pan Pasta', time: '12 min', desc: 'Throw pasta, canned tomatoes, garlic, olive oil, and whatever vegetables you have into one pot. Bring to a boil, cook until pasta is done. One pot, one cleanup, zero stress.' },
    { name: 'Quesadilla Bar', time: '10 min', desc: 'Tortillas, shredded cheese, and whatever fillings are in the fridge — leftover chicken, beans, corn, peppers. Heat in a pan for 3 minutes each side. Kids love assembling their own.' },
    { name: 'Egg Fried Rice', time: '10 min', desc: 'Use leftover rice or microwave instant rice. Scramble eggs in a pan, add rice, soy sauce, frozen peas, and a splash of sesame oil. Done before the kids finish setting the table.' },
    { name: 'Sheet Pan Nachos', time: '15 min', desc: 'Spread tortilla chips on a baking sheet, top with cheese, canned black beans, and whatever else you have. Broil for 5 minutes. Serve with salsa and sour cream.' },
    { name: 'Avocado Toast Dinner', time: '5 min', desc: 'Yes, it counts as dinner. Toast good bread, mash avocado with salt and lemon, top with a fried egg. Add cherry tomatoes if you are feeling fancy. No judgment here.' },
    { name: 'Soup from the Pantry', time: '15 min', desc: 'Canned broth plus canned beans plus frozen vegetables plus whatever pasta or rice you have. Season with garlic powder, salt, pepper, and a splash of hot sauce. Surprisingly good every time.' },
    { name: 'Wraps with Whatever', time: '8 min', desc: 'Large tortillas, deli meat or hummus, cheese, lettuce, and any sauce you like. Roll them up. No cooking required. This is a perfectly acceptable dinner.' },
    { name: 'Frozen Pizza Plus', time: '15 min', desc: 'Take a frozen pizza, add fresh toppings — extra cheese, fresh spinach, sliced tomatoes, olives. It upgrades it enough that you feel good about serving it. Nobody needs to know it started frozen.' },
    { name: 'Breakfast for Dinner', time: '10 min', desc: 'Pancakes, scrambled eggs, fruit. Kids think it is the most exciting thing ever. You know it is the easiest meal you have made all week. Win-win.' },
    { name: 'Peanut Butter Noodles', time: '12 min', desc: 'Cook any noodles. Mix peanut butter, soy sauce, a little honey, and warm water into a sauce. Toss with noodles and add whatever vegetables are around. Even picky eaters usually go for this one.' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F3EFFB',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '48px 24px',
        color: '#1B0B3B',
        lineHeight: 1.8,
      }}>
        <a href="/blog" style={{
          color: '#1E90E8',
          textDecoration: 'none',
          fontSize: 14,
          fontWeight: 600,
        }}>
          &larr; Back to Blog
        </a>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 24,
          marginBottom: 12,
        }}>
          <span style={{
            background: '#FEF3C7',
            color: '#D97706',
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: 20,
          }}>
            Recipes
          </span>
          <span style={{ color: '#6E5C8A', fontSize: 13 }}>March 12, 2026</span>
          <span style={{ color: '#6E5C8A', fontSize: 13 }}>&middot; 4 min read</span>
        </div>

        <h1 style={{
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 24,
          fontFamily: "'Playfair Display', serif",
        }}>
          10 Quick Dinner Ideas When You Are Too Tired to Cook
        </h1>

        <p style={{ fontSize: 18, color: '#5A1690', marginBottom: 32, fontStyle: 'italic' }}>
          Some days, the most heroic thing a mom can do is feed everyone. These meals make that easy.
        </p>

        <p>
          Let us be real: there are nights when the idea of cooking feels impossible. The baby was fussy all day, the toddler had three meltdowns, work was intense, and you have been running on caffeine and willpower since 6am. The last thing you need is a recipe that requires 47 ingredients and an hour of prep time.
        </p>
        <p>
          These ten meals are for those nights. Every single one takes 15 minutes or less, uses ingredients you probably already have, and tastes good enough that nobody will complain. Most importantly, none of them require you to feel guilty about not making a "proper" dinner.
        </p>

        {recipes.map((recipe, i) => (
          <div key={i} style={{
            background: '#FFFFFF',
            border: '1px solid #E2D5F3',
            borderRadius: 12,
            padding: 24,
            marginTop: 24,
            marginBottom: 24,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                {i + 1}. {recipe.name}
              </h2>
              <span style={{
                background: '#EDE4FB',
                color: '#5A1690',
                fontSize: 12,
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 20,
                whiteSpace: 'nowrap',
              }}>
                {recipe.time}
              </span>
            </div>
            <p style={{ margin: 0, color: '#5A1690', fontSize: 15 }}>
              {recipe.desc}
            </p>
          </div>
        ))}

        <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>
          The Most Important Ingredient
        </h2>
        <p>
          Self-compassion. Feeding your family does not have to be Instagram-worthy. A meal made with love — even if that love looks like heating up a frozen pizza — is a good meal. You showed up, you fed everyone, and that is more than enough.
        </p>

        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2D5F3',
          borderRadius: 16,
          padding: 32,
          marginTop: 40,
          marginBottom: 40,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
            Need more recipe ideas?
          </p>
          <p style={{ color: '#5A1690', fontSize: 15, marginBottom: 20 }}>
            Ask MomzVeda for personalized meal suggestions based on what you have on hand.
          </p>
          <a href="/signup" style={{
            display: 'inline-block',
            background: '#1E90E8',
            color: '#FFFFFF',
            padding: '12px 32px',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            Try MomzVeda Free
          </a>
        </div>
      </article>
    </div>
  );
}
