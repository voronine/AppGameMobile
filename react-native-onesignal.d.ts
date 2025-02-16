declare module 'react-native-onesignal' {
    export enum LogLevel {
      NONE = 0,
      FATAL = 1,
      ERROR = 2,
      WARN = 3,
      INFO = 4,
      DEBUG = 5,
      VERBOSE = 6,
    }
    export interface OneSignalStatic {
      setLogLevel(logLevel: LogLevel, visualLevel: LogLevel): void;
      setAppId(appId: string): void;
      setNotificationOpenedHandler(handler: (notification: any) => void): void;
    }
    const OneSignal: OneSignalStatic;
    export default OneSignal;
  }
  