const express = require("express");
const mongodb = require("mongodb");

let app = express();
app.listen(3000);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let db;
let MongoClient = mongodb.MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017/", function (err, client) {
  if (err !== undefined) {
    console.log(err);
  } else {
    db = client.db("mesas");
  }
});

app.get("/api/mesas", function (request, response) {
  db.collection("tiendaMesas")
    .find()
    .toArray(function (err, datos) {
      if (err != undefined) {
        console.log(err);
        response.send({ mensaje: "error: " + err });
      } else {
        console.log(datos);
        response.send(datos);
      }
    });
});

app.post("/api/anyadir", function (req, res) {
  let variabletamaño = req.body.tamaño;
  let variablecolor = req.body.color;
  let variablematerial = req.body.material;
  let variablepatas = req.body.patas;

  db.collection("tiendaMesas").insertOne( 
    {
      tamaño: variabletamaño,
      color: variablecolor,
      material: variablematerial,
      patas: variablepatas,
    },
    function (err, respuesta) {
      if (err !== undefined) {
        console.log(err), res.send({ mensaje: "Ha habido un error. " + err });
      } else {
        console.log(respuesta);
        console.log("Introducido correctamente");
      }
    }
  );
});
app.put("/api/modificar", function (req, res) {
  let valorABuscar = req.body.color;
  db.collection("tiendaMesas")
    .find({ color: valorABuscar })
    .toArray(function (err, datos) {
      if (err != undefined) {
        console.log(err);
        res.send({ mensaje: "error: " + err });
      } else {
        console.log(datos);
        res.send(datos);
        for (let c = 0; c < datos.length; c++) {
          var newvalues = { $set: { color: "granate" } };
          db.collection("tiendaMesas").updateOne(
            {
              color: valorABuscar,
            },
            newvalues,
            function (err, respuesta) {
              if (err !== undefined) {
                console.log(err),
                  res.send({ mensaje: "Ha habido un error. " + err });
              } else {
                console.log(respuesta);
                console.log("Modificado correctamente");
              }
            }
          );
        }
      }
    });
});
app.delete("/api/borrar", function (req, res) {
  let valorABuscar = req.body.patas;
  db.collection("tiendaMesas")
    .find({ patas: valorABuscar })
    .toArray(function (err, datos) {
      if (err != undefined) {
        console.log(err);
        res.send({ mensaje: "error: " + err });
      } else {
        console.log(datos);
        res.send(datos);
        for (let c = 0; c < datos.length; c++) {
          db.collection("tiendaMesas").deleteOne(
            {
              patas: valorABuscar,
            },
            function (err, respuesta) {
              if (err !== undefined) {
                console.log(err),
                  res.send({ mensaje: "Ha habido un error. " + err });
              } else {
                console.log(respuesta);
                console.log("Eliminado correctamente");
              }
            }
          );
        }
      }
    });
});
