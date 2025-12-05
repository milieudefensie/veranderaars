import * as React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout/layout';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout';
import TravelTogether from '../components/Layout/travel-together/travel-together'; // @ts-ignore
import { HelmetDatoCms } from 'gatsby-source-datocms';
import { SignalGroupType } from '../types';

const SignalToolPage: React.FC<PageProps> = ({ data }) => {
  // @ts-ignore
  const signalGroups = data.signalGroups.nodes || [];

  return (
    <Layout>
      {/* @ts-ignore */}
      <HelmetDatoCms seo={data.favicon.faviconMetaTags}>
        <title>Albert Heijn ignal</title>
      </HelmetDatoCms>

      <WrapperLayout variant={`white event-detail`}>
        <div className="container">
          <TravelTogether
            slug={'albert-heijn-signal'}
            othersSignalGroups={signalGroups.map((g: any) => g)}
            icon="cart"
            textLabels={{
              header: 'Help mee in',
              input: 'Ik wil meehelpen in',
              search: 'Zoek',
              foundStep1: {
                title: 'Kom in de Signalgroep',
                subtitle: 'Help mee in',
                text: 'Ook in [city] zeggen we: Hey Albert Heijn, wij willen betaalbaar en groen boodschappen doen! Kom in de Signalgroep om op de hoogte te blijven en/of je meteen aan te melden om mee te doen',
                button: '💬 Open de Signalgroep',
              },
              foundStep2: {
                title: 'Nodig anderen uit om ook mee te helpen',
                text: 'Samen zijn we sterker, en het is ook nog eens veel gezelliger.',
                blockTitle: 'Deel deze actie met anderen, en nodig hen uit om mee te doen:',
                shareText: `Hoi! Ik doe mee aan de campagne van Milieudefensie die Albert Heijn oproept om hun boodschappen betaalbaar en groen te maken voor iedereen. Kom je ook meehelpen in [city]? 
                  
http://veranderaars.milieudefensie.nl/albert-heijn-signal
http://veranderaars.milieudefensie.nl/albert-heijn
                `,
              },
              notFoundStep1: {
                button: 'Signalgroep',
                text: 'Signalgroep',
                title: 'Maak een Signalgroep',
                secondaryButton: '✅ Ik heb een Signalgroep aangemaakt',
              },
              notFoundStep2: {
                text: '<strong>Kopieer de uitnodigingslink van je Signalgroep.</strong> Plak deze hieronder. Wij nodigen andere veranderaars uit [city] en omgeving uit om mee te helpen.',
                bottomText:
                  'Wij controleren de link en delen deze openbaar op deze pagina, zodat meer mensen jou kunnen vinden en kunnen helpen. Je e-mailadres blijft prive maar zo kunnen we contact met je opnemen om je verder te helpen.',
              },
              notFoundStep3: {
                title: 'Nodig anderen uit om ook mee te helpen',
                text: 'Samen zijn we sterker, en het is ook nog eens veel gezelliger.',
                blockTitle: 'Deel deze actie met anderen, en nodig hen uit om mee te doen:',
                shareText: `Hoi! Ik doe mee aan de campagne van Milieudefensie die Albert Heijn oproept om hun boodschappen betaalbaar en groen te maken voor iedereen. Kom je ook meehelpen in [city]? 
                  
http://veranderaars.milieudefensie.nl/albert-heijn-signal
http://veranderaars.milieudefensie.nl/albert-heijn
`,
              },
              shareText: `Hoi! Ik doe mee aan de campagne van Milieudefensie die Albert Heijn oproept om hun boodschappen betaalbaar en groen te maken voor iedereen. Kom je ook meehelpen in [city]? 
              
http://veranderaars.milieudefensie.nl/albert-heijn-signal
http://veranderaars.milieudefensie.nl/albert-heijn
`,
            }}
            travelTogetherApi
          />

          {signalGroups && signalGroups.length > 0 && (
            <div className="related-groups-container">
              <h3>Deze plaatsen doen al mee:</h3>

              <div className={`related-events length-${signalGroups.length}`}>
                <ul>
                  {signalGroups.map((item: SignalGroupType) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-all"
                    >
                      <li>
                        <div className="icon">
                          <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                            <path
                              fill="currentColor"
                              d="M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42c-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.54 5.54 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13zM0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9c-.59.68-.95 1.62-.95 2.65V20zm24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65c2.56.34 4.45 1.51 4.45 2.9z"
                            ></path>
                          </svg>
                        </div>
                        <div className="metadata">
                          <div className="date">{item.internalName}</div>
                          <div className="type">Signal chat groep</div>
                        </div>
                      </li>
                    </a>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </WrapperLayout>
    </Layout>
  );
};

export default SignalToolPage;

export const SignalToolQuery = graphql`
  query SignalTool {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    signalGroups: allDatoCmsSignalGroup(sort: { internalName: ASC }) {
      nodes {
        id
        internalName
        url
      }
    }
  }
`;
