(function() {
    'use strict';

    console.log('Старт плагіна');

    // Просте додавання кнопки
    setTimeout(function() {
        var container = $('.full-start__buttons').first();
        
        if (container.length) {
            var button = $('<div class="selector" style="padding:10px; background:red; color:white;">ТЕСТ</div>');
            container.append(button);
            
            button[0].onclick = function() {
                alert('Працює');
            };
        }
    }, 3000);
})();
