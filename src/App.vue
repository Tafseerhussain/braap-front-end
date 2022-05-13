<template>
  <v-app :style="style">
    <router-view />
  </v-app>
</template>

<script>
  import { getScrollBarWidth } from './utils'

  export default {
    name: 'App',
    components: {},
    computed: {
      style() {
        return {
          '--scrollbar-width': this.$vuetify.breakpoint.scrollBarWidth + 'px'
        }
      }
    },
    mounted() {
      var token = this.$ls.get('Access-Token')
      if (token) {
        this.$axios.post('/api/user/getUserInfo').then(result => {
          if (result && result.success) {
            this.$store.dispatch('setLoginResult', result.data)
          } else {
            this.$ls.remove('Access-Token')
            window.location.reload()
          }
        })
      }

      window.addEventListener('load', () => {
        document.querySelector('.preloaderBg').style.opacity = 0
        setTimeout(() => {
          document.querySelector('.preloaderBg').style.display = 'none'
        }, 2000)

        this.initZohoChat()
      })

      this.$vuetify.breakpoint.scrollBarWidth = getScrollBarWidth()
    },
    methods: {
      initZohoChat() {
        var $zoho = window.$zoho || {}
        $zoho.salesiq = $zoho.salesiq || {
          widgetcode: 'a0e9123c230721987d5bbc4aaf8949bdd66fb0f17f4effc61f1760b9dd327664',
          values: {},
          ready: function() {}
        }
        window.$zoho = $zoho
        var d = document
        var s = d.createElement('script')
        s.type = 'text/javascript'
        s.id = 'zsiqscript'
        s.defer = true
        s.src = 'https://salesiq.zoho.com/widget'
        var t = d.getElementsByTagName('script')[0]
        t.parentNode.insertBefore(s, t)
      }
    }
  }
</script>

<style lang="scss">
</style>
