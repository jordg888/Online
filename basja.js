(function() {
    // Назва та версія плагіна
    var pluginName = 'Universal Media Plugin';
    var version = '1.0.0';
    
    // Конфігурація балансерів
    var balancers = [
        {
            name: 'Балансер 1',
            url: 'https://balanser1.com',
            priority: 1
        },
        {
            name: 'Балансер 2',
            url: 'https://balanser2.com',
            priority: 2
        },
        {
            name: 'Балансер 3', 
            url: 'https://balanser3.com',
            priority: 3
        }
    ];

    // Основний клас плагіна
    function UniversalPlugin() {
        this.init = function() {
            console.log(pluginName + ' v' + version + ' ініціалізовано');
            this.registerSources();
        };

        this.registerSources = function() {
            // Реєструємо джерело контенту
            Lampa.Provider.add({
                name: 'universal_media',
                title: 'Universal Media',
                search: this.search.bind(this),
                item: this.getItem.bind(this),
                watch: this.watch.bind(this)
            });
        };

        // Пошук контенту
        this.search = function(query, page, callback) {
            var results = {
                items: [],
                page: page,
                total: 0
            };

            // Тут логіка пошуку через балансери
            this.loadFromBalancers('/search?q=' + encodeURIComponent(query) + '&page=' + page, function(data) {
                if (data && data.items) {
                    results.items = data.items.map(function(item) {
                        return {
                            id: item.id,
                            title: item.title,
                            poster: item.poster,
                            year: item.year,
                            type: item.type || 'movie' // movie, serial, cartoon
                        };
                    });
                    results.total = data.total || results.items.length;
                }
                callback(results);
            });
        };

        // Отримання деталей елементу
        this.getItem = function(item, callback) {
            this.loadFromBalancers('/details/' + item.id, function(data) {
                if (data) {
                    item.description = data.description;
                    item.genres = data.genres;
                    item.country = data.country;
                    item.duration = data.duration;
                    
                    // Для серіалів додаємо інформацію про сезони
                    if (item.type === 'serial') {
                        item.seasons = data.seasons;
                    }
                }
                callback(item);
            });
        };

        // Відтворення контенту
        this.watch = function(item, callback) {
            // Отримуємо посилання на відео через балансери
            this.getVideoUrl(item, function(videoData) {
                if (videoData && videoData.url) {
                    Lampa.Player.play({
                        url: videoData.url,
                        title: item.title,
                        subtitle: videoData.subtitle || null,
                        audio: videoData.audio || null
                    });
                }
                callback();
            });
        };

        // Отримання URL відео через балансери з автоматичним перемиканням
        this.getVideoUrl = function(item, callback) {
            var self = this;
            var currentBalancer = 0;
            
            function tryNextBalancer() {
                if (currentBalancer >= balancers.length) {
                    console.error('Всі балансери недоступні');
                    Lampa.Notify.show('Помилка завантаження відео');
                    callback(null);
                    return;
                }

                var balancer = balancers[currentBalancer];
                console.log('Спроба підключення до ' + balancer.name);
                
                self.loadFromBalancer(balancer, '/video/' + item.id, function(response) {
                    if (response && response.url) {
                        callback(response);
                    } else {
                        currentBalancer++;
                        tryNextBalancer();
                    }
                });
            }
            
            tryNextBalancer();
        };

        // Завантаження даних з балансерів
        this.loadFromBalancers = function(path, callback) {
            var self = this;
            var currentBalancer = 0;
            
            function tryBalancer() {
                if (currentBalancer >= balancers.length) {
                    console.error('Всі балансери недоступні');
                    callback(null);
                    return;
                }

                var balancer = balancers[currentBalancer];
                self.loadFromBalancer(balancer, path, function(response) {
                    if (response) {
                        callback(response);
                    } else {
                        currentBalancer++;
                        tryBalancer();
                    }
                });
            }
            
            tryBalancer();
        };

        // Завантаження з конкретного балансера
        this.loadFromBalancer = function(balancer, path, callback) {
            var url = balancer.url + path;
            
            Lampa.Utils.fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                callback(data);
            })
            .catch(function(error) {
                console.error('Помилка балансера ' + balancer.name + ': ' + error);
                callback(null);
            });
        };
    }

    // Додаємо плагін до Lampa
    if (typeof Lampa !== 'undefined' && Lampa.Plugin) {
        Lampa.Plugin.add(new UniversalPlugin());
        console.log(pluginName + ' v' + version + ' успішно завантажено');
    }
})();
