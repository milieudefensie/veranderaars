import { useState, useEffect } from 'react';
import { convertTime, formatDate } from '../utils';

function useCSLEvents(cmsEvents, cslEvents) {
  const [mergedEvents, setMergedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setStatus('loading');

    const mappedCSL = [...cslEvents].map((e) => ({
      id: e.slug.replace(' ', '_'),
      address: e.location?.query,
      coordinates: { latitude: e.location?.latitude, longitude: e.location?.longitude },
      region: e.location?.region,
      rawDate: e.start_at,
      date: formatDate(e.start_at),
      hourStart: convertTime(e.start_at),
      hourEnd: e.end_at ? convertTime(e.end_at) : null,
      introduction: e.description,
      slug: e.slug,
      url: e.url,
      title: e.title,
      image: { url: e.image_url },
      labels: e.labels || [],
      type: e.type,
      model: e.model,
    }));

    // Get only future events
    const temEvents = [...cmsEvents, ...mappedCSL];

    const events = temEvents.sort((a, b) => {
      const dateA = new Date(a.rawDate);
      const dateB = new Date(b.rawDate);

      return dateA - dateB;
    });

    const uniqueLocations = [...new Set(events.map((event) => event.region))];

    setMergedEvents(events);
    setFilteredEvents(events);
    setLocationOptions(uniqueLocations);
    setStatus('success');
  }, []);

  return { mergedEvents, setFilteredEvents, filteredEvents, locationOptions, status };
}

export default useCSLEvents;
