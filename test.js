(function() {
    'use strict';
    
    console.log('🚀 Остання спроба');
    
    setTimeout(function() {
        // Шукаємо елемент, який був підсвічений червоним
        // (той самий селектор, що й у діагностичному плагіні)
        var container = $('.full-start__buttons, .full-start-new__buttons, .card__info, .info-block, .card__content, .buttons-panel').first();
        
        console.log('Контейнер знайдено?', container.length);
        
        if (container.length) {
            // Додаємо кнопку найпростішим способом
            var buttonHtml = '<div id="my-simple-button" style="padding: 15px; background: #ff5722; color: white; text-align: center; margin: 10px; border-radius: 5px; font-size: 18px; cursor: pointer;">⚖️ НАТИСНИ МЕНЕ</div>';
            
            container.append(buttonHtml);
            
            console.log('✅ Кнопку додано');
            
            // Додаємо обробник через делегування подій
            $(document).on('click', '#my-simple-button', function() {
                console.log('Кнопку натиснуто');
                alert('Працює!');
            });
        } else {
            console.log('❌ Контейнер не знайдено');
        }
    }, 3000);
})();
