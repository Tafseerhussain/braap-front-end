<template>
  <div>
    <service-technician></service-technician>
    <job-detail></job-detail>
  </div>
</template>

<script>
  import ServiceTechnician from './ServiceTechnician.vue'
  import JobDetail from './JobDetail.vue'
  export default {
    components: {
      ServiceTechnician,
      JobDetail
    },
    mounted() {
      this.$initSr()
    }
  }
</script>

<style lang="scss">
</style>