import React from 'react';
import NarrativeBlock from './Blocks/NarrativeBlock/narrative-block';
import Accordion from './Blocks/Accordion/accordion';
import Logos from './Blocks/Logos/logos';
import SimpleText from './Blocks/SimpleText/simple-text';
import Video from './Blocks/Video/video';
import Table from './Blocks/Table/table';
import ListHighlightEvent from './Blocks/HighlightEvent/list-highlight-event';
import HighlightTools from './Blocks/HighlightTools/highlight-tools';
import FormBlock from './Blocks/FormBlock/form-block';
import Share from './Blocks/Share/share';
import ImageWrapper from './Global/Image/image-wrapper';
import EmbedIframe from './Blocks/EmbedIframe/embed-iframe';
import Cta from './Global/Cta/cta';
import MapFilter from './Blocks/MapFilter/map-filter';
import CountDown from './Blocks/Countdown/countdown';
import BlockCtaList from './Blocks/CtaList/cta-list';
import BlockCtaIconsList from './Blocks/CtaIconsList/cta-icons-list';
import ImageGallery from './Blocks/ImageGallery/image-gallery';
import Columns from './Blocks/Columns/columns';
import { ProtectedLink } from './Global/BotProtection/BotProtection';

interface Block {
  id: string;
  __typename: string;
  [key: string]: any;
}

interface BlocksProps {
  blocks: Block[];
  context?: any;
  usePrimaryHeading?: boolean;
  isHomepage?: boolean;
}

const Blocks: React.FC<BlocksProps> = ({ blocks, context, usePrimaryHeading = false, isHomepage = false }) => {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.__typename) {
          case 'DatoCmsNarrativeBlock':
            return <NarrativeBlock key={block.id} block={block} usePrimaryHeading={usePrimaryHeading} anchor={index} />;
          case 'DatoCmsAcordion':
            return (
              <Accordion
                key={block.id}
                items={block.items}
                renderChild={(item: { text: string }) => <div>{item.text}</div>}
              />
            );
          case 'DatoCmsLogo':
            return <Logos key={block.id} block={block} />;
          case 'DatoCmsSimpleText':
            return <SimpleText key={block.id} block={block} />;
          case 'DatoCmsTable':
            return <Table key={block.id} content={block} />;
          case 'DatoCmsVideoBlock':
            return <Video key={block.id} content={block} />;
          case 'DatoCmsHighlightEvent':
            return <ListHighlightEvent key={block.id} block={block} context={isHomepage ? context : null} />;
          case 'DatoCmsHighlightTool':
            return <HighlightTools key={block.id} block={block} />;
          case 'DatoCmsTextHubspotForm':
            return <FormBlock key={block.id} block={block} isHomepage={isHomepage} />;
          case 'DatoCmsShare':
            return <Share key={block.id} block={block} />;
          case 'DatoCmsImage':
            return <ImageWrapper key={block.id} image={block.image} />;
          case 'DatoCmsEmbedIframe':
            return <EmbedIframe key={block.id} content={block} />;
          case 'DatoCmsBlockCta':
            const alignment: Record<string, string> = {
              left: 'flex-start',
              center: 'center',
              right: 'flex-end',
            };

            return (
              <div
                key={block.id}
                style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: block.alignment ? alignment[block.alignment] : '',
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
};

export default Blocks;
