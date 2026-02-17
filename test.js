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
            '.buttons-block'
        ];
        
        selectors.forEach(function(selector) {
            var elements = $(selector);
            console.log('Селектор "' + selector + '": знайдено ' + elements.length);
            
            if (elements.length) {
                // Підсвічуємо знайдений елемент червоною рамкою
                elements.css('border', '3px solid red');
                console.log('✅ Знайдено!', selector);
            }
        });
        
        // Показуємо всю структуру сторінки
        console.log('📄 Вміст сторінки:', $('body').html());
        
    }, 3000);
})();
