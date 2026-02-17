(function() {
    'use strict';
    
    console.log('🚀 Фінальна версія');
    
    setTimeout(function() {
        console.log('Додаємо кнопку...');
        
        // Шукаємо контейнер
        var container = $('.full-start__buttons, .full-start-new__buttons, .card__info, .info-block').first();
        
        if (container.length) {
            console.log('✅ Контейнер знайдено');
            
            // Створюємо кнопку як копію сусідніх кнопок
            var button = $('<div class="full-start__button selector">' +
                           '<div style="font-size: 24px; width: 1.2em;">⚖️</div>' +
                           '<span>Балансер</span>' +
                           '</div>');
            
            // Додаємо в контейнер
            container.append(button);
            
            // Правильний обробник подій для Lampa
            button.on('hover:enter click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('✅ Кнопку натиснуто');
                
                // Показуємо повідомлення
                Lampa.Noty.show('Працює!');
                
                // Через 2 секунди прибираємо
                setTimeout(function() {
                    Lampa.Noty.hide();
                }, 2000);
            });
            
            console.log('✅ Кнопку додано');
        } else {
            console.log('❌ Контейнер не знайдено');
        }
    }, 3000);
})();
