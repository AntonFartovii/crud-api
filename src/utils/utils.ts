export function res404(req: any, res: any): void {
  res.writeHead(404, { 'Content-type': 'application/json' });
  res.end(JSON.stringify({ message: '! Error 404 - this end point is not found' }));
}
export function res400(req: any, res: any): void {
  res.writeHead(400, { 'Content-type': 'application/json' });
  res.end(JSON.stringify({ message: 'Error 400 - ID is not valid' }));
}

export function getPostData(req: any) {
  return new Promise((resolve, reject) => {
    try {
      let body: string = '';

      req.on('data', (chunk: any) => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        resolve(body === '' ? '{}' : body);
      });
    } catch (err) {
      reject(err);
    }
  });
}
