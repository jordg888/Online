// Додай цей блок усередину функції click у твоєму kozak.js
btn.addEventListener('click', function () {
    var movie = e.data.movie;
    
    // Використовуємо метод Lampa для відкриття пошуку по балансерах
    // Це дозволить кнопці "КОЗАК ТВ" викликати список доступних джерел
    Lampa.Api.search({
        query: movie.title || movie.name
    }).then(function(){
        // Або відкриваємо специфічний плеєр, який вміє обходити блокування
        var videoUrl = 'https://vjs.su/embed/tmdb/' + movie.id;
        
        Lampa.Player.run({
            url: videoUrl,
            title: movie.title
        });
    });
});

