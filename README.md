# Bean.js

# This is beanJS similar mini version Express.js

I'm building this for educational purpose and out of curiosity of everything works under the hood.

# Getting Started

```js
const Bean = require('./bean.js');

const server = new Bean();

server.route('GET', '/', (req, res) => {
  res.status(200).sendFile('./index.html', 'text/html');
})

server.route('GET', '/user', (req, res) => {
  res.status(200).json({ name: "zoro" });
})

server.route('GET', '/info', (req, res) => {
  res.status(200).send('Hii Zoro');
})

const PORT = process.env.PORT

server.listen(PORT, () => {
  console.log("Bean server started");
})
```

## Will add more functions in future
Till then happy coding!