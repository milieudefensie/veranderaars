import React from 'react'; // @ts-expect-error
import { isArray } from '../../../utils';
import CtaList from '../../Global/Cta/cta-list';
import ImageWrapper from '../../Global/Image/image-wrapper';
import VideoPlayer from '../../Global/VideoPlayer/video-player';

import './index.scss';

interface ImageData {
  url: string;
  alt?: string;
  gatsbyImageData?: {
    images: {
      fallback?: {
        src: string;
      };
    };
  };
}

interface Cta {
  id: string;
  title: string;
  url: string;
  [key: string]: any;
}

interface Video {
  id?: string;
  url: string;
  provider?: string;
  [key: string]: any;
}

interface NarrativeBlockProps {
  block: {
    alignment?: 'left' | 'right';
    preTitle?: string;
    title?: string;
    textContent?: string;
    ctas?: Cta[] | null;
    image?: ImageData;
    imageMobile?: ImageData;
    backgroundImage?: ImageData;
    logo?: ImageData;
    video?: Video;
    backgroundColor?: string;
  };
  anchor?: string | null;
}

const NarrativeBlock: React.FC<NarrativeBlockProps> = ({ block, anchor = null }) => {
  const {
    alignment,
    preTitle,
    title,
    textContent,
    ctas,
    image,
    imageMobile,
    backgroundImage,
    logo,
    video,
    backgroundColor,
  } = block;

  const hasBackgroundImage = Boolean(backgroundImage);
  const backgroundImageUrl =
    hasBackgroundImage && backgroundImage?.gatsbyImageData?.images?.fallback?.src
      ? backgroundImage.gatsbyImageData.images.fallback.src
      : '';

  return (
    <div
      className={`component-narrative-block ${backgroundColor || ''}`}
      id={`section-${anchor ?? ''}`}
      style={hasBackgroundImage ? { backgroundImage: `url(${backgroundImageUrl})` } : {}}
    >
      <div className={`row ${alignment === 'left' ? 'flex-row-reverse' : ''} align-items-center`}>
        <div className="col-lg-7 nb-content">
          {logo && <img className="logo" src={logo.url} alt={logo.alt ?? 'Logo icon'} />}

          <h2>
            {preTitle && <span>{preTitle}</span>}
            {title && <span>{title}</span>}
          </h2>

          {textContent && (
            <div
              className={`text-content ${!isArray(ctas) ? 'mb-0' : ''}`}
              dangerouslySetInnerHTML={{ __html: textContent }}
            />
          )}

          {isArray(ctas) && <CtaList ctas={ctas} customVariant="custom-btn-primary" />}
        </div>

        {(image || video) && (
          <div className="img-wrapper-nb col-lg-5">
            {video ? (
              <VideoPlayer video={video} />
            ) : image ? (
              <div>
                <ImageWrapper image={image} imageMobile={imageMobile} objectFit="contain" />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default NarrativeBlock;
