'use strict';
zuix.controller((cp) => {
    let displayLevel = 0; let actualLevel = 0.4;

    // these variable are used to store a reference to UI fields
    let controlOn;
    let controlOff;
    let controlLevel;
    let controlToggle;
    let activityLed;
    let statusLed;
    let levelBar;
    let levelView;

    // {ContextControllerHandler} interface methods
    cp.init = () => {
        // TODO: implement 'zuix.using' parsing/handling in zuix_bundler (nodejs)
        zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/flex-layout-attribute/1.0.3/css/flex-layout-attribute.min.css');
        zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css');
        exposePublicMethods();
    };
    cp.create = () => {
        // HGUI module bound to this widget is stored in the data model
        const module = cp.model();
        // listen for model updates
        hgui.observeModule(module, cp.context);
        // get a reference to the UI fields of the view
        controlOn = cp.field('control.on');
        controlOff = cp.field('control.off');
        controlLevel = cp.field('control.level');
        controlToggle = cp.field('control.toggle');
        activityLed = cp.field('activity-led');
        statusLed = cp.field('status-led');
        levelBar = cp.field('level-bar');
        levelView = cp.field('level-view');
        // actions to perform upon user interaction on UI fields
        controlOn.on('click', ()=>{
            if (actualLevel === 0) actualLevel = 1;
            setLevel(actualLevel);
            command(CMD.Control.On);
        });
        controlOff.on('click', ()=>{
            setLevel(0);
            command(CMD.Control.Off);
        });
        controlLevel.on('click', levelChangeHandler);
        controlToggle.on('click', (e, el)=>{
            if (actualLevel === 0) actualLevel = 1;
            displayLevel = (displayLevel === 0 ? actualLevel : 0);
            setLevel(displayLevel);
            command(CMD.Control.Toggle);
        });
        cp.field('menu').on('click', ()=>{
            zuix.context('main-options-menu').show();
        });
        // update aspect of this widget according to the module type (switch, light or dimmer)
        if (module != null && module.type != null) {
            setType(module.type);
        }
        // this delay is due to the animation, we must wait the animation
        // to end in order to measure the level bar width consistently
        setTimeout(cp.update, 500);
    };

    cp.update = (field, oldValue) => {
        // TODO: handle other fields like 'Meter.Watts' and most recent fields 'timestamp'
        if (field != null) {
            blink();
            if (field.key === FLD.Status.Level) {
                actualLevel = parseFloat(field.value);
                setLevel(actualLevel);
            }
            return;
        }
        // if no field is given then update all fields bound to the view
        const module = cp.model();
        const level = module.fields.find((f) => f.key === FLD.Status.Level);
        if (level != null) {
            actualLevel = parseFloat(level.value);
            setLevel(actualLevel);
        }
    };

    // private methods

    function setType(type) {
        let typeIcon = 'images/devices/bulb.png';
        switch (type.toLowerCase()) {
            case 'switch':
                typeIcon = 'images/devices/socket.png';
            case 'light':
                levelView.hide();
                break;
            default:
                levelView.show();
        }
        cp.field('icon').attr('src', typeIcon);
        return cp.context;
    }
    function setLevel(level) {
        displayLevel = parseFloat(level);
        if (displayLevel === 0) {
            toggleClass(statusLed, 'off', 'on');
            cp.field('level-bar')
                .css('width', '0');
        } else {
            toggleClass(statusLed, 'on', 'off');
            const barWidth = controlLevel.position().rect.width * actualLevel;
            levelBar.css('width', barWidth + 'px');
            // show actual level
            const stopIndex = actualLevel * controlLevel.children().length();
            controlLevel.children().each((i, el, zel)=>{
                (i <= stopIndex) ? zel.addClass('on') : zel.removeClass('on');
                return true;
            });
        }
        return cp.context;
    }
    function levelChangeHandler(e, el) {
        const p = el.position();
        let barWidth = e.clientX - p.x + 12;
        let level = Math.round((100 / p.rect.width) * barWidth);
        level = (level - (level % 5)) / 100;
        displayLevel = actualLevel = level;
        setLevel(displayLevel);
        command(CMD.Control.Level + '/' + (Math.round(actualLevel * 100)));
    }
    function blink() {
        activityLed.addClass('on');
        setTimeout(()=>{
            activityLed.removeClass('on');
        }, 200);
    }

    // HGUI widget interface methods

    function command(apiCommand, options) {
        blink();
        const handler = cp.options().control;
        if (handler != null) {
            handler(apiCommand, options);
        }
    }
    function exposePublicMethods() {
        cp.expose('setLevel', setLevel)
          .expose('blink', blink)
          // Observable interface method
          .expose('update', (field, oldValue) => cp.update(field, oldValue));
    }
});
