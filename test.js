(function() {
    'use strict';
    
    console.log('🚀 СУПЕР ПРОСТА КНОПКА');
    
    // Чекаємо 3 секунди
    setTimeout(function() {
        
        // Створюємо кнопку прямо в body зверху
        var button = document.createElement('div');
        button.id = 'super-simple-button';
        button.innerHTML = '⚖️ НАТИСНИ МЕНЕ';
        button.style.cssText = 'position: fixed; top: 100px; left: 50%; transform: translateX(-50%); z-index: 99999; background: #ff5722; color: white; padding: 20px 40px; border-radius: 30px; font-size: 24px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.5);';
        
        // Додаємо на сторінку
        document.body.appendChild(button);
        
        // Додаємо обробник
        button.onclick = function() {
            alert('ПРАЦЮЄ!');
        };
        
        console.log('✅ Кнопку додано в body');
        
    }, 3000);
})();
