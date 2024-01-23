import React, { useState } from 'react';
import EventCard from '../../Blocks/HighlightEvent/EventCard';
import Dropdown from '../Inputs/Dropdown/Dropdown';
import CtaHandler from '../Cta/CtaHandler';
import ListPaginated from '../Pagination/ListPaginated';
import { MapCountry } from '../../../utils';

import './styles.scss';

const FilterEvents = ({ events = [], locations, handleOnApplyNewFilters }) => {
  const [location, setLocation] = useState(null);
  const [typeOfEvent, setTypeOfEvent] = useState(null);

  const locationsValues = [
    { label: 'All', value: 'All' },
    { label: 'Online', value: 'online' },
    ...locations
      .filter((l) => l)
      .map((l) => {
        return { label: MapCountry[l] ? MapCountry[l] : l, value: l };
      })
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];

  const eventsType = [
    { label: 'All', value: 'All' },
    { label: 'Training', value: 'training' },
    { label: 'Actie', value: 'actie' },
    { label: 'Leden', value: 'leden' },
    { label: 'Gezellig', value: 'gezellig' },
    { label: 'Organiseren', value: 'organiseren' },
  ];

  const handleFilter = () => {
    handleOnApplyNewFilters({ location, typeOfEvent });
  };

  return (
    <div className="filter-events-wrapper" id="filter-events-list">
      <div className="filters">
        <Dropdown title="Locaties" options={locationsValues} onSelect={(value) => setLocation(value)} />
        <Dropdown title="Soort evenement" options={eventsType} onSelect={(value) => setTypeOfEvent(value)} />

        <CtaHandler title="Apply Filter" variant="fill-green" handleOnClick={handleFilter} />
      </div>

      <div>
        {events.length > 0 ? (
          <ListPaginated
            list={events}
            customPageSize={10}
            renderItem={(item) => <EventCard event={item} key={item.id} />}
            extraLogic={() => {
              const targetElement = document.getElementById('filter-events-list');

              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        ) : (
          <h5>No events found.</h5>
        )}
      </div>
    </div>
  );
};

export default FilterEvents;
