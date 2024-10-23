import { DateTime } from 'luxon';

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
    return `/${cta.slug}`;
  }

  const url = cta.link?.content ? '/' + cta.link?.content?.slug : cta.link?.url;
  return url;
};

export const formatDate = (rawDate) => {
  if (!rawDate) {
    return 'Invalid date';
  }

  const date = DateTime.fromJSDate(new Date(rawDate)).setZone('Europe/Amsterdam');
  const today = DateTime.now().setZone('Europe/Amsterdam');
  const tomorrow = today.plus({ days: 1 });

  if (date.hasSame(today, 'day')) {
    return 'Vandaag';
  } else if (date.hasSame(tomorrow, 'day')) {
    return 'Morgen';
  } else {
    if (date.year === today.year) {
      return date.toLocaleString({ month: 'short', day: '2-digit', timeZone: 'Europe/Amsterdam' }).replace('-', ' ');
    }

    return date.toLocaleString({
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      timeZone: 'Europe/Amsterdam',
    });
  }
};

export const formatDateCSL = (rawDate) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/;
  if (!regex.test(rawDate)) {
    return rawDate;
  }

  const time = rawDate.substring(11, 16);
  return time;
};

export const compareIfIsFuture = (event) => {
  let eventHourStart = event.hourStart; // Formato: 06:00 | 15:00 | 23:30
  if (eventHourStart.includes('(')) {
    eventHourStart = eventHourStart.substring(0, 5);
  }

  if (event.type === 'CSL') {
    // 2024-03-29T09:00:00Z
    const eventDate = DateTime.fromFormat(`${event.rawDate}`, "yyyy-MM-dd'T'HH:mm:ss'Z'", {
      zone: 'Europe/Amsterdam',
    });
    return eventDate >= DateTime.local();
  }

  const eventDate = DateTime.fromFormat(`${event.rawDate} ${eventHourStart}`, 'yyyy-MM-dd HH:mm', {
    zone: 'Europe/Amsterdam',
  });

  return (
    eventDate >=
    DateTime.local({
      zone: 'Europe/Amsterdam',
    })
  );
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

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.substring(0, maxLength) + '...';
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
        model: {
          apiKey: 'ExternalEvent',
        },
        type: 'CSL',
        image: {
          url: raw.node.image_url,
        },
      }))
    : [];
};
