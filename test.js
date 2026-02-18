(function() {
    'use strict';
    
    console.log('🎯 Кнопка в картці');
    
    // Чекаємо 3 секунди
    setTimeout(function() {
        
        // Шукаємо картку фільму
        var card = $('.card').first();
        
        if (card.length) {
            // Створюємо кнопку
            var button = document.createElement('div');
            button.innerHTML = '⚖️ БАЛАНСЕР';
            button.style.cssText = 'margin: 20px; padding: 20px; background: #ff5722; color: white; text-align: center; border-radius: 10px; font-size: 20px;';
            
            // Додаємо на початок картки
            card[0].insertBefore(button, card[0].firstChild);
            
            button.onclick = function() {
                alert('Кнопка в картці працює!');
            };
            
            console.log('✅ Кнопку додано в картку');
        } else {
            console.log('❌ Картку не знайдено');
        }
        
    }, 3000);
})();
