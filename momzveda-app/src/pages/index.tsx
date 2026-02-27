import type { NextPage } from 'next';
import Head from 'next/head';
import Chat from '../components/Chat';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>MomzVeda - Your AI Mom Friend</title>
        <meta name="description" content="24/7 support for mothers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <Chat />
      </main>
    </div>
  );
};

export default Home;