import React from 'react';
import GroupCard from './GroupCard';
import ListPaginated from '../../Global/Pagination/ListPaginated';

import './styles.scss';

const ListGroupBlock = ({ items = [], withPagination = false, redirectToWhatsappGroup = false }) => {
  if (withPagination) {
    return (
      <div className={`pb-5`} id="groups-list">
        <div className="row gy-4">
          <ListPaginated
            list={items}
            customPageSize={10}
            renderItem={(item) => (
              <div className="col-lg-4" key={item.id}>
                <GroupCard group={item} redirectToWhatsappGroup={redirectToWhatsappGroup} />
              </div>
            )}
            extraLogic={() => {
              const targetElement = document.getElementById('groups-list');

              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`pb-5`} id="groups-list">
      <div className="row gy-4">
        {items.map((item) => (
          <div className="col-lg-4" key={item.id}>
            <GroupCard group={item} redirectToWhatsappGroup={redirectToWhatsappGroup} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListGroupBlock;
