import fs from 'fs';
import path from 'path';

type LogLevel = 'INFO' | 'ERROR' | 'WARNING';

interface LogPayload {
  userId: string;
  action: string;
  payload?: any;
  error?: any;
}

export function logAction(level: LogLevel, data: LogPayload) {
  try {
    const logFilePath = path.join(process.cwd(), 'system.log');
    const timestamp = new Date().toISOString();
    
    let logMessage = `[${timestamp}] [${level}] userId=${data.userId} | ACTION: ${data.action}`;
    
    if (data.payload) {
      logMessage += ` | [PAYLOAD]: ${JSON.stringify(data.payload)}`;
    }
    if (data.error) {
      logMessage += ` | [ERROR]: ${data.error.message || data.error}`;
    }
    
    logMessage += '\n';

    fs.appendFileSync(logFilePath, logMessage, 'utf8');
    
    // Also output to console in dev mode
    if (process.env.NODE_ENV !== 'production') {
      console.log(logMessage.trim());
    }
  } catch (err) {
    console.error("Falha crítica ao gravar log:", err);
  }
}
