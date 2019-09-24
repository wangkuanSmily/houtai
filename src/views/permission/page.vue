<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />
    {{data}}
  </div>
</template>

<script>
import SwitchRoles from './components/SwitchRoles'
import { fetchList } from '@/api/article'
export default {
  name: 'PagePermission',
  data() {
    return {
      data: ''
    }
  },
  components: { SwitchRoles },
  methods: {
    handleRolesChange() {
      this.$router.push({ path: '/permission/index?' + +new Date() })
    },
    async getApi() {
      const data = await fetchList()
      this.data = data.data.xxx
    }
  }
}
</script>
