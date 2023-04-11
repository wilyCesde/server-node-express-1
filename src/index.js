const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 2000;



// Middleware para validar el usuario y la contraseña
// function validarUsuario(req, res, next) {
//   const { username, password } = req.body;
//   const usuario = usuarios.find(
//     x => x.username === username && x.password === password
//   );
//   if (usuario) {
//     // Asignar un valor predeterminado de 1 (administrador) al rol del usuario
//     usuario.role = '1';
//     req.usuario = usuario;
//     next();
//   } else {
//     res.status(401).send("Usuario o contraseña inválidos");
//   }
// }



// function validarRol(roles) {
//   return function (req, res, next) {

//     const { role } = req.usuario;


//     if (roles.includes(role)) {

//       next();
//     } else {

//       res.status(403).send('Acceso denegado');
//     }
//   };
// }

// function asignarRolPredeterminado(req, res, next) {
//   const { usuario } = req;
//   if (usuario && !usuario.role) {
//     usuario.role = 2;
//   }
//   next();
// }

// app.use(asignarRolPredeterminado);

// Datos de prueba
const usuarios = [
  { username: 'admin', fullname: 'Administrador', password: '123456', role: '1' },
  { username: 'usuario', fullname: 'Usuario', password: 'abcdef', role: '2' },
  { username: 'usuario2', fullname: 'Usuario 2', password: 'qwerty', role: '2' }
];

app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: __dirname });
});

// Iniciar sesión
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  let userFind = usuarios.find(
    (usuario) => usuario.username === username && usuario.password === password
  );
  console.log(userFind);

  if (userFind) {
    if (userFind.role == "1") {
      res.redirect("/controlpanel");
    } else if (userFind.role == "2") {
      res.redirect("/quienessomos");
    } else {
      res.send("usuario no registrado");
    }
  } else {
    res.send("Revise a ver ¿Si esta registrado?");
  }
});
// Ruta de controlpanel
app.get('/controlpanel', validarRol([1]), (req, res) => {
  res.send('Control Panel');
});

// Ruta de customers
app.get('/customers', validarRol([1, 2]), (req, res) => {
  res.send('Customers');
});

// Ruta de quienessomos
app.get('/quienessomos', (req, res) => {
  res.sendFile("views/quienessomos.html", { root: __dirname });
});

// Ruta de contacts
app.post('/contacts', (req, res) => {
  console.log('Se ha ingresado a la ruta /contacts');
  res.send('Se ha ingresado a la ruta /contacts');
});

// Ruta de /
app.put('/', (req, res) => {
  console.log('Se ha ingresado a la ruta /');
  res.send('Se ha ingresado a la ruta /');
});

// Ruta de /student
app.delete('/student', (req, res) => {
  console.log('Se ha ingresado a la ruta /student');
  res.send('Se ha ingresado a la ruta /student');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
