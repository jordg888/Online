(function() {
    'use strict';
    
    console.log('🔥 Фінальна версія без помилок');
    
    setTimeout(function() {
        var container = $('.full-start__buttons, .full-start-new__buttons, .card__info, .info-block').first();
        
        if (container.length && !$('.my-balancer-btn').length) {
            
            var button = $('<div class="full-start__button selector my-balancer-btn">' +
                           '<div style="font-size: 24px; width: 1.2em;">⚖️</div>' +
                           '<span>Балансер</span>' +
                           '</div>');
            
            container.append(button);
            
            // Повністю блокуємо всі події
            button.on('hover:enter click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                
                console.log('✅ Кнопку натиснуто');
                
                // Просто показуємо модальне вікно
                var modal = new Lampa.Modal({
                    title: 'Балансери',
                    content: '<div style="padding: 20px; text-align: center;">' +
                             '<div style="margin: 10px; padding: 15px; background: #ff5722; border-radius: 5px;">Uaflix</div>' +
                             '<div style="margin: 10px; padding: 15px; background: #ff5722; border-radius: 5px;">AnimeON</div>' +
                             '</div>'
                });
                
                modal.show();
                
                return false;
            });
        }
    }, 3000);
})();
