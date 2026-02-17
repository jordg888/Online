(function() {
    'use strict';
    
    setTimeout(function() {
        var container = $('.full-start__buttons, .full-start-new__buttons, .card__info, .info-block').first();
        
        if (container.length && !$('.my-test-btn').length) {
            
            var button = $('<div class="my-test-btn" style="padding: 10px; background: #ff5722; color: white; text-align: center; margin: 5px;">⚖️ ТЕСТ</div>');
            
            container.append(button);
            
            // Ніяких Lampa функцій, тільки console.log
            button.on('click', function() {
                console.log('Кнопку натиснуто');
            });
        }
    }, 3000);
})();
