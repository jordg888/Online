(function() {
    'use strict';
    
    // Простий плагін з кнопкою
    setTimeout(function() {
        // Шукаємо контейнер з кнопками
        var container = $('.full-start__buttons');
        
        if (container.length) {
            // Створюємо кнопку
            var button = $('<div class="selector" style="padding: 10px; background: #ff5722; color: white; border-radius: 5px; margin: 5px;">⚖️ БАЛАНСЕР</div>');
            
            // Додаємо кнопку
            container.append(button);
            
            // Обробник кліку
            button.on('click', function() {
                console.log('Кнопку натиснуто');
            });
        }
    }, 2000);
})();
