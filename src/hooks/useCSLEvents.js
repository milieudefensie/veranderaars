import { useState, useEffect } from 'react';
import { extractNumericHour, formatCslEvents } from '../utils';
import { DateTime } from 'luxon';

function useCSLEvents(cmsEvents, cslEvents) {
  const [mergedEvents, setMergedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setStatus('loading');

    const mappedCSL = cslEvents.map(formatCslEvents);

    const currentDateTime = DateTime.now().setZone('Europe/Amsterdam');
    const events = [...cmsEvents, ...mappedCSL]
      .map((e) => {
        const isCSLEvent = e.type === 'CSL';
        let startDateWithHour = null;
        let endDateWithHour = null;

        if (isCSLEvent) {
          // Set start date
          startDateWithHour = e.startInZone ? DateTime.fromFormat(e.startInZone, "yyyy-MM-dd'T'HH:mm:ssZZ") : null;
          // Set end date
          endDateWithHour = e.endInZone
            ? DateTime.fromFormat(e.endInZone, "yyyy-MM-dd'T'HH:mm:ssZZ")
            : startDateWithHour;
        } else {
          // Set start date
          const cleanHourStart = typeof e.hourStart === 'string' ? extractNumericHour(e.hourStart) : '00:00';
          startDateWithHour = DateTime.fromFormat(`${e.rawDate} ${cleanHourStart}`, 'yyyy-MM-dd HH:mm').setZone(
            'Europe/Amsterdam'
          );

          // Set end date
          const cleanHourEnd = typeof e.hourEnd === 'string' ? extractNumericHour(e.hourEnd) : '23:59';
          endDateWithHour = DateTime.fromFormat(`${e.rawDate} ${cleanHourEnd}`, 'yyyy-MM-dd HH:mm').setZone(
            'Europe/Amsterdam'
          );
        }

        return { ...e, startDateToCompare: startDateWithHour, endDateToCompare: endDateWithHour };
      })
      .filter((e) => {
        if (!e.startDateToCompare?.isValid || !e.endDateToCompare?.isValid) {
          // console.log(`Invalid date:`, e);
          return false;
        }

        return (
          e.startDateToCompare > currentDateTime ||
          (e.startDateToCompare <= currentDateTime && e.endDateToCompare >= currentDateTime)
        );
      })
      .sort((a, b) => {
        return a.startDateToCompare - b.startDateToCompare;
      });

    const uniqueEvents = [];
    const slugsSeen = new Set();
    events.forEach((event) => {
      if (!slugsSeen.has(event.slug)) {
        slugsSeen.add(event.slug);
        uniqueEvents.push(event);
      }
    });

    const uniqueLocations = [...new Set(uniqueEvents.map((event) => event.region))];

    setMergedEvents(uniqueEvents);
    setFilteredEvents(uniqueEvents);
    setLocationOptions(uniqueLocations);
    setStatus('success');
  }, []);

  return { mergedEvents, setFilteredEvents, filteredEvents, locationOptions, status };
}

export default useCSLEvents;
