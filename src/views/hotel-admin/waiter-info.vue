<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.waiterNo"
        placeholder="工号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.waiterName"
        placeholder="姓名"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-time-select
        v-model="listQuery.beginWorkTime"
        placeholder="上班时间"
        :picker-options="{
          start: '06:00',
          step: '00:30',
          end: '24:00'
        }"
        style="width: 150px;"
        class="filter-item"
      />
      <el-time-select
        v-model="listQuery.endWorkTime"
        placeholder="下班时间"
        :picker-options="{
          start: '06:00',
          step: '00:30',
          end: '24:00',
          minTime: listQuery.beginWorkTime
        }"
        style="width: 150px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.workDay"
        placeholder="工作日"
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
      fit
      border
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column prop="waiterId" label="序号" align="center" sortable="custom" width="90" />
      <el-table-column prop="waiterNo" label="工号" align="center" width="150" />
      <el-table-column prop="waiterName" label="姓名" align="center" width="100" />
      <el-table-column align="center" label="性别" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.male === 1 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="waiterPassword" align="center" label="密码" width="150" />
      <el-table-column label="上班时间" align="center" width="150">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.beginWorkTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下班时间" align="center" width="150">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.endWorkTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="workDay" label="工作日" align="center" width="200" />
      <el-table-column label="操作" align="center">
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
        <el-form-item v-show="dialogStatus==='update'" label="序号">
          <el-input :value="temp.waiterId" :disabled="true" />
        </el-form-item>
        <el-form-item label="工号" prop="waiterNo">
          <el-input v-model="temp.waiterNo" :disabled="dialogStatus!=='create'" />
        </el-form-item>
        <el-form-item label="姓名" prop="waiterName">
          <el-input v-model="temp.waiterName" />
        </el-form-item>
        <el-form-item label="性别" required>
          <el-radio-group v-model="temp.male">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="waiterPassword">
          <el-input v-model="temp.waiterPassword" />
        </el-form-item>
        <el-form-item label="工作时间" required>
          <el-col :span="12">
            <el-form-item prop="beginWorkTime">
              <el-time-select
                v-model="temp.beginWorkTime"
                placeholder="上班时间"
                :picker-options="{
                  start: '06:00',
                  step: '00:30',
                  end: '24:00'
                }"
                style="width: 95%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="1">-</el-col>
          <el-col :span="11">
            <el-form-item prop="endWorkTime">
              <el-time-select
                v-model="temp.endWorkTime"
                placeholder="下班时间"
                :picker-options="{
                  start: '06:00',
                  step: '00:30',
                  end: '24:00',
                  minTime: temp.beginWorkTime
                }"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="工作日" prop="workDay">
          <el-input v-model="temp.workDay" />
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
import { getWaiters, createWaiterInfo, updateWaiterInfo, deleteWaiterInfo } from '@/api/hotel-admin/waiter-info'
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
        waiterNo: '',
        waiterName: '',
        beginWorkTime: '',
        endWorkTime: '',
        workDay: ''
      },
      tableData: [],
      temp: {
        waiterId: 1,
        waiterNo: '',
        waiterName: '',
        male: 1,
        waiterPassword: '123456',
        beginWorkTime: '06:00',
        endWorkTime: '21:00',
        workDay: '周一/周二/周三/周四/周五/周六/周日'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        waiterNo: [
          { required: true, message: '请填写工号', trigger: 'change' },
          { min: 8, max: 8, message: '工号为8位', trigger: 'change' }
        ],
        waiterName: [
          { required: true, message: '请填写姓名', trigger: 'change' }
        ],
        waiterPassword: [
          { required: true, message: '请填写密码', trigger: 'change' },
          { required: true, min: 6, message: '密码至少为6位', trigger: 'change' }
        ],
        beginWorkTime: [
          { required: true, message: '请指定上班时间', trigger: 'change' }
        ],
        endWorkTime: [
          { required: true, message: '请指定下班时间', trigger: 'change' }
        ],
        workDay: [
          { required: true, message: '请填写工作日', trigger: 'change' }
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
      getWaiters(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'waiterId') {
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
        waiterId: '待定',
        waiterNo: '',
        waiterName: '',
        male: 1,
        waiterPassword: '123456',
        beginWorkTime: '06:00',
        endWorkTime: '21:00',
        workDay: '周一/周二/周三/周四/周五/周六/周日'
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
            createWaiterInfo(tempData).then(response => {
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
                reject('create waiter info failed')
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
            updateWaiterInfo(tempData).then(response => {
              const { data } = response
              if (data === true) {
                for (const v of this.tableData) {
                  if (v.waiterId === this.temp.waiterId) {
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
                reject('update waiter info failed')
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
        const { waiterId } = this.temp
        deleteWaiterInfo(waiterId).then(response => {
          const { data } = response
          if (data === true) {
            for (const v of this.tableData) {
              if (v.waiterId === waiterId) {
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
            reject('delete waiter info failed')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '工号', '姓名', '性别', '密码', '上班时间', '下班时间', '工作日']
          const filterVal = ['waiterId', 'waiterNo', 'waiterName', 'male', 'waiterPassword', 'beginWorkTime', 'endWorkTime', 'workDay']
          const data = this.formatJson(filterVal, this.tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'waiter-list'
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

<style scoped lang="scss">
/deep/ .el-dialog{
  display: flex;
  flex-direction: column;
  margin:0 !important;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
}
</style>
