(function(){
    Lampa.Listener.follow('full', function(e){
        if(e.type === 'build' && e.card){
            e.card.addAction({
                name: 'Балансери',
                icon: 'menu', // системна іконка
                onSelect: function(){
                    var menu = Lampa.Select.create({
                        title: 'Виберіть балансер',
                        items: [
                            {title: 'Балансер 1', url: 'https://balancer1/video.m3u8'},
                            {title: 'Балансер 2', url: 'https://balancer2/video.m3u8'}
                        ],
                        onSelect: function(item){
                            Lampa.Player.play({
                                title: item.title,
                               
