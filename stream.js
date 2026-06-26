// api/stream.js
export default async function handler(req, res) {
    // 1. Habilitar CORS para que tu web de GitHub pueda consultar este backend
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const targetUrl = 'https://latamvidzfy.org/dsportsar.php';

        // 2. Hacer la petición al servidor original engañándolo con el Referer correcto
        const response = await fetch(targetUrl, {
            headers: {
                'Referer': 'https://futbol-libres.su/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });

        if (!response.ok) {
            throw new Error(`Error en el servidor remoto: ${response.status}`);
        }

        let html = await response.text();

        // 3. Modificar el HTML interno antes de enviarlo a tu web
        // Esto asegura que los scripts remotos busquen sus archivos en el dominio correcto
        html = html.replace(/src="/g, 'src="https://latamvidzfy.org/');
        html = html.replace(/href="/g, 'href="https://latamvidzfy.org/');

        // Enviar el HTML limpio y autorizado a tu iframe
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
