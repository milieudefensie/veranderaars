import React from 'react';
import VideoPlayer from '../../Global/VideoPlayer/VideoPlayer';

function Video({ content }) {
  return <VideoPlayer video={content?.video} />;
}

export default Video;
