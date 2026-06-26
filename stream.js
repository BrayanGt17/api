// stream.js
module.exports = async (req, res) => {
    // Forzar las cabeceras CORS para que tu web de GitHub pueda leerlo sin bloqueos
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const targetUrl = 'https://latamvidzfy.org/dsportsar.php';

        // Petición al backend emulando el referer de Fútbol Libre
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

        // Reemplazar rutas relativas para que no se rompan las imágenes ni scripts internos
        html = html.replace(/src="/g, 'src="https://latamvidzfy.org/');
        html = html.replace(/href="/g, 'href="https://latamvidzfy.org/');

        // Enviar la respuesta como HTML puro al iframe
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
