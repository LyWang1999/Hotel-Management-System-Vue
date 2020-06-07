<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <component :is="currentRole" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import waiterDashboard from './waiter'

export default {
  name: 'Dashboard',
  components: { adminDashboard, waiterDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'waiterDashboard'
    }
  }
}
</script>
