<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.roomTypeName"
        placeholder="房间类型名"
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
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
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
      border
      highlight-current-row
      style="width: 60%"
      @sort-change="sortChange"
    >
      <el-table-column prop="roomTypeId" label="序号" align="center" sortable="custom" width="90" />
      <el-table-column prop="roomTypeName" label="房间类型" align="center" width="150" />
      <el-table-column prop="roomTypeMaxLiving" label="最大入住人数" align="center" width="150" />
      <el-table-column prop="roomTypePrice" label="房间价格" align="center" sortable="custom" width="150" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-waves size="mini" @click="fetchGridData(row.roomTypeName)">
            查看空房
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="37%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item v-show="dialogStatus==='update'" label="序号" style="width: 71%">
          <el-input :value="temp.roomTypeId" :disabled="true" />
        </el-form-item>
        <el-form-item label="房间类型" prop="roomTypeName">
          <el-select v-model="temp.roomTypeName">
            <el-option v-for="(item, key) in roomTypeData" :key="key" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="最大入住人数" prop="roomTypeName">
          <el-input v-model="temp.roomTypeMaxLiving" />
        </el-form-item>
        <el-form-item label="房间价格" prop="roomTypeName">
          <el-input v-model="temp.roomTypePrice" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-drawer
      title="空房信息"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="30%"
      style="padding: 10px"
    >
      <el-table v-loading="drawerLoading" :data="gridData" highlight-current-row>
        <el-table-column width="90" property="roomId" align="center" label="序号" />
        <el-table-column width="100" property="roomNo" align="center" label="房间号" />
        <el-table-column property="roomDetail" align="center" label="房间详情" />
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import { getTypeNames, getRoomTypes, createRoomTypeInfo, updateRoomTypeInfo } from '@/api/hotel-admin/room-type-info'
import { getEmptyRoomsByType } from '@/api/hotel-admin/room-info'
import Pagination from '@/components/Pagination/index'
import waves from '@/directive/waves'

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listLoading: true,
      drawerLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        asc: true,
        sortField: 'roomTypeId',
        roomTypeName: ''
      },
      tableData: [],
      gridData: [],
      roomTypeData: [],
      temp: {
        roomTypeId: 1,
        roomTypeName: '',
        roomTypeMaxLiving: '',
        roomTypePrice: 0
      },
      dialogFormVisible: false,
      drawerVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        roomTypeName: [
          { required: true, message: '请填写房间类型', trigger: 'change' }
        ],
        roomTypePrice: [
          { required: true, message: '请填写房间价格', trigger: 'change' }
        ],
        roomTypeMaxLiving: [
          { required: true, message: '请填写最大入住人数', trigger: 'change' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.fetchData()
    this.fetchRoomTypeData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getRoomTypes(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    fetchRoomTypeData() {
      getTypeNames().then(response => {
        this.roomTypeData = response.data
      })
    },
    fetchGridData(roomTypeName) {
      this.drawerVisible = true
      this.drawerLoading = true
      getEmptyRoomsByType(roomTypeName).then(response => {
        this.gridData = response.data
        this.drawerLoading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data
      this.listQuery.sortField = prop
      this.listQuery.asc = order === 'ascending'
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        roomTypeId: '待定',
        roomNo: '',
        roomTypeName: '',
        roomDetail: '',
        empty: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          return new Promise((resolve, reject) => {
            const tempData = Object.assign({}, this.temp)
            createRoomTypeInfo(tempData).then(response => {
              const { data } = response
              if (data === true) {
                this.tableData.unshift(this.temp)
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success'
                })
                this.fetchRoomTypeData()
                resolve(data)
              } else {
                this.$notify({
                  title: '失败',
                  message: '创建失败',
                  type: 'error'
                })
                reject('create room-type info failed')
              }
            }).catch(error => {
              reject(error)
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          return new Promise((resolve, reject) => {
            const tempData = Object.assign({}, this.temp)
            updateRoomTypeInfo(tempData).then(response => {
              const { data } = response
              if (data === true) {
                for (const v of this.tableData) {
                  if (v.roomTypeId === this.temp.roomTypeId) {
                    const index = this.tableData.indexOf(v)
                    this.tableData.splice(index, 1, this.temp)
                    break
                  }
                }
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success'
                })
                resolve(data)
              } else {
                this.$notify({
                  title: '失败',
                  message: '更新失败',
                  type: 'error'
                })
                reject('update room-type info failed')
              }
            }).catch(error => {
              reject(error)
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '房间类型名', '最大入住人数', '房间价格']
          const filterVal = ['roomTypeId', 'roomTypeName', 'roomTypeMaxLiving', 'roomTypePrice']
          const data = this.formatJson(filterVal, this.tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'room-type-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-drawer__body {
  padding: 10px;
}
</style>
