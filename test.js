(function() {
    'use strict';
    
    console.log('Плагін запущено');
    
    // Функція додавання кнопки
    function addButton() {
        // Шукаємо контейнер з кнопками
        var container = $('.full-start__buttons').first();
        
        if (container.length) {
            // Шукаємо кнопку "Онлайн"
            var onlineButton = container.find('.selector:contains("Онлайн")').first();
            
            if (onlineButton.length) {
                // Створюємо кнопку як копію сусідньої
                var button = $('<div class="selector full-start__button">' +
                               '<div>⚖️</div>' +
                               '<span>Балансер</span>' +
                               '</div>');
                
                // Додаємо після кнопки "Онлайн"
                onlineButton.after(button);
                
                // Додаємо обробник
                button.on('click', function() {
                    alert('Працює!');
                });
                
                console.log('Кнопку додано після Онлайн');
            }
        }
    }
    
    // Перевіряємо кожну секунду
    setInterval(function() {
        if ($('.full-start__buttons').length) {
            addButton();
        }
    }, 1000);
})();
