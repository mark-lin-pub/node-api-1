import { createLogger, transports, format } from "winston";


const Logger = createLogger({
    transports: [new transports.Console()],
    format: format.combine(
      format.metadata(),
      format.timestamp(),
      format.json()
    ),
    defaultMeta: {
        service: "expressjs-template"
    }
  });

export default Logger