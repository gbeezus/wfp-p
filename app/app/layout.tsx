import { gql } from '@apollo/client';
import { getClient } from '@faustwp/experimental-app-router';
import { FaustProvider } from '@faustwp/experimental-app-router/ssr';
import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import '../faust.config.js';
import '../source/00-config/index.css';
import sourceSansPro from '../source/01-global/fonts/source-sans';
import '../source/01-global/index.css';
import Footer from '../source/02-layouts/Footer/Footer';
import Header from '../source/02-layouts/Header/Header';
import SiteContainer from '../source/02-layouts/SiteContainer/SiteContainer';
import BackToTop from '../source/03-components/BackToTop/BackToTop';
import Menu from '../source/03-components/Menu/Menu';
import ResponsiveMenu from '../source/03-components/Menu/ResponsiveMenu/ResponsiveMenu';
import footerStyles from '../source/03-components/Menu/menu-footer.module.css';
import SiteName from '../source/03-components/SiteName/SiteName';
import Skiplink from '../source/03-components/Skiplink/Skiplink';
import addBasePath from '../source/06-utility/addBasePath';
import '../source/06-utility/index.css';
import { GetLayoutQuery } from '../types/__generated__/graphql';
import { arrayFromAcf } from '../utils/acfTools';
import ClientProvider from './ClientProvider';

export const metadata: Metadata = {
  title: {
    template: '%s | Default Title',
    default: 'Default Title',
  },
  icons: {
    icon: addBasePath('/favicon.ico'),
  },
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const client = await getClient();

  const { data } = await client.query<GetLayoutQuery>({
    query: gql`
      query GetLayout {
        generalSettings {
          title
          description
        }
        primaryMenuItems: menuItems(where: { location: PRIMARY }) {
          nodes {
            id
            label
            uri
          }
        }
        footerMenuItems: menuItems(where: { location: FOOTER }) {
          nodes {
            id
            label
            uri
          }
        }
      }
    `,
  });

  if (
    !data.generalSettings ||
    !data.primaryMenuItems ||
    !data.footerMenuItems
  ) {
    throw new Error('Query failed.');
  }

  return (
    <html lang="en" className={sourceSansPro.variable}>
      <body>
        <SiteContainer>
          <FaustProvider>
            <ClientProvider>
              <Skiplink />
              <Header>
                <SiteName siteName={data.generalSettings.title || ''} />
                <ResponsiveMenu
                  items={arrayFromAcf(data.primaryMenuItems.nodes).map(el => ({
                    title: el.label || '',
                    url: el.uri || '',
                  }))}
                />
              </Header>
              {children}
              <Footer>
                <Menu
                  items={arrayFromAcf(data.footerMenuItems.nodes).map(el => ({
                    title: el.label || '',
                    url: el.uri || '',
                  }))}
                  modifierClasses={footerStyles.menu}
                  itemClasses={footerStyles.item}
                />
              </Footer>
            </ClientProvider>
          </FaustProvider>
        </SiteContainer>
        <BackToTop text="Back to Top" topElement="top" />
      </body>
    </html>
  );
}
