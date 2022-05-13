<template>
  <div class="quick-action d-flex flex-column flex-lg-row align-center px-3 px-sm-4" v-if="actions.length > 0">
    <div class="d-flex align-center mr-2 my-1">
      <v-badge inline color="braap_red" :content="actions.length" class="mr-2"></v-badge>
      <span class="mr-2">Pending Quick Actions:</span>
    </div>
    <div class="text-center text-lg-left">
      <a
        v-for="action in actions"
        :key="action.id"
        class="d-inline-block mr-2 braap_deep_blue--text"
        :href="action.Url"
        @click.prevent="onActionClick(action)"
      >
        {{ action.Name }}
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'QuickAction',
    props: {},
    components: {},
    data: function() {
      return {
        actions: []
      }
    },
    created() {
      this.getQuickActions()
    },
    mounted() {},
    methods: {
      getQuickActions() {
        this.$axios.post('/MyShop/GetUserQuickActions').then(result => {
          if (result && result.status === 200 && result.data) {
            this.actions = result.data
          }
        })
      },
      onActionClick(action) {
        if (action.Url && action.Url != '#') {
          window.location.href = action.Url
        } else {
          if (action.Css === 'timeline-bt') {
            this.$emit('open-timeline', action.Datas.vehicleId)
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .quick-action {
  }
</style>
