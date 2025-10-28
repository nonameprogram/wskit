/* eslint-env node */
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { Banner, Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import '../styles/globals.css';

export const metadata = {
  metadataBase: new URL('https://nextra.site'),
  title: {
    template: '%s - WebSocketKit',
  },
  description: 'WebSocketKit',
  applicationName: 'WebSocketKit',
  generator: 'Next.js',
  appleWebApp: {
    title: 'WebSocketKit',
  },
  other: {
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'msapplication-TileColor': '#fff',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navbar = (
    <Navbar
      logo={
        <div>
          <b>WebSocketKit</b>{' '}
        </div>
      }
    />
  );
  const pageMap = await getPageMap();
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          navbar={navbar}
          footer={<Footer>{new Date().getFullYear()} © WebSocketKit.</Footer>}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/nonameprogram/wskit/blob/main/docs"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
