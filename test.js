/**
 * Lampa TV Plugin - Балансери для перегляду фільмів та серіалів
 * Версія: 1.0.0
 * Автор: Custom Plugin
 */

(function() {
    'use strict';

    // Конфігурація плагіну
    const PLUGIN_CONFIG = {
        name: 'Custom Balancers',
        version: '1.0.0',
        author: 'Lampa Plugin',
        description: 'Плагін для перегляду фільмів з різних балансерів'
    };

    // Список джерел (балансерів)
    const SOURCES = {
        // Відео CDN джерела
        videocdn: {
            name: 'VideoCDN',
            enabled: true,
            baseUrl: 'https://videocdn.tv/api',
            getMovieUrl: function(tmdbId, imdbId) {
                if (imdbId) {
                    return `https://videocdn.tv/api/short?api_token=3i40G5TSECmLF77oAqnEgbx61ZWaOYE8&imdb_id=${imdbId}`;
                }
                return `https://videocdn.tv/api/short?api_token=3i40G5TSECmLF77oAqnEgbx61ZWaOYE8&tmdb_id=${tmdbId}`;
            }
        },
        // Collaps - альтернативне джерело
        collaps: {
            name: 'Collaps',
            enabled: true,
            getSearchUrl: function(query) {
                return `https://api.bhcesh.me/list?token=eedefb541aeba4dc661de25b2e0f4b1f&title=${encodeURIComponent(query)}`;
            }
        },
        // Kinobox - API для фільмів
        kinobox: {
            name: 'Kinobox',
            enabled: true,
            getMovieUrl: function(kpId, imdbId, tmdbId) {
                if (kpId) {
                    return `https://kinobox.tv/api/players?kinopoisk=${kpId}`;
                }
                if (imdbId) {
                    return `https://kinobox.tv/api/players?imdb=${imdbId}`;
                }
                if (tmdbId) {
                    return `https://kinobox.tv/api/players?tmdb=${tmdbId}`;
                }
                return null;
            }
        },
        // Rezka - онлайн кінотеатр
        rezka: {
            name: 'Rezka',
            enabled: true,
            baseUrl: 'https://voidboost.net',
            getEmbedUrl: function(id) {
                return `https://voidboost.net/embed/${id}`;
            }
        }
    };

    // Утиліти для роботи з API
    const Utils = {
        // HTTP запит
        request: function(url, callback, errorCallback) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.timeout = 15000;
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            callback(data);
                        } catch (e) {
                            callback(xhr.responseText);
                        }
                    } else {
                        if (errorCallback) errorCallback(xhr.status);
                    }
                }
            };
            xhr.onerror = function() {
                if (errorCallback) errorCallback('network_error');
            };
            xhr.ontimeout = function() {
                if (errorCallback) errorCallback('timeout');
            };
            xhr.send();
        },

        // Парсинг параметрів з URL
        parseQueryString: function(url) {
            const params = {};
            const parser = document.createElement('a');
            parser.href = url;
            const query = parser.search.substring(1);
            const vars = query.split('&');
            for (let i = 0; i < vars.length; i++) {
                const pair = vars[i].split('=');
                params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
            return params;
        },

        // Форматування часу
        formatTime: function(seconds) {
            const hrs = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            if (hrs > 0) {
                return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    };

    // Компонент для роботи з VideoCDN
    const VideoCDNComponent = {
        name: 'videocdn',
        
        search: function(query, callback) {
            // VideoCDN не має прямого пошуку, використовуємо ID
            callback([]);
        },

        getStream: function(movie, callback) {
            const tmdbId = movie.id;
            const imdbId = movie.imdb_id;
            
            if (!tmdbId && !imdbId) {
                callback({ error: 'No ID found' });
                return;
            }

            const url = SOURCES.videocdn.getMovieUrl(tmdbId, imdbId);
            
            Utils.request(url, function(data) {
                if (data && data.result && data.result.length > 0) {
                    const result = data.result[0];
                    const streams = [];
                    
                    // Обробка різних типів контенту
                    if (result.seasons) {
                        // Серіал
                        streams.push({
                            type: 'serial',
                            title: 'VideoCDN - Серіал',
                            seasons: result.seasons,
                            translator: result.translation || 'Оригінал'
                        });
                    } else if (result.link) {
                        // Фільм
                        streams.push({
                            type: 'movie',
                            title: 'VideoCDN - Фільм',
                            url: result.link,
                            quality: result.quality || '720p',
                            translator: result.translation || 'Оригінал'
                        });
                    }
                    
                    callback({ streams: streams });
                } else {
                    callback({ error: 'No streams found' });
                }
            }, function(error) {
                callback({ error: 'Request failed: ' + error });
            });
        }
    };

    // Компонент для роботи з Kinobox
    const KinoboxComponent = {
        name: 'kinobox',

        getStream: function(movie, callback) {
            const kpId = movie.kinopoisk_id;
            const imdbId = movie.imdb_id;
            const tmdbId = movie.id;

            const url = SOURCES.kinobox.getMovieUrl(kpId, imdbId, tmdbId);
            
            if (!url) {
                callback({ error: 'No valid ID found' });
                return;
            }

            Utils.request(url, function(data) {
                if (data && Array.isArray(data)) {
                    const streams = data.map(player => ({
                        type: player.type || 'movie',
                        title: `Kinobox - ${player.name || 'Плеєр'}`,
                        url: player.iframeUrl || player.url,
                        quality: player.quality || '720p'
                    }));
                    callback({ streams: streams });
                } else {
                    callback({ error: 'No streams found' });
                }
            }, function(error) {
                callback({ error: 'Request failed: ' + error });
            });
        }
    };

    // Головний компонент плагіну
    const BalancerPlugin = {
        name: PLUGIN_CONFIG.name,
        version: PLUGIN_CONFIG.version,
        
        // Реєстрація джерел
        init: function() {
            console.log(`[${PLUGIN_CONFIG.name}] Plugin initialized v${PLUGIN_CONFIG.version}`);
            
            // Додаємо джерела до Lampa
            this.registerSources();
            
            // Додаємо налаштування
            this.addSettings();
        },

        registerSources: function() {
            // Реєстрація VideoCDN
            if (SOURCES.videocdn.enabled) {
                Lampa.Source.add('videocdn', {
                    title: SOURCES.videocdn.name,
                    component: VideoCDNComponent
                });
            }

            // Реєстрація Kinobox
            if (SOURCES.kinobox.enabled) {
                Lampa.Source.add('kinobox', {
                    title: SOURCES.kinobox.name,
                    component: KinoboxComponent
                });
            }
        },

        addSettings: function() {
            // Додаємо налаштування плагіну
            Lampa.Settings.add('balancer_plugin', {
                title: PLUGIN_CONFIG.name,
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>',
                items: [
                    {
                        title: 'VideoCDN',
                        type: 'toggle',
                        name: 'videocdn_enabled',
                        default: true
                    },
                    {
                        title: 'Kinobox',
                        type: 'toggle',
                        name: 'kinobox_enabled',
                        default: true
                    },
                    {
                        title: 'Collaps',
                        type: 'toggle',
                        name: 'collaps_enabled',
                        default: true
                    },
                    {
                        title: 'Rezka',
                        type: 'toggle',
                        name: 'rezka_enabled',
                        default: true
                    }
                ]
            });
        },

        // Отримання всіх активних джерел
        getActiveSources: function() {
            const active = [];
            const settings = Lampa.Storage.get('balancer_settings') || {};
            
            Object.keys(SOURCES).forEach(key => {
                const settingKey = `${key}_enabled`;
                if (settings[settingKey] !== false) {
                    active.push(SOURCES[key]);
                }
            });
            
            return active;
        }
    };

    // Ініціалізація плагіну
    function initPlugin() {
        if (typeof Lampa !== 'undefined') {
            BalancerPlugin.init();
        } else {
            // Чекаємо завантаження Lampa
            document.addEventListener('lampa_ready', function() {
                BalancerPlugin.init();
            });
        }
    }

    // Запуск плагіну
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlugin);
    } else {
        initPlugin();
    }

    // Експорт для використання в інших модулях
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = BalancerPlugin;
    }

    // Глобальний доступ
    window.LampaBalancerPlugin = BalancerPlugin;

})();
