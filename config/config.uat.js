import common from './config.js';

export default {
  ...common,
  define: {
    'process.env.UMI_ENV': process.env.UMI_ENV,
  },
};
