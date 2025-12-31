import {
  ConsoleHandler,
  formatters,
  getLogger,
  LevelName,
  setup,
} from '@std/log';

const logLevel = (Deno.env.get('LEVEL') ?? 'INFO') as LevelName;
setup({
  handlers: {
    json_console: new ConsoleHandler(logLevel, {
      formatter: formatters.jsonFormatter,
      useColors: false,
    }),
  },
});

export const logger = getLogger('json_console');
