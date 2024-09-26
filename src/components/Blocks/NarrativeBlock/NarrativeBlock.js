import React from 'react';
import { isArray } from '../../../utils';
import CtaList from '../../Global/Cta/CtaList';
import ImageWrapper from '../../Global/Image/ImageWrapper';
import VideoPlayer from '../../Global/VideoPlayer/VideoPlayer';

import './index.scss';

export default function NarrativeBlock({ block, anchor = null }) {
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
  const backgroundImageUrl = hasBackgroundImage ? backgroundImage.gatsbyImageData.images.fallback.src : '';

  return (
    <div
      className={`component-narrative-block ${backgroundColor ? backgroundColor : ''}`}
      id={`section-${anchor}`}
      style={hasBackgroundImage ? { backgroundImage: `url(${backgroundImageUrl})` } : {}}
    >
      <div className={`container`}>
        <div className={`row ${alignment === 'left' ? 'flex-row-reverse' : ''} align-items-center`}>
          <div className={`col-lg-7 main-content`}>
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

          {/* Render image  */}
          {(image || video) && (
            <div className={`img-wrapper-nb col-lg-5`}>
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
    </div>
  );
}
