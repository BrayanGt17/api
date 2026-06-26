// stream.js
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const targetUrl = 'https://latamvidzfy.org/dsportsar.php';

        const response = await fetch(targetUrl, {
            headers: {
                'Referer': 'https://futbol-libres.su/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            return res.status(response.status).send(`Error en el servidor de stream: ${response.status}`);
        }

        let html = await response.text();

        // 1. Inyectar un antibloqueo al inicio del HTML para congelar intentos de redirección
        const antiRedirectScript = `
        <script>
            // Bloquear intentos de romper el iframe o redirigir la pestaña
            window.onbeforeunload = function() { return "Bloqueando redirección automática."; };
            Object.defineProperty(window, 'location', {
                writable: false,
                configurable: false,
                value: window.location
            });
        </script>
        `;
        html = html.replace('<head>', '<head>' + antiRedirectScript);

        // 2. Romper manualmente los scripts comunes de redirección antipiratería en el texto
        html = html.replace(/window\.location\.href/g, '// window.location.href');
        html = html.replace(/window\.location\.replace/g, '// window.location.replace');
        html = html.replace(/top\.location/g, '// top.location');

        // 3. Corregir las rutas de las dependencias e imágenes
        html = html.replace(/src="/g, 'src="https://latamvidzfy.org/');
        html = html.replace(/href="/g, 'href="https://latamvidzfy.org/');

        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
