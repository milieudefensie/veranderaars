import React, { useState } from 'react';
import EventCard from '../../Blocks/HighlightEvent/EventCard';
import Dropdown from '../Inputs/Dropdown/Dropdown';
import TextInput from '../Inputs/TextInput/TextInput';
import ListPaginated from '../Pagination/ListPaginated';
import { MapCountry } from '../../../utils';

import './styles.scss';

const FilterEvents = ({ events = [], locations, handleOnApplyNewFilters }) => {
  const [filterApplied, setFilterApplied] = useState(false);

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

  return (
    <div className="filter-events-wrapper" id="filter-events-list">
      <div className="filters">
        <TextInput
          label="Description"
          name="description"
          onChange={(value) => {
            handleOnApplyNewFilters({ description: value });
            setFilterApplied((prev) => !prev);
          }}
        />
        <Dropdown
          title="Locaties"
          options={locationsValues}
          onSelect={(value) => {
            handleOnApplyNewFilters({ location: value });
            setFilterApplied((prev) => !prev);
          }}
        />
        <Dropdown
          title="Soort evenement"
          options={eventsType}
          onSelect={(value) => {
            handleOnApplyNewFilters({ typeOfEvent: value });
            setFilterApplied((prev) => !prev);
          }}
        />
      </div>

      <div>
        {events.length > 0 ? (
          <ListPaginated
            list={events}
            customPageSize={10}
            resetPage={filterApplied}
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
