import { on } from 'events';
import { DateTime } from 'luxon';
import React from 'react';

export const pathToModel = (model = null, slug = '') => {
  if (model === 'basicPage') {
    return `/${slug}`;
  } else if (model === 'event') {
    return `/agenda/${slug}`;
  } else if (model === 'ExternalEvent') {
    return `/lokaal/${slug}`;
  } else if (model === 'tool') {
    return `/toolkit/${slug}`;
  } else if (model === 'group') {
    return `/groep/${slug}`;
  } else {
    return `/${slug}`;
  }
};

export const isArray = (array) => {
  return Array.isArray(array) && array.length > 0;
};

export const getCtaUrl = (cta) => {
  if (typeof cta === 'string') {
    return '/' + cta;
  }

  if (cta.model) {
    const { apiKey: model } = cta.model;
    return pathToModel(model, cta.slug);
  }

  if (cta.content?.model) {
    const { apiKey: model } = cta.content?.model;
    return pathToModel(model, cta.content?.slug);
  }

  if (cta.link?.content?.model) {
    const { apiKey: model } = cta.link?.content?.model;
    return pathToModel(model, cta.link?.content?.slug);
  }

  if (cta.content?.slug) {
    return `/${cta.content.slug}`;
  }

  if (cta.slug) {
    if (cta.__typename === 'ExternalEvent') {
      return `/lokaal/${cta.slug}`;
    }

    return `/${cta.slug}`;
  }

  const url = cta.link?.content ? '/' + cta.link?.content?.slug : cta.link?.url;
  return url;
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const cleanLocation = (location) => {
  if (!location) return '';
  return location.endsWith(', Nederland') ? location.slice(0, -', Nederland'.length) : location;
};

export const formatDate = (rawDate, includeDay = false) => {
  if (!rawDate) {
    return 'Invalid date';
  }

  const date = DateTime.fromJSDate(new Date(rawDate)).setZone('Europe/Amsterdam').setLocale('nl');
  const today = DateTime.now().setZone('Europe/Amsterdam').setLocale('nl');
  const tomorrow = today.plus({ days: 1 });

  if (date.hasSame(today, 'day')) {
    return 'Vandaag';
  } else if (date.hasSame(tomorrow, 'day')) {
    return 'Morgen';
  } else {
    if (date.year === today.year) {
      if (includeDay) {
        return capitalizeFirstLetter(date.toFormat('cccc dd LLL'));
      }
      return date.toLocaleString({ month: 'short', day: '2-digit' }).replace('-', ' ');
    }

    if (includeDay) {
      return capitalizeFirstLetter(date.toFormat('cccc dd LLL yyyy'));
    }
    return date.toLocaleString({ year: 'numeric', month: 'short', day: '2-digit' });
  }
};

export const extractNumericHour = (hourString) => {
  const match = hourString.match(/\d{1,2}\.\d{2}|\d{1,2}:\d{2}/);
  const hour = match ? match[0].replace('.', ':') : '23:59';
  return hour;
};

export const formatDateCSL = (rawDate) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/;
  if (!regex.test(rawDate)) {
    return rawDate;
  }

  const time = rawDate.substring(11, 16);
  return time;
};

export const formatDateWithTimeCSL = (dateStr, hourStr, endDate, endHourStr) => {
  const now = DateTime.local().setLocale('nl');
  let dt = DateTime.fromISO(hourStr || dateStr, { locale: 'nl' });

  let dtEnd = endHourStr
    ? DateTime.fromISO(endHourStr, { locale: 'nl' })
    : endDate
      ? DateTime.fromISO(endDate, { locale: 'nl' })
      : null;

  const time = hourStr ? formatDateCSL(hourStr) : '';
  const endTime = endHourStr ? formatDateCSL(endHourStr) : null;

  const timeRange = dtEnd && endTime ? `${time} - ${endTime}` : time;

  if (dt.hasSame(now, 'day')) {
    return (
      <>
        <strong>Vandaag</strong> {timeRange}
      </>
    );
  }

  if (dt.hasSame(now.plus({ days: 1 }), 'day')) {
    return (
      <>
        <strong>Morgen</strong> {timeRange}
      </>
    );
  }

  const day = dt.toFormat('cccc');
  const dayFormatted = day.charAt(0).toUpperCase() + day.slice(1);
  const d = dt.toFormat('d');
  const llll = dt.toFormat('LLLL');

  return (
    <>
      <strong>
        {dayFormatted} {timeRange}
      </strong>{' '}
      - {d} {llll}
    </>
  );
};

