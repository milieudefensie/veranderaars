import React from 'react';
import { renderNodeRule, StructuredText } from 'react-datocms';
import { isHeading, isParagraph, isLink } from 'datocms-structured-text-utils';
import ImageWrapper from '../../Global/Image/image-wrapper';
import Accordion from '../Accordion/accordion';
import EmbedIframe from '../../Blocks/EmbedIframe/embed-iframe';
import Video from '../Video/video';
import Table from '../Table/table';
import NarrativeBlock from '../NarrativeBlock/narrative-block';
import ListHighlightEvent from '../HighlightEvent/list-highlight-event';
import HighlightTools from '../HighlightTools/highlight-tools';
import FormBlock from '../FormBlock/form-block';
import Cta from '../../Global/Cta/cta';
import SimpleText from '../SimpleText/simple-text';
import Share from '../Share/share';
import CountDown from '../Countdown/countdown';
import BlockCtaList from '../CtaList/cta-list';
import BlockCtaIconsList from '../CtaIconsList/cta-icons-list';
import ImageGallery from '../ImageGallery/image-gallery';
import Columns from '../Columns/columns';
import MapFilter from '../MapFilter/map-filter';

interface StructuredTextDefaultProps {
  content: any;
}

const StructuredTextDefault: React.FC<StructuredTextDefaultProps> = ({ content }) => {
  if (!content || !content.value) return null;

  return (
    <StructuredText
      data={content}
      renderBlock={({ record }) => {
        switch (record.__typename) {
          case 'DatoCmsNarrativeBlock':
            return <NarrativeBlock block={record} key={record.id} />;
          case 'DatoCmsHighlightEvent':
            return <ListHighlightEvent block={record} key={record.id} />;
          case 'DatoCmsHighlightTool':
            return <HighlightTools block={record} key={record.id} />;
          case 'DatoCmsTextHubspotForm':
            return <FormBlock block={record} key={record.id} />;
          case 'DatoCmsTable':
            return <Table key={record.id} content={record} />;
          case 'DatoCmsShare':
            return <Share key={record.id} block={record} />;
          case 'DatoCmsImage':
            return <ImageWrapper image={record.image} key={record.id} />;
          case 'DatoCmsEmbedIframe':
            return <EmbedIframe content={record} key={record.id} />;
          case 'DatoCmsTableBlock':
            return <Table content={record} key={record.id} />;
          case 'DatoCmsVideoBlock':
            return <Video content={record} key={record.id} />;
          case 'DatoCmsAcordion':
            return <Accordion variant={record.colorVariant} items={record.items} key={record.id} />;
          case 'DatoCmsSimpleText':
            return <SimpleText key={record.id} block={record} />;
          case 'DatoCmsBlockCta':
            const alignment: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };

            return (
              <div
                key={record.id}
                style={{ display: 'flex', justifyContent: record?.alignment ? alignment[record.alignment] : '' }}
              >
                <Cta cta={record} />
              </div>
            );

          case 'DatoCmsCountdown':
            return <CountDown key={record.id} block={record} />;
          case 'DatoCmsCtaList':
            return <BlockCtaList key={record.id} block={record} />;
          case 'DatoCmsCtaIconsList':
            return <BlockCtaIconsList key={record.id} block={record} />;
          case 'DatoCmsImageGallery':
            return <ImageGallery key={record.id} block={record} />;
          case 'DatoCmsColumn':
            return <Columns key={record.id} block={record} />;
          case 'DatoCmsMap':
            return <MapFilter key={record.id} block={record} />;

          default:
            return null;
        }
      }}
      customNodeRules={[
        renderNodeRule(isParagraph, ({ adapter: { renderNode }, node, children }) => {
          return renderNode('p', { className: 'ui-text' }, children);
        }),
        renderNodeRule(isHeading, ({ adapter: { renderNode }, node, children }) => {
          return renderNode(`h${node.level}`, { className: 'ui-heading' }, children);
        }),
        renderNodeRule(isLink, ({ adapter: { renderNode }, node, children }) => {
          const { url, target, rel } = node;
          return renderNode(
            'a',
            {
              className: 'ui-link',
              href: url,
              target: target || '_self',
              rel: rel || 'noopener noreferrer',
            },
            children
          );
        }),
      ]}
    />
  );
};

export default StructuredTextDefault;
