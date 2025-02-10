import React from 'react';
import NarrativeBlock from './Blocks/NarrativeBlock/NarrativeBlock';
import Accordion from './Blocks/Accordion/Accordion';
import Logos from './Blocks/Logos/Logos';
import SimpleText from './Blocks/SimpleText/SimpleText';
import Video from './Blocks/Video/Video';
import Table from './Blocks/Table/Table';
import ListHighlightEvent from './Blocks/HighlightEvent/ListHighlightEvent';
import HighlightTools from './Blocks/HighlightTools/HighlightTools';
import FormBlock from './Blocks/FormBlock/FormBlock';
import Share from './Blocks/Share/Share';
import ImageWrapper from './Global/Image/ImageWrapper';
import EmbedIframe from './Blocks/EmbedIframe/EmbedIframe';
import Cta from './Global/Cta/Cta';
import MapFilter from './Blocks/MapFilter/MapFilter';
import CountDown from './Blocks/Countdown/Countdown';
import BlockCtaList from './Blocks/CtaList/CtaList';
import BlockCtaIconsList from './Blocks/CtaIconsList/CtaIconsList';
import ImageGallery from './Blocks/ImageGallery/ImageGallery';
import Columns from './Blocks/Columns/Columns';
import { ProtectedLink } from './Global/BotProtection/BotProtection';

export default function Blocks({ blocks, usePrimaryHeading = false, isHomepage = false }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.__typename) {
          case 'DatoCmsNarrativeBlock':
            return <NarrativeBlock block={block} key={block.id} usePrimaryHeading={usePrimaryHeading} anchor={index} />;
          case 'DatoCmsAcordion':
            return <Accordion key={block.id} items={block.items} renderChild={(item) => <div>{item.text}</div>} />;
          case 'DatoCmsLogo':
            return <Logos key={block.id} block={block} />;
          case 'DatoCmsSimpleText':
            return <SimpleText key={block.id} block={block} />;
          case 'DatoCmsTable':
            return <Table key={block.id} content={block} />;
          case 'DatoCmsVideoBlock':
            return <Video key={block.id} content={block} />;
          case 'DatoCmsHighlightEvent':
            return <ListHighlightEvent key={block.id} block={block} />;
          case 'DatoCmsHighlightTool':
            return <HighlightTools key={block.id} block={block} />;
          case 'DatoCmsTextHubspotForm':
            return <FormBlock key={block.id} block={block} isHomepage={isHomepage} />;
          case 'DatoCmsShare':
            return <Share key={block.id} block={block} />;
          case 'DatoCmsImage':
            return <ImageWrapper image={block.image} key={block.id} />;
          case 'DatoCmsEmbedIframe':
            return <EmbedIframe content={block} key={block.id} />;
          case 'DatoCmsBlockCta':
            const alignment = { left: 'flex-start', center: 'center', right: 'flex-end' };

            return (
              <div
                key={block.id}
                style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: block?.alignment ? alignment[block.alignment] : '',
                }}
              >
                {!block.whatsappCommunity && <Cta cta={block} />}
                {block.whatsappCommunity && (
                  <ProtectedLink to={block.link.externalUrl} className="custom-btn custom-btn-primary">
                    {block.title}
                  </ProtectedLink>
                )}
              </div>
            );

          case 'DatoCmsMap':
            return <MapFilter key={block.id} block={block} />;
          case 'DatoCmsCountdown':
            return <CountDown key={block.id} block={block} />;
          case 'DatoCmsCtaList':
            return <BlockCtaList key={block.id} block={block} />;
          case 'DatoCmsCtaIconsList':
            return <BlockCtaIconsList key={block.id} block={block} />;
          case 'DatoCmsImageGallery':
            return <ImageGallery key={block.id} block={block} />;
          case 'DatoCmsColumn':
            return <Columns key={block.id} block={block} />;

          default:
            return null;
        }
      })}
    </>
  );
}
