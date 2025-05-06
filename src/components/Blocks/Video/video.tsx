import React from 'react';
import VideoPlayer from '../../Global/VideoPlayer/video-player';

interface VideoProps {
  content: {
    video: string;
  };
}

const Video: React.FC<VideoProps> = ({ content }) => {
  return <VideoPlayer video={content?.video} />;
};

export default Video;
