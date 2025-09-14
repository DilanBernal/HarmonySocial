// import http from "http";
// import express from "express";
// import envs from "../config/environment-vars";

// export default class ServerBootstrap {
//   private app: express.Application;

//   constructor(app: express.Application) {
//     this.app = app;
//   }

//   init(): Promise<boolean> {
//     return new Promise((resolve, reject) => {
//       const server = http.createServer(this.app);
//       const PORT = envs.PORT ?? 4100;

//       server
//         .listen(PORT)
//         .on("listening", () => {
//           console.log(`El servidor empezo en el puerto ${PORT} link: http://localhost:${PORT}`);
//           resolve(true);
//         })
//         .on("error", (err) => {
//           console.error(`Error iniciando el server ${err}`);
//           reject(false);
//         });
//     });
//   }
// }

import app from '../web/app';
import http from 'http';

export default class ServerBootstrap {
  constructor(private readonly expressApp: any) {}

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const PORT = Number(process.env.PORT || 4200);
      const HOST = process.env.HOST || '0.0.0.0'; 

      const server = http.createServer(this.expressApp);
      server.listen(PORT, HOST, () => {
        console.log(`El servidor empezó en http://${HOST}:${PORT}`);
        resolve();
      });
      server.on('error', (err) => {
        console.error('Error iniciando el server', err);
        reject(err);
      });
    });
  }
}

