/**
 * Lampa TV Plugin - Балансери для перегляду фільмів
 * Версія: 2.0.0
 */

(function() {
    'use strict';

    // Налаштування плагіну
    const config = {
        name: 'Custom Balancers',
        version: '2.0.0',
        // API ключі для балансерів
        videocdn_token: '3i40G5TSECmLF77oAqnEgbx61ZWaOYE8',
        collaps_token: 'eedefb541aeba4dc661de25b2e0f4b1f'
    };

    // Функція для HTTP запитів
    function request(url, callback, error) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.timeout = 10000;
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        callback(JSON.parse(xhr.responseText));
                    } catch(e) {
                        callback(xhr.responseText);
                    }
                } else if (error) {
                    error(xhr.status);
                }
            }
        };
        xhr.onerror = function() {
            if (error) error('network');
        };
        xhr.send();
    }

    // ===== VIDEOCDN БАЛАНСЕР =====
    function VideoCDNBalaner(card) {
        this.card = card;
        this.url = null;
    }

    VideoCDNBalaner.prototype = {
        search: function(callback) {
            var _this = this;
            var url = 'https://videocdn.tv/api/short?api_token=' + config.videocdn_token;
            
            if (this.card.imdb_id) {
                url += '&imdb_id=' + this.card.imdb_id;
            } else if (this.card.id) {
                url += '&tmdb_id=' + this.card.id;
            } else {
                callback([]);
                return;
            }

            request(url, function(data) {
                if (data && data.result && data.result.length > 0) {
                    var results = [];
                    data.result.forEach(function(item) {
                        if (item.link) {
                            results.push({
                                title: item.translation || 'Оригінал',
                                url: item.link,
                                quality: item.quality || '720p',
                                info: item.quality ? item.quality + 'p' : ''
                            });
                        }
                    });
                    callback(results);
                } else {
                    callback([]);
                }
            }, function() {
                callback([]);
            });
        }
    };

    // ===== KINOBOX БАЛАНСЕР =====
    function KinoboxBalaner(card) {
        this.card = card;
    }

    KinoboxBalaner.prototype = {
        search: function(callback) {
            var url = 'https://kinobox.tv/api/players?';
            
            if (this.card.kinopoisk_id) {
                url += 'kinopoisk=' + this.card.kinopoisk_id;
            } else if (this.card.imdb_id) {
                url += 'imdb=' + this.card.imdb_id;
            } else if (this.card.id) {
                url += 'tmdb=' + this.card.id;
            } else {
                callback([]);
                return;
            }

            request(url, function(data) {
                if (data && Array.isArray(data)) {
                    var results = [];
                    data.forEach(function(player) {
                        if (player.iframeUrl || player.url) {
                            results.push({
                                title: player.name || 'Kinobox',
                                url: player.iframeUrl || player.url,
                                quality: player.quality || '720p',
                                info: player.quality || ''
                            });
                        }
                    });
                    callback(results);
                } else {
                    callback([]);
                }
            }, function() {
                callback([]);
            });
        }
    };

    // ===== COLLAPS БАЛАНСЕР =====
    function CollapsBalaner(card) {
        this.card = card;
    }

    CollapsBalaner.prototype = {
        search: function(callback) {
            var title = this.card.title || this.card.name || '';
            if (!title) {
                callback([]);
                return;
            }

            var url = 'https://api.bhcesh.me/list?token=' + config.collaps_token + 
                      '&title=' + encodeURIComponent(title);

            request(url, function(data) {
                if (data && data.results && data.results.length > 0) {
                    var results = [];
                    data.results.forEach(function(item) {
                        if (item.iframe_url) {
                            results.push({
                                title: item.translation || 'Оригінал',
                                url: item.iframe_url,
                                quality: '720p',
                                info: ''
                            });
                        }
                    });
                    callback(results);
                } else {
                    callback([]);
                }
            }, function() {
                callback([]);
            });
        }
    };

    // ===== ГОЛОВНИЙ ПЛАГІН =====
    function initPlugin() {
        console.log('[Custom Balancers] Plugin loaded v' + config.version);

        // Реєструємо балансери в Lampa
        if (window.Lampa && Lampa.Balancer) {
            
            // VideoCDN
            Lampa.Balancer.add({
                name: 'videocdn',
                title: 'VideoCDN',
                constructor: VideoCDNBalaner
            });

            // Kinobox
            Lampa.Balancer.add({
                name: 'kinobox',
                title: 'Kinobox',
                constructor: KinoboxBalaner
            });

            // Collaps
            Lampa.Balancer.add({
                name: 'collaps',
                title: 'Collaps',
                constructor: CollapsBalaner
            });

            console.log('[Custom Balancers] Balancers registered successfully');
        } else {
            console.log('[Custom Balancers] Waiting for Lampa...');
            setTimeout(initPlugin, 1000);
        }
    }

    // Запускаємо плагін
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlugin);
    } else {
        initPlugin();
    }

})();