export const formatSimpleDateWithTimeCSL = (dateStr, hourStr, endHourStr) => {
  const now = DateTime.local().setLocale('nl');
  const dt = DateTime.fromISO(dateStr, { locale: 'nl' });

  let dayLabel;
  if (dt.hasSame(now, 'day')) {
    dayLabel = 'Vandaag';
  } else if (dt.hasSame(now.plus({ days: 1 }), 'day')) {
    dayLabel = 'Morgen';
  } else {
    const day = dt.toFormat('cccc');
    dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
  }

  let timePart = '';
  if (hourStr && endHourStr) {
    timePart = `${hourStr} - ${endHourStr} `;
  } else if (hourStr) {
    timePart = `${hourStr} `;
  }

  const datePart = dt.toFormat('d LLLL');

  return (
    <>
      <strong>{dayLabel}</strong> {timePart}- {datePart}
    </>
  );
};

export const compareIfIsFuture = (event) => {
  let eventHourStart = event.hourStart; // Formato: 06:00 | 15:00 | 23:30
  if (eventHourStart.includes('(')) {
    eventHourStart = eventHourStart.substring(0, 5);
  }

  if (event.type === 'CSL') {
    // 2024-03-29T09:00:00Z
    const eventDate = DateTime.fromFormat(`${event.rawDate}`, "yyyy-MM-dd'T'HH:mm:ss'Z'", { zone: 'Europe/Amsterdam' });
    return eventDate >= DateTime.local();
  }

  const eventDate = DateTime.fromFormat(`${event.rawDate} ${eventHourStart}`, 'yyyy-MM-dd HH:mm', {
    zone: 'Europe/Amsterdam',
  });

  return eventDate >= DateTime.local({ zone: 'Europe/Amsterdam' });
};

export const isEventFuture = (event) => {
  let eventDate = DateTime.fromISO(event.rawDate).setZone('Europe/Amsterdam');

  if (event.hourStart) {
    const regex = /\b\d{2}:\d{2}\b/;
    const initialHour = event.hourStart.match(regex);

    if (initialHour) {
      const [hour, minute] = initialHour[0].split(':');
      eventDate = eventDate.set({ hour: Number(hour), minute: Number(minute) });
    }
  }

  const now = DateTime.now().setZone('Europe/Amsterdam');
  const isFuture = eventDate.toMillis() >= now.toMillis();

  return isFuture;
};

export const convertTime = (dateTimeString) => {
  const date = new Date(dateTimeString);

  // Get hours and minutes
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format hours and minutes with leading zeros if necessary
  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  const formattedTime = formattedHours + ':' + formattedMinutes;

  return formattedTime;
};

function stripHtml(html) {
  if (typeof document !== 'undefined') {
    let temporalDivElement = document.createElement('div');
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || '';
  } else {
    return html;
  }
}

export const truncateText = (text, maxLength) => {
  const cleanedText = stripHtml(text);

  if (cleanedText.length <= maxLength) {
    return cleanedText;
  } else {
    return cleanedText.substring(0, maxLength) + '...';
  }
};

export const MapCountry = {
  DR: 'Drenthe',
  FL: 'Flevoland',
  FR: 'Fryslân',
  GE: 'Gelderland',
  GR: 'Groningen',
  LI: 'Limburg',
  NB: 'Noord-Brabant',
  NH: 'Noord-Holland',
  OV: 'Overijssel',
  UT: 'Utrecht',
  ZE: 'Zeeland',
  ZH: 'Zuid-Holland',
};

// Time utils
export function formatRelativeDate(inputDate) {
  const dateFix = new Date(inputDate);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const inputYear = dateFix.getFullYear();
  const inputMonth = dateFix.getMonth();
  const inputDay = dateFix.getDate();

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  const tomorrowYear = tomorrow.getFullYear();
  const tomorrowMonth = tomorrow.getMonth();
  const tomorrowDay = tomorrow.getDate();

  if (inputYear !== todayYear) {
    // Show year if it's a different year
    return `${inputDay} ${getMonthName(inputMonth)} ${inputYear}`;
  } else if (inputMonth === todayMonth && inputDay === todayDay) {
    // Today
    return `Vandaag ${formatTime(dateFix)}`;
  } else if (inputYear === tomorrowYear && inputMonth === tomorrowMonth && inputDay === tomorrowDay) {
    // Tomorrow
    return `Morgen ${formatTime(dateFix)}`;
  } else {
    // Other dates in the same year
    return `${inputDay} ${getMonthName(inputMonth)} ${formatTime(dateFix)}`;
  }
}

