this.search = function (movie) {
            var title = movie.title || movie.name;
            // Використовуємо інший домен Kinobox, який частіше працює для вбудовування
            var kinobox_url = 'https://kinobox.tv/embed/tmdb/' + movie.id;

            Lampa.Noty.show('Запускаю Козак-Вікно...');

            // ВАЖЛИВО: Замість Lampa.Player.play використовуємо Lampa.Component.add('iframe')
            // Це змусить Лампу відкрити повноцінну сторінку з кнопками плеєра
            Lampa.Component.add('iframe', {
                title: 'Козак ТВ: ' + title,
                url: kinobox_url,
                clean: true // очистити інтерфейс Лампи, щоб не заважав
            });
        };
