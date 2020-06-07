<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="最新订单号" min-width="100" align="center">
      <template slot-scope="scope">
        {{ scope.row.orderId }}
      </template>
    </el-table-column>
    <el-table-column label="支付金额" width="100" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.orderPayment }}
      </template>
    </el-table-column>
    <el-table-column label="订单状态" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.complete | statusFilter">
          {{ row.complete === 1 ? '完成' : '未完成' }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getOrders } from '@/api/hotel-admin/order-info'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '完成',
        0: '未完成'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getOrders({ page: 1, limit: 10, asc: false }).then(response => {
        this.list = response.data.items.slice(0, 7)
      })
    }
  }
}
</script>
