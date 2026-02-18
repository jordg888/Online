(function(){
    var plugin = {
        title: 'Балансери',
        id: 'balancers_plugin',

        // Реєстрація плагіна
        init: function(){
            Lampa.Component.add('balancers_plugin', this.component, this);
        },

        // Основна логіка
        component: function(){
            var self = this;

            // Додаємо кнопку в картку відео
            this.card = function(object){
                var button = $('<div class="balancer_button">Балансери</div>');
                button.on('click', function(){
                    self.showMenu(object);
                });
                object.card.append(button);
            };

            // Меню вибору балансера
            this.showMenu = function(object){
                var balanceMenu = Lampa.Select.create({
                    title: 'Виберіть балансер',
                    items: [
                        {title: 'Балансер 1', url: 'https://balancer1/api/video?id='+object.id},
                        {title: 'Балансер 2', url: 'https://balancer2/api/video?id='+object.id},
                        {title: 'Балансер 3', url: 'https://balancer3/api/video?id='+object.id}
                    ],
                    onSelect: function(item){
                        self.loadVideos(item.url);
                    }
                });

                Lampa.Select.open(balanceMenu);
            };

            // Завантаження списку відео з вибраного балансера
            this.loadVideos = function(url){
                var network = new Lampa.Reguest();
                network.silent(url, function(data){
                    var videoMenu = Lampa.Select.create({
                        title: 'Виберіть відео',
                        items: data.results.map(function(video){
                            return {title: video.name, url: video.stream};
                        }),
                        onSelect: function(video){
                            Lampa.Player.play({
                                title: video.title,
                                url: video.url
                            });
                        }
                    });

                    Lampa.Select.open(videoMenu);
                });
            };
        }
    };

    plugin.init();
})();
