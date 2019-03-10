'use strict';
zuix.controller((cp) => {
    // {ContextControllerHandler} interface methods
    cp.init = () => {
        zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/flex-layout-attribute/1.0.3/css/flex-layout-attribute.min.css');
        zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css');
    };
    cp.create = () => {
        // TODO: use `CMD.` enums
        cp.field('control.on').on('click', ()=>{
            command('Control.On');
        });
        cp.field('control.off').on('click', ()=>{
            command('Control.Off');
        });
        cp.field('menu').on('click', ()=>{
            zuix.context('main-options-menu').show();
        });
    };
    // private methods
    function command(apiCommand, options) {
        const handler = cp.options().control;
        if (handler != null) {
            handler(apiCommand, options);
        }
    }
});
