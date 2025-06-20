import React from 'react';

const GroupMarker: React.FC = () => {
  return (
    <div className="custom-marker">
      <style scoped>
        {`
          .custom-marker:hover svg path {
            fill: #000;
          }

          .custom-marker:hover svg g path {
            fill: #FFF;
          }

          .custom-marker:hover {
            cursor: pointer;
          }
        `}
      </style>

      <svg width="42" height="54" viewBox="0 0 42 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M23.8546 52.0439L23.8555 52.0427C26.5327 48.7745 30.9302 43.1726 34.661 37.2691C36.5262 34.3175 38.2311 31.2807 39.4711 28.4153C40.7074 25.5586 41.5 22.8311 41.5 20.5099C41.5 9.44694 32.306 0.5 21 0.5C9.68979 0.5 0.5 9.447 0.5 20.5099C0.5 22.8304 1.28632 25.5574 2.5153 28.4143C3.74792 31.2797 5.44396 34.3166 7.30351 37.2685C11.0224 43.1718 15.4197 48.7736 18.1462 52.0449C19.6277 53.8412 22.3736 53.8409 23.8546 52.0439Z"
          fill="#FFA300"
          stroke="black"
        />
        <g clipPath="url(#clip0_241_4724)">
          <path d="M15.2171 12.9783H11V23.2186H15.2171V12.9783Z" fill="black" />
          <path d="M20.5067 12.975H16.2896V23.2154H20.5067V12.975Z" fill="black" />
          <path d="M25.7772 12.975H21.5601V23.2154H25.7772V12.975Z" fill="black" />
          <path d="M30.9998 12.9768H26.7827V23.2171H30.9998V12.9768Z" fill="black" />
          <path d="M25.2837 30.9358V25.2645H11.002V30.9358H25.2837Z" fill="black" />
        </g>
      </svg>
    </div>
  );
};

export default GroupMarker;
