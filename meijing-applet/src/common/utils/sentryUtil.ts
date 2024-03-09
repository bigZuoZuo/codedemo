import * as Sentry from '@sentry/browser';

export default {
  // sentry初始化操作
  init: (dsn: string) => {
    console.log('Init Sentry Config');
    try {
      Sentry.init({ dsn });
    }
    catch (err) {
      console.log(err)
    }
  }
}