function getMonthName(monthIndex) {
  const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'juni', 'juli', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return months[monthIndex];
}

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function convertHour(rawDate) {
  const date = DateTime.fromISO(rawDate).setZone('Europe/Amsterdam');
  const hour = date.toFormat('HH:mm');

  return hour;
}

export const homepageFormIssues = () => {
  const heroWrapper = document.querySelector('#hero-homepage');
  if (!heroWrapper) return;

  const child = heroWrapper.querySelector('.content');
  const childHeight = child.clientHeight;
  const hasErrors = child.querySelectorAll('.hs-error-msgs li').length > 0;

  const nextElement = document.querySelector('#hero-homepage + div, #hero-homepage + section');

  if (nextElement) {
    if (hasErrors) {
      // nextElement.style.paddingTop = `${childHeight - 220}px`;
      // return;
    }

    nextElement.style.paddingTop = `${childHeight - 150}px`;
  }
};

export const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;
  return distancia;
};

export const mapCmsEvents = (allEvents) => {
  return Array.isArray(allEvents.edges)
    ? allEvents.edges.map((raw) => ({
        ...raw.node,
        coordinates: {
          latitude: parseFloat(raw.node.coordinates?.latitude?.toFixed(6)),
          longitude: parseFloat(raw.node.coordinates?.longitude?.toFixed(6)),
        },
        type: 'NATIONAL',
      }))
    : [];
};

export const mapCslEvents = (events) => {
  return Array.isArray(events.edges)
    ? events.edges.map((raw) => ({
        ...raw.node,
        coordinates: {
          latitude: parseFloat(parseFloat(raw.node.location?.latitude).toFixed(6)),
          longitude: parseFloat(parseFloat(raw.node.location?.longitude).toFixed(6)),
        },
        model: { apiKey: 'ExternalEvent' },
        type: 'CSL',
        image: { url: raw.node.image_url },
      }))
    : [];
};

export const formatCslEvents = (e) => {
  if (!e) {
    console.log('NO EVENT');
    return null;
  }
  return {
    id: e.slug.replace(' ', '_'),
    address: e.location?.query,
    location: e.location,
    coordinates: { latitude: e.location?.latitude, longitude: e.location?.longitude },
    region: e.location?.region,
    rawStartDate: e.raw_start,
    rawEndDate: e.raw_end,
    rawDate: e.start_at,
    date: e.start_at ? formatDate(e.start_at) : null,
    hourStart: e.start_at ? convertTime(e.start_at) : null,
    hourEnd: e.end_at ? convertTime(e.end_at) : null,
    startInZone: e.start_in_zone,
    endInZone: e.end_in_zone,
    introduction: e.description,
    slug: e.slug,
    url: e.url,
    title: e.title,
    image: { url: e.image_url },
    labels: e.labels || [],
    type: e.type,
    model: e.model,
    calendar: e.calendar,
    waiting_list_enabled: e.waiting_list_enabled,
    max_attendees_count: e.max_attendees_count,
    model: { apiKey: 'ExternalEvent' },
    type: 'CSL',
    additional_image_sizes_url: e.additional_image_sizes_url,
  };
};

