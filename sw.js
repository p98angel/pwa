importScripts('js/sw-aux.js');
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/eric.jpg',
    'img/avatars/Kenny.jpg',
    'img/avatars/Kyle.jpg',
    'img/avatars/Randy.jpg',
    'img/avatars/stan.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'css/animate.css',
    'js/libs/jquery.js',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    // 'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
];
self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    const cancheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));
    e.waitUntil(Promise.all([cacheStatic, cancheInmutable]));
});

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(res => { //cache con respaldo en internet
        if (res)
            return res;
        else {
            console.log(e.request.url);
            return fetch(e.request).then(newRes => { //nos vamos a internet
                return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newRes)
            });

        }

    });
    e.respondWith(respuesta);
});