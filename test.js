(function(){
    Lampa.Listener.follow('full', function(e){
        if(e.type === 'build' && e.card){
            // створюємо кнопку
            var btn = $('<div class="selector">Балансери</div>');
            
            // додаємо в блок кнопок картки
            e.card.find('.full-start').append(btn);

            // реакція на натискання
            btn.on('hover:enter', function(){
                var menu = Lampa.Select.create({
                    title: 'Виберіть балансер',
                    items: [
                        {title: 'Балансер 1', url: 'https://balancer1/video.m3u8'},
                        {title: 'Балансер 2', url: 'https://balancer2/video.m3u8'}
                    ],
                    onSelect: function(item){
                        Lampa.Player.play({
                            title: item.title,
                            url: item.url
                        });
                    }
                });

                Lampa.Select.open(menu);
            });
        }
    });
})();
