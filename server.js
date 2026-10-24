const http = require("http");

const server = http.createServer((request, response) => {
    if (request.method === "GET") {
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.end("Bienvenidos a letras y aromas");
    } else {
        response.statusCode = 405;
        response.end("Método no permitido");
    }
});

server.listen(3000, () => {
    console.log("Servidor ejecutándose en el puerto 3000");
});