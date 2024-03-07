import React from 'react';
import { StructuredText } from 'react-datocms';
import ImageWrapper from '../../Global/Image/ImageWrapper';
import Accordion from '../../Blocks/Accordion/Accordion';
import EmbedIframe from '../../Blocks/EmbedIframe/EmbedIframe';
import Video from '../Video/Video';
import Table from '../Table/Table';
import NarrativeBlock from '../NarrativeBlock/NarrativeBlock';
import ListHighlightEvent from '../HighlightEvent/ListHighlightEvent';
import HighlightTools from '../HighlightTools/HighlightTools';
import FormBlock from '../FormBlock/FormBlock';
import Cta from '../../Global/Cta/Cta';
import SimpleText from '../SimpleText/SimpleText';
import Share from '../Share/Share';

const StructuredTextDefault = ({ content }) => {
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
            return <Accordion items={record.items} key={record.id} />;
          case 'DatoCmsSimpleText':
            return <SimpleText key={record.id} block={record} />;
          case 'DatoCmsCta':
            return <Cta cta={record} key={record.id} />;

          default:
            return null;
        }
      }}
    />
  );
};

export default StructuredTextDefault;
