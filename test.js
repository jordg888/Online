/**
 * Lampa TV Plugin - Балансери для перегляду фільмів
 * Версія: 3.0.0
 */

(function() {
    'use strict';

    // Налаштування плагіну
    var config = {
        name: 'Custom Balancers',
        version: '3.0.0',
        videocdn_token: '3i40G5TSECmLF77oAqnEgbx61ZWaOYE8',
        collaps_token: 'eedefb541aeba4dc661de25b2e0f4b1f'
    };

    // Перевіряємо чи завантажилась Lampa
    function startPlugin() {
        if (typeof Lampa === 'undefined') {
            setTimeout(startPlugin, 500);
            return;
        }
        
        console.log('[Custom Balancers] Starting plugin v' + config.version);
        initPlugin();
    }

    // ===== VIDEOCDN БАЛАНСЕР =====
    function VideoCDNBalaner(card) {
        this.card = card;
    }

    VideoCDNBalaner.prototype = {
        search: function(callback) {
            var url = 'https://videocdn.tv/api/short?api_token=' + config.videocdn_token;
            
            if (this.card.imdb_id) {
                url += '&imdb_id=' + this.card.imdb_id;
            } else if (this.card.id) {
                url += '&tmdb_id=' + this.card.id;
            } else {
                callback([]);
                return;
            }

            var net = new Lampa.Reguest();
            net.timeout(15000);
            net.native(url, function(data) {
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

            var net = new Lampa.Reguest();
            net.timeout(15000);
            net.native(url, function(data) {
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

            var net = new Lampa.Reguest();
            net.timeout(15000);
            net.native(url, function(data) {
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

    // ===== ІНІЦІАЛІЗАЦІЯ ПЛАГІНУ =====
    function initPlugin() {
        // Реєструємо балансери
        Lampa.Source.add('videocdn', {
            title: 'VideoCDN',
            balanser: VideoCDNBalaner
        });

        Lampa.Source.add('kinobox', {
            title: 'Kinobox',
            balanser: KinoboxBalaner
        });

        Lampa.Source.add('collaps', {
            title: 'Collaps',
            balanser: CollapsBalaner
        });

        console.log('[Custom Balancers] Balancers registered: videocdn, kinobox, collaps');
        
        // Показуємо повідомлення про успішне завантаження
        if (Lampa.Noty) {
            Lampa.Noty.show('Custom Balancers завантажено!');
        }
    }

    // Запускаємо плагін
    startPlugin();

})();
