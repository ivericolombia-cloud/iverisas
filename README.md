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
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin IVERI - Control de Servicios</title>
    <script src="https://angelcristancho32@gmail.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .sidebar-item:hover { background-color: #1e3a8a; border-left: 4px solid #facc15; }
        .bg-custom-blue { background-color: #0d1b3e; }
        .text-custom-yellow { color: #facc15; }
        .modal-active { display: flex !important; }
    </style>
</head>
<body class="bg-gray-100 font-sans">

    <div class="flex h-screen overflow-hidden">
        <aside class="w-64 bg-custom-blue text-white flex-shrink-0 hidden md:flex flex-col">
            <div class="p-6 text-2xl font-bold text-custom-yellow border-b border-gray-700">
                GLOBAL TAXI
            </div>
            <nav class="mt-6 flex-1">
                <a href="#" class="sidebar-item flex items-center py-3 px-6 transition duration-200 bg-blue-900 border-l-4 border-yellow-400">
                    <i class="fas fa-tachometer-alt mr-3"></i> Dashboard
                </a>
                <a href="#" class="sidebar-item flex items-center py-3 px-6 transition duration-200">
                    <i class="fas fa-box mr-3"></i> Encomiendas
                </a>
                <a href="#" class="sidebar-item flex items-center py-3 px-6 transition duration-200">
                    <i class="fas fa-users mr-3"></i> Clientes Corp.
                </a>
            </nav>
        </aside>

        <main class="flex-1 flex flex-col overflow-y-auto">
            <header class="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
                <h1 class="text-xl font-semibold text-gray-800">Panel de Administración</h1>
                <div class="flex items-center space-x-4">
                    <input type="text" id="searchInput" onkeyup="filtrarTabla()" placeholder="Buscar servicio..." class="border rounded-lg px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span class="text-sm font-medium text-gray-600">IVERI SAS</span>
                </div>
            </header>

            <section class="p-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg shadow-sm border-b-4 border-blue-600">
                        <p class="text-gray-500 text-xs uppercase font-bold">Servicios Totales</p>
                        <p id="totalCount" class="text-3xl font-bold">0</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm border-b-4 border-yellow-500">
                        <p class="text-gray-500 text-xs uppercase font-bold">En Proceso</p>
                        <p class="text-3xl font-bold">12</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm border-b-4 border-green-500">
                        <p class="text-gray-500 text-xs uppercase font-bold">Manejamos todos los pagos</p>
                        <p class="text-sm mt-2 text-green-600 font-bold">Sistema Activo</p>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="p-6 border-b flex justify-between items-center bg-gray-50">
                        <h2 class="font-bold text-gray-700">Registro de Operaciones</h2>
                        <button onclick="toggleModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition flex items-center">
                            <i class="fas fa-plus mr-2"></i> Nuevo Servicio
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="text-gray-400 text-sm uppercase tracking-wider">
                                    <th class="py-4 px-6 font-semibold">ID</th>
                                    <th class="py-4 px-6 font-semibold">Cliente</th>
                                    <th class="py-4 px-6 font-semibold">Destino</th>
                                    <th class="py-4 px-6 font-semibold">Estado</th>
                                    <th class="py-4 px-6 font-semibold">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tableBody" class="text-gray-700">
                                </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <div id="modalServicio" class="hidden fixed inset-0 bg-black bg-opacity-60 items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
            <div class="p-6 border-b flex justify-between">
                <h3 class="text-xl font-bold text-gray-800">Nuevo Registro</h3>
                <button onclick="toggleModal()" class="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
            </div>
            <form id="serviceForm" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
                    <input type="text" id="custName" required class="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Destino / Dirección</label>
                    <input type="text" id="destName" required class="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Tipo de Servicio</label>
                    <select id="servType" class="w-full mt-1 border rounded-lg px-4 py-2 outline-none">
                        <option value="Activo">Taxi Chía</option>
                        <option value="Pendiente">Encomienda</option>
                        <option value="Completado">Corporativo</option>
                    </select>
                </div>
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition">
                    Confirmar Servicio
                </button>
            </form>
        </div>
    </div>

    <script>
        let servicios = [
            { id: '101', cliente: 'Juan Valdez', destino: 'Centro Chía', estado: 'Activo' },
            { id: '102', cliente: 'Logística SAS', destino: 'Bodega IVERI', estado: 'Pendiente' }
        ];

        function renderTabla() {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';
            servicios.forEach((s, index) => {
                const badgeColor = s.estado === 'Activo' ? 'bg-green-100 text-green-700' : 
                                   s.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700';
                
                tableBody.innerHTML += `
                    <tr class="border-b hover:bg-gray-50">
                        <td class="py-4 px-6 font-mono text-sm">#${s.id}</td>
                        <td class="py-4 px-6 font-medium">${s.cliente}</td>
                        <td class="py-4 px-6 text-gray-500">${s.destino}</td>
                        <td class="py-4 px-6">
                            <span class="px-3 py-1 rounded-full text-xs font-bold ${badgeColor}">${s.estado}</span>
                        </td>
                        <td class="py-4 px-6">
                            <button onclick="eliminar(${index})" class="text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
            document.getElementById('totalCount').innerText = servicios.length;
        }

        function toggleModal() {
            document.getElementById('modalServicio').classList.toggle('modal-active');
        }

        document.getElementById('serviceForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const nuevo = {
                id: Math.floor(Math.random() * 900) + 100,
                cliente: document.getElementById('custName').value,
                destino: document.getElementById('destName').value,
                estado: document.getElementById('servType').value
            };
            servicios.push(nuevo);
            renderTabla();
            e.target.reset();
            toggleModal();
        });

        function filtrarTabla() {
            const val = document.getElementById('searchInput').value.toLowerCase();
            const rows = document.querySelectorAll('#tableBody tr');
            rows.forEach(row => {
                row.style.display = row.innerText.toLowerCase().includes(val) ? '' : 'none';
            });
        }

        function eliminar(index) {
            servicios.splice(index, 1);
            renderTabla();
        }

        // Carga inicial
        renderTabla();
    </script>
</body>
</html>


