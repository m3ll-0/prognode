module.exports = {
    logger: require('tracer').colorConsole({
      format: [
        '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
        {
          error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})' // error format
        }
      ],
      dateformat: 'HH:MM:ss.L',
      preprocess: function(data) {
        data.title = data.title.toUpperCase()
      },
      level: 'info'
    }),
  
    dbconfig: {
      user: 'nodeuser',
      password: 'password123',
      server: '127.0.0.1',
      database: 'Prog4-Eindopdracht1',
      port: 1433,
      driver: 'msnodesql',
      connectionTimeout: 1500,
      options: {
        // 'true' if you're on Windows Azure
        encrypt: false
      }
    }
  }