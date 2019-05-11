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
      user: '23ivt1c1',
      password: '*;&?3Ed@H@:i',
      server: '86.88.229.21',
      database: 'Prog4-Eindopdracht1',
      port: 40239,
      driver: 'msnodesql',
      connectionTimeout: 1500,
      options: {
        // 'true' if you're on Windows Azure
        encrypt: false
      }
    }
  }