import React, { useState } from 'react';
import ImageWrapper from '../Image/image-wrapper';

import './index.scss';

type Video = {
  url?: string;
  source?: {
    url: string;
    thumbnailUrl: string;
  };
  thumbnailUrl?: string;
};

export type VideoPlayerProps = {
  video: Video;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const handleOnPlayVideo = () => setIsFullScreen(true);
  const handleOnCloseVideo = () => {
    setIsFullScreen(false);
    setIframeError(false);
  };

  const getYoutubeVideoSrc = () => {
    const url = video?.url ?? video.source?.url;
    if (!url) return '';

    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    const videoId = match?.[1];

    const embedUrl = videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&origin=${window.location.origin}`
      : '';

    return embedUrl;
  };

  const getVideoThumbnail = () => {
    return video.source ? { url: video.source.thumbnailUrl } : { url: video?.thumbnailUrl };
  };

  const handleIframeError = () => {
    setIframeError(true);
    console.error('Error loading YouTube video');
  };

  return (
    <div className="video-player">
      {isFullScreen ? (
        <div className="fullscreen">
          <span onClick={handleOnCloseVideo} className="close-button" aria-label="Close video">
            X
          </span>
          {iframeError ? (
            <div className="error-message">
              <p>The video could not be loaded. Please try again later.</p>
              <a
                href={video?.url ?? video.source?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="fallback-link"
              >
                Watch on YouTube
              </a>
            </div>
          ) : (
            <iframe
              src={getYoutubeVideoSrc()}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onError={handleIframeError}
              className="video-iframe"
            />
          )}
        </div>
      ) : (
        <div
          className="thumbnail"
          onClick={handleOnPlayVideo}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleOnPlayVideo()}
          aria-label="Play video"
        >
          <ImageWrapper image={getVideoThumbnail()} />
          <div className="play-overlay">
            <svg className="play-icon" viewBox="0 0 68 48" width="68" height="48">
              <path
                d="M66.52,7.74c-0.78-2.93-3.07-5.23-6.01-6.01C55.04,0.13,34,0,34,0S13.96,0.13,8.49,1.73 c-2.94,0.78-5.23,3.08-6.01,6.01C0.88,13.21,1,24,1,24s-0.12,10.79,1.48,16.26c0.78,2.93,3.07,5.23,6.01,6.01 C13.96,47.87,34,48,34,48s20.04-0.13,25.51-1.73c2.94-0.78,5.23-3.08,6.01-6.01C67.12,34.79,67,24,67,24 S67.12,13.21,66.52,7.74z"
                fill="#FF0000"
              />
              <path d="M27,34l18-10L27,14V34z" fill="#FFFFFF" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
