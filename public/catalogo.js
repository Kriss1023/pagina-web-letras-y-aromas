
const productos = [
  {id:1,tipo:'libros',
    categoria:'NOVELA',
    nombre:'Entre páginas',
    precio:18,
    imagen:'amor entre paginas.jfif',
    descripcion:'Una historia llena de emociones, encuentros y nuevos comienzos.'},
  {id:2,tipo:'libros',
    categoria:'ROMANCE',
    nombre:'Cartas de otoño',
    precio:20,
    imagen:'cartas de otono.jfif',
    descripcion:'Una historia romántica para leer acompañada de una taza de café.'},
  {id:3,tipo:'libros',
    categoria:'FANTASÍA',
    nombre:'El jardín secreto',
    precio:22,
    imagen:'-el-jardin-secreto.jpg',
    descripcion:'Una aventura mágica donde todo puede hacerse realidad.'},
  {id:4,tipo:'libros',
    categoria:'NOVELA',
    nombre:'Orgullo y prejuicio',
    precio:22,
    imagen:'orgullo y prejuicio.jpg',
    descripcion:'Elizabeth Bennet y Fitzwilliam Darcy deben superar sus prejuicios para estar juntos.'},
  {id:5,tipo:'libros',
    categoria:'NOVELA',
    nombre:'En agosto nos vemos',
    precio:15,
    imagen:'en agosto nos vemos.webp',
    descripcion:'Novela póstuma de Gabriel García Márquez, publicada en marzo de 2024.'},
  {id:6,tipo:'libros',
    categoria:'NOVELA CORTA',
    nombre:'La metamorfosis',
    precio:9,
    imagen:'la metamorfosis.jpg',
    descripcion:'Una historia sobre la deshumanización y el aislamiento.'},
  {id:7,tipo:'velas',
    categoria:'RELAX',
    nombre:'Vela de lavanda',
    precio:12,
    imagen:'vela-lavanda.jfif',
    descripcion:'Aroma floral y relajante para crear un espacio tranquilo.'},
  {id:8,tipo:'velas',
    categoria:'DULCE',
    nombre:'Vela de vainilla',
    precio:13,
    imagen:'vela-vainilla.jfif',
    descripcion:'Un aroma cálido, dulce y acogedor.'},
  {id:9,tipo:'velas',
    categoria:'FLORAL',
    nombre:'Pétalos de rosa',
    precio:15,
    imagen:'vela-rosas.jfif',
    descripcion:'Una fragancia romántica y delicada.'},
  {id:10,tipo:'velas',
    categoria:'CÁLIDO',
    nombre:'Vela de chocolate',
    precio:14,
    imagen:'vela-chocolate.jfif',
    descripcion:'Perfecta para crear un ambiente cálido y acogedor.'}
];

const carrito = [];
const dinero = cantidad => `$${cantidad.toFixed(2)}`;

function renderizarProductos() {

const parametros = new URLSearchParams(window.location.search);

const tipoSeleccionado = parametros.get("tipo");

if (tipoSeleccionado === "libros" || tipoSeleccionado === "velas") {
    filtrar(tipoSeleccionado);
} else {
    filtrar("todos");
}

  for (const tipo of ['libros', 'velas']) {
    const contenedor = document.getElementById(
      tipo === 'libros' ? 'productosLibros' : 'productosVelas'
    );

    for (const producto of productos.filter(p => p.tipo === tipo)) {
      const tarjeta = document.createElement('article');
      tarjeta.className = 'producto';

      const imagen = document.createElement('div');
      imagen.className = 'producto-imagen';

      const foto = document.createElement('img');
      foto.src = `carpeta de imagenes/${producto.imagen}`;
      foto.alt = producto.nombre;
      imagen.append(foto);

      const info = document.createElement('div');
      info.className = 'producto-info';

      const categoria = document.createElement('span');
      categoria.className = 'categoria';
      categoria.textContent = producto.categoria;

      const titulo = document.createElement('h3');
      titulo.textContent = producto.nombre;

      const descripcion = document.createElement('p');
      descripcion.textContent = producto.descripcion;

      const abajo = document.createElement('div');
      abajo.className = 'producto-abajo';

      const precio = document.createElement('strong');
      precio.textContent = dinero(producto.precio);

      const boton = document.createElement('button');
      boton.type = 'button';
      boton.textContent = 'Agregar 🛒';
      boton.addEventListener('click', () => agregarCarrito(producto));

      abajo.append(precio, boton);
      info.append(categoria, titulo, descripcion, abajo);
      tarjeta.append(imagen, info);
      contenedor.append(tarjeta);
    }
  }
}

function agregarCarrito(producto) {
  carrito.push(producto);
  actualizarCarrito();

  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = `${producto.nombre} agregado al carrito`;
  mensaje.hidden = false;

  setTimeout(() => {
    mensaje.hidden = true;
  }, 2200);
}

function actualizarCarrito() {

const parametros = new URLSearchParams(window.location.search);

const tipoSeleccionado = parametros.get("tipo");

if (tipoSeleccionado === "libros" || tipoSeleccionado === "velas") {
    filtrar(tipoSeleccionado);
} else {
    filtrar("todos");
}

  document.getElementById('contador').textContent = carrito.length;

  const lista = document.getElementById('listaCarrito');
  lista.replaceChildren();

  if (!carrito.length) {
    const vacio = document.createElement('p');
    vacio.textContent = 'Tu carrito está vacío';
    lista.append(vacio);
  }

  carrito.forEach((producto, indice) => {
    const fila = document.createElement('p');
    fila.textContent = `${producto.nombre} — ${dinero(producto.precio)} `;

    const quitar = document.createElement('button');
    quitar.type = 'button';
    quitar.textContent = 'Quitar';

    quitar.addEventListener('click', () => {
      carrito.splice(indice, 1);
      actualizarCarrito();
    });

    fila.append(quitar);
    lista.append(fila);
  });

  const total = carrito.reduce(
    (suma, producto) => suma + producto.precio, 0
  );

  document.getElementById('totalCarrito').textContent = dinero(total);
}

function filtrar(tipo) {
  document.querySelectorAll('[data-filtro]').forEach(boton => {
    boton.setAttribute(
      'aria-pressed',
      String(boton.dataset.filtro === tipo)
    );
  });

  document.getElementById('libros').hidden = tipo === 'velas';
  document.getElementById('velas').hidden = tipo === 'libros';
}

document.querySelectorAll('[data-filtro]').forEach(boton => {
  boton.addEventListener('click', () => filtrar(boton.dataset.filtro));
});

const modal = document.getElementById('modalCarrito');

document.getElementById('abrirCarrito').addEventListener('click', () => {
  modal.hidden = false;
  modal.style.display = 'flex';
});

document.getElementById('cerrarCarrito').addEventListener('click', () => {
  modal.hidden = true;
  modal.style.display = 'none';
});

renderizarProductos();
actualizarCarrito();
