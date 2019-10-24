const express = require('express');

const server = express();

//temos que dizer ao express que vamos ler json no body da requisição (para metodos put e post)

server.use(express.json());

//localhost:3000/teste
//quando o usuário acessar a rota abaixo, vai executar a função que vem como parâmetro

//Query params = ?teste=1
//Route params = /users/1
//Request body = { "name": "Diego", "email": "diego@rocketseat@.com.br" } (rotas put e post)

// Consumindo query params -> server.get('/teste', (req, res) => {...}
//No Route params, é obrigatório ter o parametro passado, como o :id abaixo

//CRUD -> Create / Read / Update / Delete


const users = ['Taylor', 'Heitor', 'Jordan', 'Nicole']

// middleware global abaixo (não é aplicado diretamente na rota, ao contrario do middleware local)
// se a função next abaixo não existisse, o middleware iria ser executado, mas impediria as rotas criadas de executarem
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');

});

//middleware é uma função que vai gerenciar as requisições e respostas da nossa aplicação, como nas rotas abaixo 


//criamos um middleware local para checar se o usuário existe
function checkUserExists(req, res, next) {
  if(!req.body.name){
    return res.status(400).json({error: 'User name is required'});
  }

  return next();
}

function checkUserInArray(req, res, next){

  const user = users[req.params.index];

  if(!user){
    return res.status(400).json({error: 'User does not exist'});
  }
  
  //um dos conceitos de middleware é que ele pode alterar valores do req e do res, como abaixo, onde criamos o req.user e podemos utilizar em todas as rotas que utilizarem desse middleware
  req.user = user;

  return next();
}

server.get('/users', (req, res) => {

  return res.json(users);

});


server.get('/users/:index', checkUserInArray, (req, res) => {
  //Abaixo é uma desestruturação de -> const id = req.params.id;
  //const { index } = req.params;

  return res.json(req.user);

});



server.post('/users', checkUserExists, (req, res) => {

  const { name } = req.body;

  users.push(name);

  return res.json(users);
});


server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {

  const { name } = req.body;
  const { index } = req.params;

  users[index] = name;

  return res.json(users);

})

server.delete('/users/:index', checkUserInArray, (req, res) => {

  const { index } = req.params;

  //metodo splice funciona assim -> ele percorre o vetor até o index passado (primeiro parametro) e deleta o tanto de posições informadas no segundo parametro
  users.splice(index, 1);

  return res.send();

})

server.listen(3000);