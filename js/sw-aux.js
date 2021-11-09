function actualizarCacheDinamico(dynamicCache, req, res) {
    if (res.ok) { //si lo encuntras en internete lo vas a regresar
        return caches.open(dynamicCache).then(cache => { //lo guardas en cache dinamico
            cache.put(req, res.clone());
            return res.clone();
        });

    } else {
        return res;
    }
}