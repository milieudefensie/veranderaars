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

  const handleOnPlayVideo = () => setIsFullScreen(true);
  const handleOnCloseVideo = () => setIsFullScreen(false);

  const getYoutubeVideoSrc = () => {
    const url = video?.url ?? video.source?.url;
    const videoId = url?.match(/[?&]v=([^&]+)/)?.[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  const getVideoThumbnail = () => {
    return video.source ? { url: video.source.thumbnailUrl } : { url: video?.thumbnailUrl };
  };

  return (
    <div className="video-player">
      {isFullScreen ? (
        <div className="fullscreen">
          <span onClick={handleOnCloseVideo}>X</span>
          <iframe src={getYoutubeVideoSrc()} />
        </div>
      ) : (
        <div className="thumbnail" onClick={handleOnPlayVideo}>
          <ImageWrapper image={getVideoThumbnail()} />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
