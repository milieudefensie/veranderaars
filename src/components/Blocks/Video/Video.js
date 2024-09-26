import React from 'react';
import VideoPlayer from '../../Global/VideoPlayer/VideoPlayer';

function Video({ content, withContainer = false }) {
  return (
    <div className={`${withContainer ? 'container' : ''}`}>
      <VideoPlayer video={content?.video} />
    </div>
  );
}

export default Video;
