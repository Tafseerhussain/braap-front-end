import component from './MSnackBar.vue';
import objectAssign from 'object-assign'

let $vm;

const mergeOptions = function ($vm, options) {
    const defaults = {}
    for (let i in $vm.$options.props) {
        if (i !== 'value') {
            defaults[i] = $vm.$options.props[i].default
        }
    }
    const _options = objectAssign({}, defaults, options)
    for (let i in _options) {
        $vm[i] = _options[i];
    }
}

const plugin = {
    install(vue, option = {}) {
        //try avoid  [Vuetify] Unable to locate target [data-app]
        // document.body.setAttribute('data-app', true);
        const MSnackBar = vue.extend(component);
        if (!$vm) {
            $vm = new MSnackBar({
                // el: document.createElement('div'),
                vuetify: option.vuetify || {},
                propsData: {
                    text: 'snackbar'
                }
            });
        }

        const msnackbar = {
            show(options) {
                if (typeof options === 'object') {
                    mergeOptions($vm, options);
                }
                $vm.showValue = true;
            },
            hide() {
                $vm.showValue = false;
            },
            isVisible() {
                return $vm.showValue;
            }
        }

        msnackbar.success = (msg) => msnackbar.show({
            text: msg,
            color: 'braap_green',
            x: 'right'
        })

        msnackbar.error = (msg) => msnackbar.show({
            text: msg,
            color: 'error',
            x: 'right'
        })

        msnackbar.warning = (msg) => msnackbar.show({
            text: msg,
            color: 'braap_orange',
            x: 'right'
        })

        msnackbar.confirm = (options) => msnackbar.show({
            color: 'braap_orange',
            x: 'right',
            showOk: true,
            vertical: true,
            ...options
        })

        // all vn's plugins are included in this.$vn
        if (!vue.$msg) {
            vue.$msg = msnackbar
        }

        vue.mixin({
            created: function () {
                this.$msg = vue.$msg
            },
            mounted() {
                // document.querySelector("#app").appendChild($vm.$el)
                var component = $vm.$mount();
                document.querySelector("#app").appendChild(component.$el);
            }
        })

    }
}
export default plugin
export const install = plugin.install