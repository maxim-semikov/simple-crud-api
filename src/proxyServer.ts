import http from 'node:http';
import cluster from 'node:cluster';

export class ProxyServer {
  server: http.Server;
  currentRoundRobinWorkerIndex = 0;

  constructor(private port: number | string) {
    this.server = http.createServer((req, res) => {
      const workers = cluster.workers ? Object.values(cluster.workers) : [];

      const worker = workers[this.currentRoundRobinWorkerIndex % workers.length];

      this.currentRoundRobinWorkerIndex++;

      const proxy = http.request(
        {
          hostname: 'localhost',
          port: Number(this.port) + (worker?.id || 0),
          path: req.url,
          method: req.method,
          headers: req.headers,
        },
        (targetRes) => {
          res.writeHead(targetRes.statusCode || 200, targetRes.headers);
          targetRes.pipe(res);
        },
      );

      req.pipe(proxy);

      proxy.on('error', () => {
        res.writeHead(500);
        res.end('Something went wrong with proxy server.');
      });
    });
  }

  start() {
    this.server.listen(this.port);
    console.log('Load balancer running on port ', this.port);
  }
}
