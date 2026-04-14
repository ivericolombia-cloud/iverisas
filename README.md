# iverisas
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
        .status-pill { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; background: #d4edda; color: #155724; }
        .btn-refresh { background: var(--accent); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; float: right; }
    </style>
</head>
<body>

    <div class="sidebar">
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
        // PEGA AQUÍ EL ENLACE QUE COPIASTE EN EL PASO 1
        const CSV_URL = 'TU_ENLACE_AQUI_QUE_TERMINA_EN_OUTPUT_CSV';

        async function cargarDatos() {
            try {
                const response = await fetch(CSV_URL);
                const data = await response.text();
                const rows = data.split('\n').slice(1); // Quitamos el encabezado
                
                let html = "";
                let viajes = 0;
                let cond = 0;

                rows.reverse().forEach(row => {
                    const cols = row.split(',');
                    if(cols.length < 4) return;
                    
                    if(cols[1].includes("Viaje")) viajes++;
                    if(cols[1].includes("Conductor")) cond++;

                    html += `<tr>
                        <td>${cols[0]}</td>
                        <td><b>${cols[1]}</b></td>
                        <td>${cols[2]}</td>
                        <td>${cols[3]}</td>
                        <td><span class="status-pill">${cols[4] || 'Pendiente'}</span></td>
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

        // Cargar al iniciar
        cargarDatos();
        // Auto-actualizar cada 1 minuto
        setInterval(cargarDatos, 60000);
    </script>
</body>
</html>
