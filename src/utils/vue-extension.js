import Vue from 'vue'

const Bus = new Vue()
Vue.prototype.$bus = Bus

Vue.prototype.$url = {
    get(key) {
        return new URL(window.location.href).searchParams.get(key)
    },
    remove(key) {
        let url = new URL(window.location.href)
        url.searchParams.delete(key)
        window.history.replaceState({}, null, url.toString())
    },
    update(key, value) {
        let url = new URL(window.location.href)
        url.searchParams.set(key, value)
        window.history.replaceState({}, null, url.toString())
    }
}

Vue.prototype.$chat = {
    start: () => {
        document.querySelectorAll('#zsiq_maintitle').forEach(x => x.click())
    },
    show: () => {
        document.querySelectorAll('.zsiq_floatmain').forEach(x => (x.style.display = 'block'))
    },
    hide: () => {
        let count = 0
        let timer = setInterval(() => {
            if (count > 20) clearInterval(timer)

            let $el = document.querySelectorAll('.zsiq_floatmain')
            if ($el.length > 0) {
                $el.forEach(x => (x.style.display = 'none'))
                clearInterval(timer)
            }

            count++
        }, 100);
    }
}

Vue.prototype.$scrollbar_show = function () {
    setTimeout(() => {
        document.querySelectorAll('.watch-action').forEach(x => x.style.display = 'block')
        document.documentElement.classList.remove('no-scroll');
        if (!this.$vuetify.breakpoint.smAndDown) {
            document.documentElement.style.width = '100%'
        }
    }, 500);
}
Vue.prototype.$scrollbar_hide = function () {
    document.querySelectorAll('.watch-action').forEach(x => x.style.display = 'none')
    document.documentElement.classList.add('no-scroll');
    if (!this.$vuetify.breakpoint.smAndDown) {
        let width = 'calc( 100% - ' + this.$vuetify.breakpoint.scrollBarWidth + 'px)'
        document.documentElement.style.width = width
    }
}

Vue.prototype.$sr = window.ScrollReveal ? window.ScrollReveal({
    distance: '0px',
    duration: 1000,
    scale: 1,
    easing: 'ease',
    mobile: false,
    reset: false,
    viewFactor: 0.2,
}) : null;

Vue.prototype.$initSr = function () {
    if (!this.$sr) return
    setTimeout(() => {
        // window.ScrollReveal.debug = true
        this.$sr.reveal('.fade-in');

        this.$sr.reveal('.fade-left', { origin: 'left', distance: '100px', duration: 800 });
        this.$sr.reveal('.fade-left-delay', { origin: 'left', distance: '100px', duration: 800, delay: 300 });
        this.$sr.reveal('.fade-left-delay-600', { origin: 'left', distance: '100px', duration: 500, delay: 600 });
        this.$sr.reveal('.fade-left-vf40', { origin: 'left', distance: '100px', duration: 800, viewFactor: 0.4 });

        this.$sr.reveal('.fade-right', { origin: 'right', distance: '100px', duration: 800 });
        this.$sr.reveal('.fade-right-delay', { origin: 'right', distance: '100px', duration: 800, delay: 300 });
        this.$sr.reveal('.fade-right-delay-600', { origin: 'right', distance: '100px', duration: 800, delay: 600 });

        this.$sr.reveal('.fade-bottom', { origin: 'bottom', distance: '100px', duration: 800 });
        this.$sr.reveal('.fade-bottom-delay', { origin: 'bottom', distance: '100px', duration: 800, delay: 300 });
        this.$sr.reveal('.fade-bottom-delay-600', { origin: 'bottom', distance: '100px', duration: 800, delay: 600 });
        this.$sr.reveal('.fade-bottom-vf40', { origin: 'bottom', distance: '100px', duration: 800, viewFactor: 0.4 });

        this.$sr.reveal('.fade-top', { origin: 'top', distance: '100px', duration: 800 });
        this.$sr.reveal('.fade-top-delay', { origin: 'top', distance: '100px', duration: 800, delay: 300 });
        this.$sr.reveal('.fade-top-delay-600', { origin: 'top', distance: '100px', duration: 800, delay: 600 });

        this.$sr.reveal('.slide-bottom', { origin: 'bottom', distance: '50px', duration: 800, delay: 300 });
    }, 500);

}
