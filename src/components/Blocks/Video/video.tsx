import React from 'react';
import VideoPlayer, { VideoPlayerProps } from '../../Global/VideoPlayer/video-player';

interface VideoProps {
  content: VideoPlayerProps;
}

const Video: React.FC<VideoProps> = ({ content }) => {
  return <VideoPlayer video={content?.video} />;
};

export default Video;
