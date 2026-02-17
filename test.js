(function() {
    'use strict';
    
    console.log('🚀 Простий плагін');
    
    // Чекаємо 3 секунди і додаємо кнопку
    setTimeout(function() {
        console.log('Додаємо кнопку...');
        
        // Шукаємо контейнер з кнопками (який був підсвічений червоним)
        var container = $('.full-start__buttons, .full-start-new__buttons, .card__info, .info-block').first();
        
        if (container.length) {
            console.log('✅ Контейнер знайдено');
            
            // Створюємо кнопку
            var button = $('<div class="selector" style="display: inline-block; margin: 5px; padding: 10px 15px; background: #ff5722; color: white; border-radius: 5px; font-size: 16px;">⚖️ БАЛАНСЕР</div>');
            
            // Додаємо в контейнер
            container.append(button);
            
            // Обробник кліку
            button.on('click', function() {
                alert('Кнопка працює!');
            });
            
            console.log('✅ Кнопку додано');
        } else {
            console.log('❌ Контейнер не знайдено');
        }
    }, 3000);
})();
