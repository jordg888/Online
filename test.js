(function() {
    'use strict';
    
    setTimeout(function() {
        var container = $('.full-start__buttons, .full-start-new__buttons, .card__info, .info-block').first();
        
        if (container.length) {
            // Створюємо кнопку через raw DOM елемент
            var div = document.createElement('div');
            div.className = 'selector';
            div.style.cssText = 'padding: 15px; background: #ff5722; color: white; text-align: center; margin: 5px; border-radius: 5px;';
            div.innerHTML = '⚖️ КНОПКА';
            
            // Додаємо через raw JavaScript
            div.onclick = function() {
                alert('Працює!');
            };
            
            container[0].appendChild(div);
        }
    }, 3000);
})();
