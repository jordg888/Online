(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;

        this.init = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.render(e.data, e.object.activity.render());
                }
            });
        };

        this.render = function (data, html) {
            $('.lampa-kozak-btn').remove();
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #27ae60 !important; color: #fff !important; border-radius: 5px; font-weight: bold;"><span>КОЗАК (SOCKET)</span></div>');
            
            btn.on('hover:enter click', function () { 
                console.log('Kozak:', 'Кнопку натиснуто!');
                _this.search(data.movie); 
            });
            
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            var clean_title = title.replace(/[:]/g, '');
            Lampa.Noty.show('Пошук через Socket...');
            
            var url = 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(clean_title);
            
            console.log('Kozak:', 'Відправка запиту через Socket на', url);

            // Використовуємо NativeWsClient, який спілкується з kurwa-bober.ninja
            Lampa.NativeWsClient.send('proxy', {
                url: url,
                method: 'GET'
            }, function(res) {
                console.log('Kozak Socket Відповідь:', res);
                
                // Перевіряємо, чи повернув сокет правильну структуру даних
                if (res && res.data && res.data.iframe) {
                    var video = res.data.iframe;
                    if (video.indexOf('//') === 0) video = 'https:' + video;
                    
                    Lampa.Select.show({
                        title: 'Знайдено на Alloha',
                        items: [{title: 'Дивитися: ' + title, file: video}],
                        onSelect: function (item) {
                            Lampa.Player.play({
                                url: item.file,
                                title: title
                            });
                        }
                    });
                } else {
                    Lampa.Noty.show('База не знайдена через Socket');
                    console.log('Kozak:', 'Неправильний формат даних', res);
                }
            }, function(err) {
                Lampa.Noty.show('Помилка Socket з’єднання');
                console.log('Kozak Socket Помилка:', err);
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
