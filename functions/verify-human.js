// functions/verify-human.js

// Known bot user agent patterns
const BOT_USER_AGENTS = [
  'bot',
  'crawler',
  'spider',
  'headless',
  'puppet',
  'selenium',
  'phantomjs',
  'chrome-lighthouse',
  'googlebot',
  'yandexbot',
  'bingbot',
  'rogerbot',
  'baiduspider',
];

const isKnownBotUA = (userAgent = '') => {
  const lowerUA = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((botUA) => lowerUA.includes(botUA));
};

const analyzeHeaders = (headers) => {
  const suspicious = {
    noAcceptHeader: !headers['accept'],
    noAcceptLanguage: !headers['accept-language'],
    noUserAgent: !headers['user-agent'],
    suspiciousUserAgent: isKnownBotUA(headers['user-agent']),
  };

  return Object.values(suspicious).filter(Boolean).length;
};

const analyzeBehavior = (clientData) => {
  const suspicious = {
    noMouseMovements: clientData.mouseMovements < 3,
    missingLanguages: !clientData.languages?.length,
    missingPlatform: !clientData.platform,
    invalidResolution: !clientData.screenResolution?.includes('x'),
    missingTimezone: !clientData.timezone,
    // Add timing checks
    suspiciousLoadTime: clientData.timeOnPage < 2000, // Less than 2 seconds on page
    tooFastInteraction: clientData.firstInteractionTime < 100, // Interaction faster than 100ms
  };

  return Object.values(suspicious).filter(Boolean).length;
};

const verifyTurnstile = async (token) => {
  if (!process.env.TURNSTILE_SECRET_KEY) return true; // Skip if not configured

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Turnstile verification failed:', error);
    return false;
  }
};

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'];
    const { clientData, turnstileToken } = JSON.parse(event.body);

    console.log(JSON.stringify(event.headers));

    // Basic IP validation
    if (!ip || ip.includes(';') || ip.includes(',')) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Invalid request' }),
      };
    }

    // Verify Turnstile if configured and token provided
    if (turnstileToken) {
      const isTurnstileValid = await verifyTurnstile(turnstileToken);
      if (!isTurnstileValid) {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: 'Invalid Turnstile token' }),
        };
      }
    }

    // Analyze request for bot characteristics
    const headerSuspicionScore = analyzeHeaders(event.headers);
    const behaviorSuspicionScore = analyzeBehavior(clientData);

    // Calculate total suspicion score
    const totalSuspicionScore = headerSuspicionScore + behaviorSuspicionScore;

    // More stringent checking since we don't have rate limiting
    if (totalSuspicionScore >= 2) {
      console.log('Suspicious activity detected:', {
        ip,
        headerScore: headerSuspicionScore,
        behaviorScore: behaviorSuspicionScore,
        userAgent: event.headers['user-agent'],
        timestamp: new Date().toISOString(),
      });

      return {
        statusCode: 403,
        body: JSON.stringify({
          error: 'Access denied',
          details:
            process.env.NODE_ENV === 'development'
              ? {
                  headerScore: headerSuspicionScore,
                  behaviorScore: behaviorSuspicionScore,
                }
              : undefined,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        verified: true,
      }),
    };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
