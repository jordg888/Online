(function() {
    'use strict';
    
    setTimeout(function() {
        var container = $('.full-start__buttons, .full-start-new__buttons, .card__info, .info-block').first();
        
        if (container.length) {
            // Беремо першу існуючу кнопку як зразок
            var sampleButton = container.find('.selector').first();
            
            if (sampleButton.length) {
                // Копіюємо стилі з існуючої кнопки
                var button = sampleButton.clone();
                button.empty();
                button.append('<div style="font-size: 24px;">⚖️</div><span>Балансер</span>');
                
                container.append(button);
                
                button.on('click', function() {
                    Lampa.Noty.show('Працює!');
                    setTimeout(function() { Lampa.Noty.hide(); }, 2000);
                });
            }
        }
    }, 3000);
})();
