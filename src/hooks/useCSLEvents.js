import { useState, useEffect } from 'react';
import { convertTime, formatDateAsYYMMDD } from '../utils';
import axios from 'axios';

function useCSLEvents(cmsEvents) {
  const [mergedEvents, setMergedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    async function fetchEvents() {
      setStatus('loading');

      try {
        // Check if we have the data in local storage (5 minutes delay)
        if (localStorage.getItem('events')) {
          const rawEvents = localStorage.getItem('events');
          const parsedEvents = JSON.parse(rawEvents);

          const currentTime = new Date();
          const lastExecutionDate = new Date(parsedEvents.date);
          const timeDifference = (currentTime - lastExecutionDate) / (1000 * 60);

          // Check if have passed 5 minutes, if so, fetch data for request and not from storage
          if (timeDifference <= 5) {
            const cachedEvents = parsedEvents.data;

            setMergedEvents(cachedEvents);
            setFilteredEvents(cachedEvents);
            setLocationOptions([...new Set(cachedEvents.map((event) => event.region))]);

            setStatus('success');
            return;
          } else {
            localStorage.removeItem('events');
          }
        }

        const response = await axios.get('/api/events');
        const fetchedEvents = response.data.events[0].list;

        const mappedCSL = fetchedEvents
          .filter((e) => !e.cancelled_at)
          .map((e) => ({
            id: e.slug.replace(' ', '_'),
            address: e.location?.query,
            coordinates: { latitude: e.location?.latitude, longitude: e.location?.longitude },
            region: e.location?.region,
            rawDate: e.start_at,
            date: formatDateAsYYMMDD(e.start_at),
            hourStart: convertTime(e.start_at),
            hourEnd: e.end_at ? convertTime(e.end_at) : null,
            introduction: e.description,
            slug: e.slug,
            url: e.url,
            title: e.title,
            image: { url: e.image_url },
            type: 'INTERNATIONAL',
            labels: e.labels || [],
          }));

        // Get only future events
        const currentDate = new Date();
        const temEvents = [...cmsEvents, ...mappedCSL].filter((event) => {
          const eventDate = new Date(event.rawDate);
          return eventDate > currentDate;
          // return true;
        });

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

        // Save on storage for caching
        localStorage.setItem('events', JSON.stringify({ date: new Date().getTime(), data: events }));
      } catch (error) {
        console.error('Error fetching events:', error);
        setStatus('error');
      }
    }

    fetchEvents();
  }, []);

  return { mergedEvents, setFilteredEvents, filteredEvents, locationOptions, status };
}

export default useCSLEvents;
