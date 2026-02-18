(function() {
    'use strict';
    
    setTimeout(function() {
        // Шукаємо всі символи з кнопками
        var symbols = document.getElementsByTagName('symbol');
        
        for(var i = 0; i < symbols.length; i++) {
            console.log('Symbol ' + i + ': ' + symbols[i].id);
            
            // Якщо знайшли символ feed - аналізуємо його
            if(symbols[i].id == 'sprite-feed') {
                var content = symbols[i].innerHTML;
                console.log('Feed content:', content);
            }
        }
    }, 5000);
})();
