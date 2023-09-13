import http from "http";

http
  .createServer((_req, res) => {
    console.log("request recieved");
    setTimeout(() => {
      console.log("responding");
      res.write("hello");
      res.end();
    }, 1_000);
  })
  .listen(3000);
