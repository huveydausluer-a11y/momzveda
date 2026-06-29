import Link from 'next/link';

const posts = [
  {
    slug: 'why-every-mom-deserves-a-friend-at-3am',
    title: 'Why Every Mom Deserves a Non-Judgmental Friend at 3am',
    description: 'Motherhood can be lonely, especially in the middle of the night. Here is why having someone to talk to matters more than you think.',
    date: 'March 12, 2026',
    readTime: '5 min read',
    category: 'Motherhood',
  },
  {
    slug: '10-quick-dinners-when-youre-too-tired',
    title: '10 Quick Dinner Ideas When You Are Too Tired to Cook',
    description: 'Easy, healthy meals that take 15 minutes or less. Perfect for exhausted moms who still want to feed their family well.',
    date: 'March 12, 2026',
    readTime: '4 min read',
    category: 'Recipes',
  },
  {
    slug: 'dealing-with-mom-guilt',
    title: 'Dealing with Mom Guilt: You Are Doing Better Than You Think',
    description: 'Mom guilt is universal but rarely talked about openly. Learn why it happens and practical ways to ease the weight.',
    date: 'March 12, 2026',
    readTime: '6 min read',
    category: 'Mental Health',
  },
];

export const metadata = {
  title: 'Blog — MomzVeda',
  description: 'Parenting tips, recipes, affirmations, and real talk for moms at every stage. Read the MomzVeda blog for support and inspiration.',
  keywords: 'parenting blog, mom blog, motherhood tips, parenting advice, mom support, MomzVeda blog',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog — MomzVeda',
    description: 'Parenting tips, recipes, affirmations, and real talk for moms at every stage.',
    url: '/blog',
  },
};

export default function BlogPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F3EFFB',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '48px 24px',
      }}>
        <a href="/" style={{
          color: '#1E90E8',
          textDecoration: 'none',
          fontSize: 14,
          fontWeight: 600,
        }}>
          &larr; Back to MomzVeda
        </a>

        <h1 style={{
          fontSize: 36,
          fontWeight: 700,
          color: '#1B0B3B',
          marginTop: 24,
          marginBottom: 8,
          fontFamily: "'Playfair Display', serif",
        }}>
          MomzVeda Blog
        </h1>
        <p style={{
          color: '#6E5C8A',
          fontSize: 16,
          marginBottom: 40,
          lineHeight: 1.6,
        }}>
          Real talk, practical tips, and a whole lot of support for moms at every stage.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <article style={{
                background: '#FFFFFF',
                borderRadius: 16,
                padding: 32,
                border: '1px solid #E2D5F3',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                cursor: 'pointer',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 12,
                }}>
                  <span style={{
                    background: '#EDE4FB',
                    color: '#5A1690',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: 20,
                  }}>
                    {post.category}
                  </span>
                  <span style={{ color: '#6E5C8A', fontSize: 13 }}>
                    {post.date}
                  </span>
                  <span style={{ color: '#6E5C8A', fontSize: 13 }}>
                    &middot; {post.readTime}
                  </span>
                </div>
                <h2 style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#1B0B3B',
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}>
                  {post.title}
                </h2>
                <p style={{
                  color: '#5A1690',
                  fontSize: 15,
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {post.description}
                </p>
              </article>
            </Link>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: 48,
          padding: 32,
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E2D5F3',
        }}>
          <p style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#1B0B3B',
            marginBottom: 8,
          }}>
            Need someone to talk to right now?
          </p>
          <p style={{
            color: '#5A1690',
            fontSize: 14,
            marginBottom: 16,
          }}>
            MomzVeda is your AI mom friend — always here, never judging.
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
      </div>
    </div>
  );
}
