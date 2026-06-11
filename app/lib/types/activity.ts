

export interface DocActivity{
    depth :number;
    userId : string;
    date : string;
    action : string;
    status : "success" | "failed";
    id : string;
    documentId : string;
    collection : string;
    error ? : string | undefined;
}



export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogEntry {
  id: string;
  depth : number,
  timestamp: string;
  level: LogLevel;
  message: string;
  method: string;
  collection: string;
  userId?: string | undefined;
  documentId?: string | undefined;
  metadata?: Record<string, any> | undefined;
  error?: {
    message: string;
    stack?: string;
    code?: string;
} | undefined;
}

export interface LoggerConfig {
  enabled: boolean;
  logLevel: LogLevel;
  logToConsole: boolean;
  logToDatabase: boolean;
  activityCollection?: string;
  logsCollection?: string;
  includeMetadata: boolean;
}