export const detectService = (url) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    const allowedWhatsAppHosts = ['chat.whatsapp.com', 'whatsapp.com', 'whatsapp.net'];
    const allowedSignalHosts = ['signal.org', 'signal.group'];
    const allowedZoomHosts = ['zoom.us', 'us06web.zoom.us'];

    if (allowedWhatsAppHosts.includes(hostname)) {
      return 'WhatsApp';
    } else if (allowedSignalHosts.includes(hostname)) {
      return 'Signal';
    } else if (allowedZoomHosts.includes(hostname)) {
      return 'Zoom';
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

// Agenda date utils
const ZONE = 'Europe/Amsterdam';

function parseCmsEventDate(rawDate, hour, fallback) {
  const cleanHour = typeof hour === 'string' ? extractNumericHour(hour) : fallback;
  return DateTime.fromFormat(`${rawDate} ${cleanHour}`, 'yyyy-MM-dd HH:mm').setZone(ZONE);
}

function parseCslEventDate(dateString) {
  return dateString ? DateTime.fromFormat(dateString, "yyyy-MM-dd'T'HH:mm:ssZZ") : null;
}

function shouldIncludeEvent(event, hiddenSlugs, hideInAgendaPage) {
  if (!hideInAgendaPage) {
    console.log('hide in agenda page');
    return true;
  }
  if (event.type === 'CSL' && hiddenSlugs.includes(event.slug)) {
    console.log('excluding event...');
    return false;
  }

  // console.log({ slug: event.slug, labels: event.labels });
  return !event.labels?.includes('exclude_in_agenda');
}

function dedupeEventsBySlug(events) {
  const slugsSeen = new Set();
  return events.filter((event) => {
    if (slugsSeen.has(event.slug)) return false;
    slugsSeen.add(event.slug);
    return true;
  });
}

export function getCombinedEvents(cmsEvents, cslEvents, hideInAgendaPage = false, slugsOfHiddenCSLEvents = null) {
  const currentDateTime = DateTime.now().setZone(ZONE);
  const hiddenSlugs = slugsOfHiddenCSLEvents ? slugsOfHiddenCSLEvents.split(',') : [];

  const formattedCsl = cslEvents.map(formatCslEvents);

  const combinedEvents = [...cmsEvents, ...formattedCsl]
    .filter((event) => shouldIncludeEvent(event, hiddenSlugs, hideInAgendaPage))
    .map((event) => {
      let startDate, endDate;

      if (event.type === 'CSL') {
        startDate = parseCslEventDate(event.startInZone);
        endDate = parseCslEventDate(event.endInZone) || startDate;
      } else {
        startDate = parseCmsEventDate(event.rawDate, event.hourStart, '00:00');
        endDate = parseCmsEventDate(event.rawDate, event.hourEnd, '23:59');
      }

      return { ...event, startDateToCompare: startDate, endDateToCompare: endDate };
    })
    .filter((event) => {
      const { startDateToCompare, endDateToCompare } = event;
      if (!startDateToCompare?.isValid || !endDateToCompare?.isValid) {
        console.log('hide');
        return false;
      }
      return (
        startDateToCompare > currentDateTime ||
        (startDateToCompare <= currentDateTime && endDateToCompare >= currentDateTime)
      );
    })
    .sort((a, b) => {
      const dateA = DateTime.fromISO(a.startDateToCompare, { zone: ZONE });
      const dateB = DateTime.fromISO(b.startDateToCompare, { zone: ZONE });
      return dateA.toMillis() - dateB.toMillis();
    });

  return dedupeEventsBySlug(combinedEvents);
}

function getEventsInRange(events, startDate, endDate) {
  return events
    .filter((event) => {
      const eventDate = DateTime.fromISO(event.startDateToCompare, { zone: ZONE });
      return eventDate >= startDate && eventDate <= endDate;
    })
    .sort((a, b) => {
      const dateA = DateTime.fromISO(a.startDateToCompare, { zone: ZONE });
      const dateB = DateTime.fromISO(b.startDateToCompare, { zone: ZONE });
      return dateA.toMillis() - dateB.toMillis();
    });
}

export function getEventsToday(events) {
  const now = DateTime.now().setZone(ZONE);
  const start = now.startOf('day');
  const end = now.endOf('day');
  return getEventsInRange(events, start, end);
}

export function getEventsTomorrow(events) {
  const tomorrow = DateTime.now().setZone(ZONE).plus({ days: 1 });
  const start = tomorrow.startOf('day');
  const end = tomorrow.endOf('day');
  return getEventsInRange(events, start, end);
}

export function getEventsDayAfterTomorrow(events) {
  const dayAfterTomorrow = DateTime.now().setZone(ZONE).plus({ days: 2 });
  const start = dayAfterTomorrow.startOf('day');
  const end = dayAfterTomorrow.endOf('day');
  return getEventsInRange(events, start, end);
}

export function getEventsRestOfWeek(events) {
  const today = DateTime.now().setZone(ZONE);
  const start = today.plus({ days: 3 }).startOf('day');
  const end = today.endOf('week');
  return getEventsInRange(events, start, end);
}

export function getEventsNextWeek(events) {
  const today = DateTime.now().setZone(ZONE);
  const start = today.plus({ weeks: 1 }).startOf('week');
  const end = today.plus({ weeks: 1 }).endOf('week');
  return getEventsInRange(events, start, end);
}

export function getEventsRestOfMonth(events) {
  const today = DateTime.now().setZone(ZONE);
  const endOfThisWeek = today.endOf('week');
  const endOfNextWeek = today.plus({ weeks: 1 }).endOf('week');
  const start = endOfNextWeek.plus({ days: 1 }).startOf('day');
  const end = today.endOf('month');
  return getEventsInRange(events, start, end);
}

export function getWeekendEvents(events) {
  const today = DateTime.now().setZone(ZONE);
  const saturday = today.endOf('week').minus({ days: 1 }).startOf('day');
  const sunday = today.endOf('week').startOf('day');
  const end = today.endOf('week').endOf('day');
  return getEventsInRange(events, saturday, end);
}

export function getEventsWeekDays(events, fromDayOffset, toDayOffset) {
  const today = DateTime.now().setZone(ZONE);
  const start = today.plus({ days: fromDayOffset }).startOf('day');
  const end = today.plus({ days: toDayOffset }).endOf('day');
  return getEventsInRange(events, start, end);
}

export function getEventsGroupedByFutureMonths(events) {
  const now = DateTime.now().setZone(ZONE).endOf('month');
  const futureEvents = events.filter((event) => {
    const date = event.type === 'CSL' ? event.rawDate : event.date;
    const eventDate = DateTime.fromISO(date).setZone(ZONE);
    return eventDate > now;
  });

  const grouped = futureEvents.reduce((acc, event) => {
    const date = event.type === 'CSL' ? event.rawDate : event.date;
    const eventDate = DateTime.fromISO(date).setZone(ZONE);
    const monthKey = eventDate.toFormat('yyyy-MM'); // e.g., "2025-05"
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(event);
    return acc;
  }, {});

  return grouped;
}

export function getDayAfterTomorrowLabel() {
  const dayAfterTomorrow = DateTime.now().setZone(ZONE).plus({ days: 2 });
  return dayAfterTomorrow.setLocale('nl').toFormat('cccc'); // e.g. "woensdag"
}

export function formatEventDate(dateStr, hourStr, special) {
  const isTimeValid = /^\d{2}:\d{2}$/.test(hourStr);
  const now = DateTime.local().setLocale('nl');

  let dt;

  if (isTimeValid) {
    dt = DateTime.fromISO(`${dateStr}T${hourStr}`, { locale: 'nl' });
  } else {
    dt = DateTime.fromISO(dateStr, { locale: 'nl' });
  }

  if (dt.hasSame(now, 'day')) {
    return isTimeValid ? (
      <>
        <strong>Vandaag</strong> {dt.toFormat('HH:mm')}
      </>
    ) : (
      <strong>Vandaag</strong>
    );
  }

  if (dt.hasSame(now.plus({ days: 1 }), 'day')) {
    return isTimeValid ? (
      <>
        <strong>Morgen</strong> {dt.toFormat('HH:mm')}{' '}
      </>
    ) : (
      <strong>Morgen</strong>
    );
  }

  if (special) {
    const time = formatDateCSL(hourStr);

    const day = dt.toFormat('cccc');
    const dayFormatted = day.charAt(0).toUpperCase() + day.slice(1);
    const d = dt.toFormat('d');
    const llll = dt.toFormat('LLLL');

    return (
      <>
        <strong>
          {dayFormatted} {time}
        </strong>{' '}
        - {d} {llll}
      </>
    );
  }

  const dayFormatted = dt.toFormat(isTimeValid ? 'cccc, d LLLL HH:mm' : 'cccc, d LLLL');
  return dayFormatted.charAt(0).toUpperCase() + dayFormatted.slice(1);
}

export const dummyEvents = [
  // Hoy
  {
    id: '1',
    type: 'CSL',
    title: '[TEST] Concert Vandaag',
    introduction: 'Een geweldig concert op dezelfde dag.',
    date: DateTime.now().setZone(ZONE).toISODate(),
    hourStart: '04:00',
    image: { url: 'https://www.datocms-assets.com/115430/1744807405-fabriek.avif?auto=format' },
    __typename: 'ExternalEvent',
  },
  {
    id: '2',
    type: 'CSL',
    title: '[TEST] Expo Vandaag zonder tijd',
    introduction: 'Geen vast tijdstip voor deze expo.',
    date: DateTime.now().setZone(ZONE),
    hourStart: '20:00',
    image: { url: 'https://www.datocms-assets.com/115430/1744807405-fabriek.avif?auto=format' },
    __typename: 'ExternalEvent',
  },

  // Mañana
  {
    id: '3',
    type: 'CSL',
    title: '[TEST] XD Workshop Morgen',
    introduction: 'Leer iets nieuws morgen.',
    date: DateTime.now().setZone(ZONE).plus({ days: 1 }).toISODate(),
    hourStart: '15:00',
    image: { url: 'https://www.datocms-assets.com/115430/1744807405-fabriek.avif?auto=format' },
    __typename: 'ExternalEvent',
  },

  // // Esta semana
  // {
  //   id: '4',
  //   type: 'talk',
  //   title: '[TEST] Lezing deze week',
  //   introduction: 'Een interessante lezing in deze week.',
  //   date: DateTime.now().setZone(ZONE).plus({ days: 3 }).toISODate(),
  //   hourStart: '18:30',
  //   image: { url: 'https://www.datocms-assets.com/115430/1744807405-fabriek.avif?auto=format' },
  // },
  // {
  //   id: '4',
  //   type: 'talk',
  //   title: '[TEST] Event',
  //   introduction: 'Een interessante lezing in deze week.',
  //   date: DateTime.now().setZone(ZONE).plus({ days: 2 }).toISODate(),
  //   hourStart: '22:30',
  //   image: { url: 'https://www.datocms-assets.com/115430/1744807405-fabriek.avif?auto=format' },
  // },

  // // Próxima semana
  // {
  //   id: '5',
  //   type: 'performance',
  //   title: '[TEST] Performance volgende week',
  //   introduction: 'Een performance die volgende week plaatsvindt.',
  //   date: DateTime.now().setZone(ZONE).plus({ weeks: 1 }).toISODate(),
  //   hourStart: '21:00',
  //   hourEnd: '22:30',
  //   image: { url: 'https://www.datocms-assets.com/115430/1744807405-fabriek.avif?auto=format' },
  // },

  // // Próximos meses
  // {
  //   id: '6',
  //   type: 'festival',
  //   title: '[TEST] Zomerfestival',
  //   introduction: 'Een festival in de zomer.',
  //   date: DateTime.now().setZone(ZONE).plus({ months: 2 }).toISODate(),
  //   // hourStart: '16:00',
  //   image: { url: 'https://www.datocms-assets.com/115430/1744807405-fabriek.avif?auto=format' },
  // },
  // {
  //   id: '7',
  //   type: 'meeting',
  //   title: '[TEST] Netwerkbijeenkomst herfst',
  //   introduction: 'Een zakelijke netwerkbijeenkomst.',
  //   date: DateTime.now().setZone(ZONE).plus({ months: 5 }).toISODate(),
  //   // hourStart: 'tijd en locatie verschilt per AVA',
  //   image: { url: 'https://www.datocms-assets.com/115430/1744807405-fabriek.avif?auto=format' },
  // },
].map((event) => {
  const isTimeValid = /^\d{2}:\d{2}$/.test(event.hourStart);
  const dateTime = isTimeValid
    ? DateTime.fromISO(`${event.date}T${event.hourStart}`, { zone: ZONE })
    : DateTime.fromISO(event.date, { zone: ZONE });

  return { ...event, startDateToCompare: dateTime.toISO() };
});

export function getClosestEvents(relatedEvents, calendarEvents, max = 3) {
  const merged = Array.from(
    new Map(
      [...(relatedEvents || []), ...(calendarEvents || [])]
        .filter((e) => Boolean(e) && Boolean(e.date))
        .map((e) => [e.id, e])
    ).values()
  );

  const now = DateTime.now().setZone(ZONE);

  return merged
    .map((e) => ({
      ...e,
      startDateToCompare: e.type === 'CSL' ? e.startDateToCompare : parseCmsEventDate(e.rawDate, e.hourStart, '00:00'),
    }))
    .sort((a, b) => a.startDateToCompare.toMillis() - b.startDateToCompare.toMillis())
    .slice(0, max);
}
