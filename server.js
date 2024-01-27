const Butter = require('./bean.js');

const server = new Butter();

const PORT = 9000

server.route('GET', '/', (req, res) => {
  res.status(200)
  res.sendFile('./index.html', 'text/html');
})

server.listen(PORT, () => {
  console.log("Bean server started");
})

