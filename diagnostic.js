(function() {
    'use strict';
    
    console.log('🔍 ДІАГНОСТИКА ЗАПУЩЕНА');
    
    // Чекаємо 3 секунди і шукаємо кнопки
    setTimeout(function() {
        console.log('🔍 Починаємо пошук...');
        
        // Шукаємо всі можливі кнопки
        var selectors = [
            '.full-start__button',
            '.selector',
            '[class*="button"]',
            '.online-btn',
            '.watch-btn'
        ];
        
        for (var i = 0; i < selectors.length; i++) {
            var elements = $(selectors[i]);
            console.log('Селектор ' + selectors[i] + ': знайдено ' + elements.length);
            
            if (elements.length) {
                elements.each(function(index) {
                    var text = $(this).text().trim().substring(0, 30);
                    if (text) {
                        console.log('  → Кнопка: "' + text + '"');
                    }
                });
            }
        }
        
        console.log('🔍 ПОШУК ЗАВЕРШЕНО');
        
    }, 5000);
})();
