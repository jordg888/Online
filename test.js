(function() {
    'use strict';
    
    console.log('🔍 ТЕСТ: Початок');
    
    setTimeout(function() {
        console.log('HTML:', document.body.innerHTML.substring(0, 1000));
    }, 5000);
})();
