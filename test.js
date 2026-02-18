(function() {
    'use strict';
    
    setTimeout(function() {
        // Шукаємо всі кнопки і фарбуємо їх в червоний
        $('div').each(function() {
            if ($(this).text().indexOf('Онлайн') >= 0) {
                $(this).css('border', '5px solid red');
                $(this).css('background', 'yellow');
            }
        });
    }, 5000);
})();
