import React, { useState } from 'react';
import EventCard from '../../Blocks/HighlightEvent/event-card';
import Dropdown from '../Inputs/Dropdown/dropdown';
import TextInput from '../Inputs/TextInput/text-input';
import ListPaginated from '../Pagination/list-paginated';
import { MapCountry } from '../../../utils';
import searchIcon from '../../Icons/search-icon.svg';

import './styles.scss';

interface Event {
  id: string;
  description: string;
  location: string;
  typeOfEvent: string;
}

interface FilterEventsProps {
  events: Event[];
  locations: string[];
  handleOnApplyNewFilters: (filters: { [key: string]: string }) => void;
}

const FilterEvents: React.FC<FilterEventsProps> = ({ events = [], locations, handleOnApplyNewFilters }) => {
  const [filterApplied, setFilterApplied] = useState(false);

  const locationsValues = [
    { label: 'Alles', value: 'All' },
    { label: 'Online', value: 'online' },
    ...locations
      .filter((l) => l)
      .map((l) => {
        return { label: MapCountry[l] ? MapCountry[l] : l, value: l };
      })
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];

  const eventsType = [
    { label: 'Alles', value: 'All' },
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
          label="Zoeken"
          name="description"
          icon={searchIcon}
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
