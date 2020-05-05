<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.roomNo"
        placeholder="房间号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.roomTypeName"
        placeholder="房间类型"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.empty"
        placeholder="房间状态"
        clearable
        style="width: 150px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      >
        <el-option
          v-for="(item, key) in roomStatus"
          :key="key"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
      fit
      border
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column prop="roomId" label="序号" align="center" sortable="custom" width="90" />
      <el-table-column prop="roomNo" label="房间号" align="center" width="100" />
      <el-table-column prop="roomTypeName" label="房间类型" align="center" width="100" />
      <el-table-column label="房间状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.empty === 1">房间空余</el-tag>
          <el-tag v-else type="info">房间入住</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="roomDetail" label="房间详情" align="center" />
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-popconfirm
            placement="top-start"
            confirm-button-text="确定"
            confirm-button-type="text"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗?"
            @onConfirm="deleteData(row)"
          >
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm>
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
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item v-show="dialogStatus==='update'" label="序号" style="width: 71%">
          <el-input :value="temp.roomId" :disabled="true" />
        </el-form-item>
        <el-form-item label="房间号" prop="roomNo" style="width: 71%">
          <el-input v-model="temp.roomNo" />
        </el-form-item>
        <el-form-item label="房间类型" prop="roomTypeName">
          <el-select v-model="temp.roomTypeName">
            <el-option v-for="(item, key) in roomTypeData" :key="key" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="dialogStatus==='update'" label="房间状态" prop="empty" required>
          <el-radio-group v-model="temp.empty">
            <el-radio :label="1">房间空余</el-radio>
            <el-radio :label="0">房间入住</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="房间详情" prop="roomDetail">
          <el-input
            v-model="temp.roomDetail"
            type="textarea"
            :rows="4"
            maxlength="50"
            show-word-limit
          />
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
  </div>
</template>

<script>
import { getRooms, updateRoomInfo, createRoomInfo, deleteRoomInfo } from '@/api/hotel-admin/room-info'
import { getTypes } from '@/api/hotel-admin/room-type-info'
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
        roomNo: '',
        roomTypeName: '',
        empty: ''
      },
      tableData: [],
      roomTypeData: [],
      temp: {
        roomId: 1,
        roomNo: '',
        roomTypeName: '',
        roomDetail: '',
        empty: 1
      },
      roomStatus: [
        {
          label: '房间空余',
          value: 1
        },
        {
          label: '房间入住',
          value: 0
        }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        roomNo: [
          { required: true, message: '请填写房间号', trigger: 'change' }
        ],
        roomTypeName: [
          { required: true, message: '请选择房间类型', trigger: 'change' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getRooms(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
      })
      getTypes().then(response => {
        this.roomTypeData = response.data
        this.listLoading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'roomId') {
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
    resetTemp() {
      this.temp = {
        roomId: 1,
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
            createRoomInfo(tempData).then(response => {
              const { data } = response
              if (data === true) {
                this.tableData.unshift(this.temp)
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success'
                })
                resolve(data)
              } else {
                this.$notify({
                  title: '失败',
                  message: '创建失败',
                  type: 'error'
                })
                reject('create room info failed')
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
            updateRoomInfo(tempData).then(response => {
              const { data } = response
              if (data === true) {
                for (const v of this.tableData) {
                  if (v.roomId === this.temp.roomId) {
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
                reject('update room info failed')
              }
            }).catch(error => {
              reject(error)
            })
          })
        }
      })
    },
    deleteData(row) {
      this.temp = Object.assign({}, row)
      return new Promise((resolve, reject) => {
        const { roomId } = this.temp
        deleteRoomInfo(roomId).then(response => {
          const { data } = response
          if (data === true) {
            for (const v of this.tableData) {
              if (v.roomId === roomId) {
                const index = this.tableData.indexOf(v)
                this.tableData.splice(index, 1)
                break
              }
            }
            this.total = this.total - 1
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            resolve(data)
          } else {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error'
            })
            reject('delete room info failed')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '房间号', '房间类型', '房间状态', '房间详情']
          const filterVal = ['roomId', 'roomNo', 'roomTypeName', 'empty', 'roomDetail']
          const data = this.formatJson(filterVal, this.tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'room-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'empty') {
          return v[j] === 1 ? '房间空余' : '房间入住'
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
