(function() {
    'use strict';
    
    console.log('Плагін запущено');
    
    setInterval(function() {
        // Шукаємо кнопку Онлайн
        var onlineBtn = $('.selector:contains("Онлайн")').first();
        
        if (onlineBtn.length && !$('.my-balancer-btn').length) {
            // Копіюємо кнопку
            var newBtn = onlineBtn.clone();
            
            // Змінюємо текст та іконку
            newBtn.find('div').first().text('⚖️');
            newBtn.find('span').text('Балансер');
            newBtn.addClass('my-balancer-btn');
            
            // Додаємо після оригіналу
            onlineBtn.after(newBtn);
            
            // Додаємо обробник
            newBtn.on('click', function() {
                alert('Працює!');
            });
            
            console.log('Кнопку додано');
        }
    }, 2000);
})();
