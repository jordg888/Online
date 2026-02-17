(function() {
    'use strict';
    
    console.log('🔍 ДІАГНОСТИКА: початок');
    
    setTimeout(function() {
        console.log('🔍 Шукаємо елементи...');
        
        // Перевіряємо всі можливі контейнери
        var selectors = [
            '.full-start__buttons',
            '.full-start-new__buttons', 
            '.card__buttons',
            '.card__actions',
            '.card__info',
            '.card-content',
            '.info-block',
            '.buttons-block',
            '.card__content',
            '.info-panel',
            '.button-panel'
        ];
        
        var found = false;
        
        selectors.forEach(function(selector) {
            var elements = $(selector);
            console.log('🔍 Селектор "' + selector + '": знайдено ' + elements.length);
            
            if (elements.length) {
                // Підсвічуємо знайдений елемент червоною рамкою
                elements.css('border', '3px solid red');
                elements.css('background', 'rgba(255,0,0,0.1)');
                console.log('✅ ЗНАЙДЕНО! Селектор: ' + selector);
                console.log('📌 Кількість елементів: ' + elements.length);
                console.log('📌 HTML знайденого:', elements[0].outerHTML);
                found = true;
            }
        });
        
        if (!found) {
            console.log('❌ Жодного елемента не знайдено');
            // Якщо нічого не знайдено, показуємо всю структуру
            console.log('📄 Вміст сторінки:', $('body').html().substring(0, 500) + '...');
        }
        
    }, 3000);
})();
