const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 2000;

// Datos de prueba
const usuarios = [
  { username: 'admin', fullname: 'Administrador', password: '123456', role: 1 },
  { username: 'usuario', fullname: 'Usuario', password: 'abcdef', role: 2 },
  { username: 'usuario2', fullname: 'Usuario 2', password: 'qwerty', role: 2 }
];

// Middleware para validar el usuario y la contraseña
function validarUsuario(req, res, next) {
  const { username, password } = req.body;
  const usuario = usuarios.find(
    (u) => u.username === username && u.password === password
  );
  if (usuario) {
    // Asignar un valor predeterminado de 1 (administrador) al rol del usuario
    usuario.role = 2;
    req.usuario = usuario;
    next();
  } else {
    res.status(401).send("Usuario o contraseña inválidos");
  }
}


// Middleware para validar el rol de usuario
// Middleware para validar el rol de usuario
function validarRol(roles) {
  return function(req, res, next) {
    // Obtener el rol del usuario desde el objeto de solicitud
    const { role } = req.usuario;

    // Verificar si el rol del usuario está incluido en la lista de roles permitidos
    if (roles.includes(role)) {
      // Si el rol es válido, pasar al siguiente middleware o ruta
      next();
    } else {
      // Si el rol no es válido, enviar un error 403 (Forbidden)
      res.status(403).send('Acceso denegado');
    }
  };
}
// Middleware para asignar el rol predeterminado a usuarios sin rol
function asignarRolPredeterminado(req, res, next) {
  const { usuario } = req;
  if (usuario && !usuario.role) {
    usuario.role = 2;
  }
  next();
}

app.use(asignarRolPredeterminado);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Página de inicio
app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: __dirname });
});

// Iniciar sesión
app.post("/login", validarUsuario, (req, res) => {
  const usuario = req.usuario;
  if (usuario.role === 1) {
    res.redirect("/controlpanel");
  } else {
    res.redirect("/customers");
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
  res.send('Quiénes somos');
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
