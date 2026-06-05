import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: true,
    mensaje: "API Consulta de Cédulas Activa"
  });
});

app.get("/api/cedula/:cedula", async (req, res) => {

  const { cedula } = req.params;

  if (!/^\d{10}$/.test(cedula)) {
    return res.status(400).json({
      ok: false,
      error: "Cédula inválida"
    });
  }

  try {

    const response = await fetch(
      `https://enlinea.junin.gob.ec:8080/api/usuario/cedula_minimo/${cedula}`,
      {
        method: "POST",
        headers: {
          "accept": "application/json, text/plain, */*",
          "content-type": "application/json",
          "Referer": "https://enlinea.junin.gob.ec/",
          "Origin": "https://enlinea.junin.gob.ec"
        },
        body: JSON.stringify({
          mensaje: "consulta desde registro",
          justificacion: "Verificacion cedula"
        })
      }
    );

    const data = await response.json();

    res.status(response.status).json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      ok: false,
      error: "Error al consultar"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
