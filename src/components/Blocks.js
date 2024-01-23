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

export default function Blocks({ blocks, usePrimaryHeading = false }) {
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
            return <Video key={block.id} content={block} withContainer />;
          case 'DatoCmsHighlightEvent':
            return <ListHighlightEvent key={block.id} block={block} />;
          case 'DatoCmsHighlightTool':
            return <HighlightTools key={block.id} block={block} />;
          case 'DatoCmsTextHubspotForm':
            return <FormBlock key={block.id} block={block} />;
          case 'DatoCmsShare':
            return <Share key={block.id} block={block} />;

          default:
            return null;
        }
      })}
    </>
  );
}
