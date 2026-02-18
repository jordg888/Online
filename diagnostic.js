(function() {
    'use strict';
    
    console.log('🔍 ДІАГНОСТИКА: Плагін завантажено');
    
    // Чекаємо 5 секунд поки завантажиться сторінка
    setTimeout(function() {
        console.log('🔍 Починаємо пошук елементів...');
        
        // Масив селекторів для пошуку
        var selectors = [
            '.full-start__buttons',
            '.full-start__button',
            '.selector',
            '[class*="button"]',
            '.card__buttons',
            '.online-btn'
        ];
        
        // Перевіряємо кожен селектор
        for (var i = 0; i < selectors.length; i++) {
            var elements = $(selectors[i]);
            console.log('🔍 Селектор "' + selectors[i] + '" знайдено: ' + elements.length);
            
            // Якщо знайшли елементи - виводимо їх
            if (elements.length > 0) {
                for (var j = 0; j < elements.length; j++) {
                    var html = elements[j].outerHTML;
                    console.log('  Елемент ' + j + ': ' + html.substring(0, 100) + '...');
                }
            }
        }
        
        // Шукаємо кнопку з текстом "Онлайн"
        var onlineBtn = $('.selector:contains("Онлайн")');
        console.log('🔍 Кнопка "Онлайн" знайдена: ' + onlineBtn.length);
        
        console.log('🔍 ДІАГНОСТИКА ЗАВЕРШЕНА');
        
    }, 5000);
})();
