const dvaLogger = require('dva-logger');

export default {
  config: {
    onError(e) {
      e.preventDefault();
      // console.error(e.message);
    },
  },
  plugins: [dvaLogger()],
};
