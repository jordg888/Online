(function() {
    'use strict';
    
    console.log('🔍 ПОШУК КНОПОК');
    
    setTimeout(function() {
        // Шукаємо всі символи
        var symbols = document.querySelectorAll('symbol');
        console.log('Знайдено символів:', symbols.length);
        
        for (var i = 0; i < symbols.length; i++) {
            console.log('Символ ' + i + ': id=' + symbols[i].id);
            
            // Шукаємо кнопки всередині символів
            var paths = symbols[i].querySelectorAll('path');
            if (paths.length) {
                console.log('  → має ' + paths.length + ' path елементів');
            }
        }
        
        // Шукаємо будь-які елементи з текстом
        var allElements = document.querySelectorAll('[class*="button"], [class*="btn"], .selector');
        console.log('Елементи з button/btn/selector:', allElements.length);
        
    }, 5000);
})();
