module.exports = {
  server: {
    host: '0.0.0.0',
    port: (process.env.PORT || 8888),
  },
  mongo: {
    host: 'localhost',
    port: 27017,
    db: 'hcp-set-dl',
  }
};
