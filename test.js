(function() {
    console.log('🔥 ТЕСТ: скрипт запущено');
    
    // Чекаємо 5 секунд і додаємо кнопку в будь-яке місце
    setTimeout(function() {
        console.log('⏰ 5 секунд минуло, додаємо кнопку...');
        
        // Створюємо просту кнопку
        var testButton = $('<div style="position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); z-index: 9999; background: red; color: white; padding: 20px; border-radius: 10px; font-size: 20px; text-align: center;">🔴 ТЕСТОВА КНОПКА</div>');
        
        // Додаємо на сторінку
        $('body').append(testButton);
        
        // Додаємо обробник кліку
        testButton.on('click', function() {
            alert('Кнопка працює!');
        });
        
        console.log('✅ Кнопку додано в body');
    }, 5000);
    
    // Перевіряємо чи є Lampa
    if (typeof Lampa !== 'undefined') {
        console.log('✅ Lampa знайдено');
    } else {
        console.log('❌ Lampa не знайдено');
    }
})();
