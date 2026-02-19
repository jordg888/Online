this.search = function (movie) {
            var title = movie.title || movie.name;
            Lampa.Noty.show('Шукаю на Козаку: ' + title);

            // Використовуємо http замість https як запасний варіант, якщо сертифікат битий
            var api_url = 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);

            $.ajax({
                url: api_url,
                method: 'GET',
                dataType: 'json',
                success: function(res) {
                    var video = res.data ? (res.data.iframe_url || res.data.iframe) : (res.iframe_url || res.iframe);
                    if (video) {
                        if (video.indexOf('//') === 0) video = 'https:' + video;
                        Lampa.Player.play({ url: video, title: title });
                    } else {
                        Lampa.Noty.show('Відео не знайдено');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (errorThrown === "" || textStatus === "error") {
                        Lampa.Noty.show('Проблема з сертифікатом API. Відкрийте api.alloha.tv у браузері та натисніть "Дозволити"');
                    } else {
                        Lampa.Noty.show('Помилка мережі: ' + textStatus);
                    }
                    console.log('Kozak Error Details:', textStatus, errorThrown);
                }
            });
        };
