<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel de Control | IVERI SAS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --primary: #1a5276; --accent: #c29900; --bg: #f0f2f5; }
        body { font-family: 'Segoe UI', sans-serif; margin: 0; display: flex; background: var(--bg); }
        .sidebar { width: 250px; height: 100vh; background: var(--primary); color: white; padding: 20px; position: fixed; }
        .main-content { margin-left: 290px; padding: 30px; width: calc(100% - 350px); }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .data-table { width: 100%; background: white; border-radius: 12px; border-collapse: collapse; overflow: hidden; }
        .data-table th, .data-table td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
        .status-pill { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; background: #d4edda; color: #155724; text-transform: capitalize; }
        .btn-refresh { background: var(--accent); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; float: right; }
    </style>
</head>
<body spellcheck="true"> <div class="sidebar">
        <h2>IVERI Admin</h2>
        <p style="font-size: 0.8rem; opacity: 0.7;">Base de Datos Conectada</p>
    </div>

    <div class="main-content">
        <button class="btn-refresh" onclick="cargarDatos()"> <i class="fas fa-sync"></i> Actualizar</button>
        <h1>Panel de Gestión</h1>
        
        <div class="stats-grid">
            <div class="stat-card"><h3>Total Solicitudes</h3><p id="total-val">0</p></div>
            <div class="stat-card"><h3>Viajes</h3><p id="viajes-val">0</p></div>
            <div class="stat-card"><h3>Conductores</h3><p id="cond-val">0</p></div>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Detalle</th>
                    <th>Contacto</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody id="table-body">
                <tr><td colspan="5">Cargando datos...</td></tr>
            </tbody>
        </table>
    </div>

    <script>
        const CSV_URL = 'TU_ENLACE_AQUI_QUE_TERMINA_EN_OUTPUT_CSV';

        /**
         * Función para normalizar y corregir errores comunes de ortografía
         * en los datos provenientes del CSV.
         */
        function corregirTexto(texto) {
            if (!texto) return "";
            let t = texto.trim();
            
            // Diccionario de correcciones rápidas para IVERI
            const correcciones = {
                "viaje": "Viaje",
                "conductor": "Conductor",
                "gestion": "Gestión",
                "pendiente": "Pendiente",
                "verificacion": "Verificación",
                "telefono": "Teléfono",
                "proximo": "Próximo"
            };

            // Aplicar correcciones ignorando mayúsculas/minúsculas
            Object.keys(correcciones).forEach(error => {
                const regex = new RegExp(error, "gi");
                t = t.replace(regex, correcciones[error]);
            });

            // Forzar primera letra en mayúscula
            return t.charAt(0).toUpperCase() + t.slice(1);
        }

        async function cargarDatos() {
            try {
                const response = await fetch(CSV_URL);
                const data = await response.text();
                const rows = data.split('\n').filter(row => row.trim() !== "").slice(1); 
                
                let html = "";
                let viajes = 0;
                let cond = 0;

                rows.reverse().forEach(row => {
                    const cols = row.split(',').map(c => c.replace(/"/g, '')); // Limpiar comillas
                    if(cols.length < 4) return;
                    
                    // Corregir ortografía de los datos de las columnas clave
                    const tipo = corregirTexto(cols[1]);
                    const detalle = corregirTexto(cols[2]);
                    const estado = corregirTexto(cols[4] || 'Pendiente');

                    if(tipo.includes("Viaje")) viajes++;
                    if(tipo.includes("Conductor")) cond++;

                    html += `<tr>
                        <td>${cols[0]}</td>
                        <td><b>${tipo}</b></td>
                        <td>${detalle}</td>
                        <td>${cols[3]}</td>
                        <td><span class="status-pill">${estado}</span></td>
                    </tr>`;
                });

                document.getElementById('table-body').innerHTML = html;
                document.getElementById('total-val').innerText = rows.length;
                document.getElementById('viajes-val').innerText = viajes;
                document.getElementById('cond-val').innerText = cond;

            } catch (error) {
                console.error("Error cargando datos:", error);
                document.getElementById('table-body').innerHTML = "Error al conectar con Google Sheets.";
            }
        }

        cargarDatos();
        setInterval(cargarDatos, 60000);
    </script>
</body>
</html>
