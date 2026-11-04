const http = require(http)

const server = http.createServer((request, Response)=>{
    if (request.method = GET) {
        Response.statusCode =200;
        Response.end(Bienvenidos a letras y aromas)
    }
})

server.listen(3000,() =>{
console.log("Servidor ejecutandose en el puerto 3000")
})
