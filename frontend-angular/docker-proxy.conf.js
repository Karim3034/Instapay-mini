module.exports = [
  {
    context: ['/api'],
    target: 'http://api-gateway:8080',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  }
];
