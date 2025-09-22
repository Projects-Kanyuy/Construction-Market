import axios from 'axios';

// Facebook Pixel tracking middleware
export const trackFacebookPixelEvent = async (eventName, eventData, pixelId, accessToken) => {
  try {
    if (!pixelId || !accessToken) {
      console.warn('Facebook Pixel tracking disabled: Missing pixelId or accessToken');
      return;
    }

    const url = `https://graph.facebook.com/v18.0/${pixelId}/events`;

    const data = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: eventData.source_url || 'https://your-domain.com',
        user_data: {
          client_ip_address: eventData.client_ip,
          client_user_agent: eventData.user_agent,
          fbc: eventData.fbc, // Facebook click ID
          fbp: eventData.fbp, // Facebook browser ID
        },
        custom_data: eventData.custom_data || {}
      }],
      access_token: accessToken
    };

    await axios.post(url, data);
    console.log(`Facebook Pixel event tracked: ${eventName}`);
  } catch (error) {
    console.error('Error tracking Facebook Pixel event:', error.response?.data || error.message);
  }
};

// Middleware to track company search events (client-side tracking)
export const trackCompanySearch = (req, res, next) => {
  // Store original json method
  const originalJson = res.json;

  // Override json method to track successful responses
  res.json = function(data) {
    // Track search event if successful
    if (data.items && Array.isArray(data.items)) {
      const eventData = {
        client_ip: req.ip,
        user_agent: req.get('User-Agent'),
        fbc: req.get('X-Facebook-Click-ID'),
        fbp: req.get('X-Facebook-Browser-ID'),
        source_url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        custom_data: {
          search_query: req.query.search || '',
          category: req.query.category || '',
          city: req.query.city || '',
          country: req.query.country || '',
          results_count: data.items.length,
          has_location_filter: data.hasLocationFilter || false
        }
      };

      // Track async without blocking response
      setImmediate(() => {
        trackFacebookPixelEvent(
          'Search',
          eventData,
          process.env.FACEBOOK_PIXEL_CLIENT_ID,
          process.env.FACEBOOK_PIXEL_ACCESS_TOKEN
        );
      });
    }

    // Call original json method
    return originalJson.call(this, data);
  };

  next();
};

// Middleware to track company profile views
export const trackCompanyView = (req, res, next) => {
  const originalJson = res.json;

  res.json = function(data) {
    // Track view event if company data is returned
    if (data.name && data.slug) {
      const eventData = {
        client_ip: req.ip,
        user_agent: req.get('User-Agent'),
        fbc: req.get('X-Facebook-Click-ID'),
        fbp: req.get('X-Facebook-Browser-ID'),
        source_url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        custom_data: {
          company_id: data._id,
          company_name: data.name,
          company_slug: data.slug,
          company_category: data.category,
          company_city: data.city,
          company_country: data.country
        }
      };

      setImmediate(() => {
        trackFacebookPixelEvent(
          'ViewContent',
          eventData,
          process.env.FACEBOOK_PIXEL_CLIENT_ID,
          process.env.FACEBOOK_PIXEL_ACCESS_TOKEN
        );
      });
    }

    return originalJson.call(this, data);
  };

  next();
};

// Middleware to track company registration (company-side tracking)
export const trackCompanyRegistration = (req, res, next) => {
  const originalJson = res.json;

  res.json = function(data) {
    // Track registration event if company was created
    if (res.statusCode === 201 && data.name && data.slug) {
      const eventData = {
        client_ip: req.ip,
        user_agent: req.get('User-Agent'),
        fbc: req.get('X-Facebook-Click-ID'),
        fbp: req.get('X-Facebook-Browser-ID'),
        source_url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        custom_data: {
          company_id: data._id,
          company_name: data.name,
          company_category: data.category,
          company_city: data.city,
          company_country: data.country,
          registration_method: 'direct'
        }
      };

      setImmediate(() => {
        trackFacebookPixelEvent(
          'CompleteRegistration',
          eventData,
          process.env.FACEBOOK_PIXEL_COMPANY_ID,
          process.env.FACEBOOK_PIXEL_ACCESS_TOKEN
        );
      });
    }

    return originalJson.call(this, data);
  };

  next();
};

// Middleware to track user registration
export const trackUserRegistration = (req, res, next) => {
  const originalJson = res.json;

  res.json = function(data) {
    if (res.statusCode === 201 && data.user) {
      const eventData = {
        client_ip: req.ip,
        user_agent: req.get('User-Agent'),
        fbc: req.get('X-Facebook-Click-ID'),
        fbp: req.get('X-Facebook-Browser-ID'),
        source_url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        custom_data: {
          user_id: data.user._id,
          user_role: data.user.role,
          registration_method: 'api'
        }
      };

      setImmediate(() => {
        trackFacebookPixelEvent(
          'CompleteRegistration',
          eventData,
          process.env.FACEBOOK_PIXEL_CLIENT_ID,
          process.env.FACEBOOK_PIXEL_ACCESS_TOKEN
        );
      });
    }

    return originalJson.call(this, data);
  };

  next();
};

// Google Analytics 4 tracking
export const trackGA4Event = async (eventName, parameters) => {
  try {
    if (!process.env.GA4_MEASUREMENT_ID || !process.env.GA4_API_SECRET) {
      console.warn('GA4 tracking disabled: Missing measurement ID or API secret');
      return;
    }

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`;

    const data = {
      client_id: parameters.client_id || 'anonymous',
      events: [{
        name: eventName,
        params: parameters
      }]
    };

    await axios.post(url, data);
    console.log(`GA4 event tracked: ${eventName}`);
  } catch (error) {
    console.error('Error tracking GA4 event:', error.response?.data || error.message);
  }
};

// Generic event tracking wrapper
export const trackEvent = async (eventName, eventData) => {
  // Track on both Facebook Pixel and GA4
  await Promise.allSettled([
    trackFacebookPixelEvent(
      eventName,
      eventData,
      process.env.FACEBOOK_PIXEL_CLIENT_ID,
      process.env.FACEBOOK_PIXEL_ACCESS_TOKEN
    ),
    trackGA4Event(eventName, {
      client_id: eventData.client_id || 'anonymous',
      ...eventData.custom_data
    })
  ]);
};