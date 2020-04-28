<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.adminNo"
        placeholder="工号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.adminName"
        placeholder="姓名"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.adminDuty"
        placeholder="工作职责"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="tableData"
      fit
      border
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column prop="adminId" label="序号" align="center" sortable="custom" width="90" />
      <el-table-column prop="adminNo" label="工号" align="center" width="150" />
      <el-table-column prop="adminName" label="姓名" align="center" width="100" />
      <el-table-column align="center" label="性别" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.male === 1 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="adminPassword" align="center" label="密码" width="150" />
      <el-table-column prop="adminDuty" label="工作职责" align="center" width="550" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" size="mini" @click="handleCheck(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />

    <el-dialog title="详细信息" :visible.sync="dialogFormVisible" width="35%">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 350px; margin-left:50px;"
      >
        <el-form-item label="序号">
          <el-input :value="temp.adminId" readonly />
        </el-form-item>
        <el-form-item label="工号">
          <el-input :value="temp.adminNo" readonly />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input :value="temp.adminName" readonly />
        </el-form-item>
        <el-form-item label="性别">
          <el-input :value="temp.male === 1 ? '男' : '女'" readonly />
        </el-form-item>
        <el-form-item label="密码">
          <el-input :value="temp.adminPassword" readonly />
        </el-form-item>
        <el-form-item label="工作职责">
          <el-input :value="temp.adminDuty" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAdmins } from '@/api/hotel-admin/admin-info'
import Pagination from '@/components/Pagination/index'
import waves from '@/directive/waves'

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        asc: true,
        adminNo: '',
        adminName: '',
        adminDuty: ''
      },
      tableData: [],
      temp: {
        adminId: 1,
        adminNo: '',
        adminName: '',
        male: 1,
        adminPassword: '123456',
        adminDuty: ''
      },
      dialogFormVisible: false,
      dialogDeleteVisible: false,
      dialogStatus: '',
      downloadLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAdmins(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'adminId') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      this.listQuery.asc = order === 'ascending'
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleCheck(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '工号', '姓名', '性别', '密码', '工作职责']
          const filterVal = ['adminId', 'adminNo', 'adminName', 'male', 'adminPassword', 'adminDuty']
          const data = this.formatJson(filterVal, this.tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'admin-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'male') {
          return v[j] === 1 ? '男' : '女'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>

</style>
