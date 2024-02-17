const Bean = require('./bean.js');

const server = new Bean();

const PORT = 9000

server.route('GET', '/', (req, res) => {
  res.status(200).sendFile('./index.html', 'text/html');
})

server.route('GET', '/user', (req, res) => {
  res.status(200).json({ name: "zoro" });
})

server.route('GET', '/info', (req, res) => {
  res.status(200).send('Hii Zoro');
})

server.listen(PORT, () => {
  console.log("Bean server started");
})