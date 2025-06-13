import ReactPixel from 'react-facebook-pixel';

const options = {
  autoConfig: true,
  debug: false,
};

export const initFacebookPixel = () => {
  ReactPixel.init('YOUR_PIXEL_ID', undefined, options);
  ReactPixel.pageView();
};

export const trackCustomEvent = (eventName: string, data: Record<string, any> = {}) => {
  ReactPixel.track(eventName, data);
};