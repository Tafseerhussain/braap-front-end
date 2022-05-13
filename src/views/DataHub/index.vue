<template>
  <div class="my-shop white">
    <form action="/action_page.php">
      <label for="fname">First name:</label>
      <input type="text" id="fname" name="fname" /><br /><br />
      <label for="lname">Last name:</label>
      <input type="text" id="lname" name="lname" /><br /><br />
      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<script>
  // import {
  //   mapState
  // } from 'vuex'

  export default {
    name: 'DataHub',
    props: {},
    data: function() {
      return {
        type: 0
      }
    },
    mounted() {},
    methods: {}
  }
</script>