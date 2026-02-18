(function(){
    var plugin = {
        title: 'Балансери',
        id: 'balancers_plugin',

        init: function(){
            // Реєструємо плагін у системі
            Lampa.Component.add('balancers_plugin', this.component, this);

            // Хук на картку відео
            Lampa.Listener.follow('full', function(e){
                if(e.type === 'build' && e.card){
                    // додаємо кнопку в картку
                    var btn = $('<div class="balancer_button selector">Балансери</div>');
                    btn.on('hover:enter', function(){
                        plugin.showMenu(e.card);
                    });
                    e.card.find('.full-start').append(btn);
                }
            });
        },

        // Меню вибору балансера
        showMenu: function(card){
            var balanceMenu = Lampa.Select.create({
                title: 'Виберіть балансер',
                items: [
                    {title: 'Балансер 1', url: 'https://balancer1/api/video?id='+card.data.id},
                    {title: 'Балансер 2', url: 'https://balancer2/api/video?id='+card.data.id}
                ],
                onSelect: function(item){
                    plugin.loadVideos(item.url);
                }
            });

            Lampa.Select.open(balanceMenu);
        },

        // Завантаження відео
        loadVideos: function(url){
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
        },

        component: function(){}
    };

    plugin.init();
})();
