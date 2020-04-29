<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.registerPhone"
        placeholder="手机号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.registerAccount"
        placeholder="账号名"
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
      <el-checkbox v-model="showMemberDetail" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        会员等级
      </el-checkbox>
      <el-checkbox v-model="showMemberScore" class="filter-item" @change="tableKey=tableKey+1">
        会员积分
      </el-checkbox>
      <el-checkbox v-model="showMemberDiscount" class="filter-item" @change="tableKey=tableKey+1">
        会员折扣
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableData"
      fit
      border
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column prop="registerId" label="序号" align="center" sortable="custom" width="90" />
      <el-table-column prop="registerPhone" label="手机号" align="center" width="150" />
      <el-table-column prop="registerAccount" label="账号名" align="center" width="100" />
      <el-table-column align="center" label="性别" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.male === 1 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="registerPassword" align="center" label="密码" width="150" />
      <el-table-column prop="registerEmail" label="邮箱" align="center" />
      <el-table-column v-if="showMemberDetail" label="会员等级" align="center" width="150">
        <template slot-scope="scope">
          <el-rate
            :value="showStar(scope.row.memberDetail)"
            :title="scope.row.memberDetail"
            :max="4"
            disabled
            :colors="starColors"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="showMemberScore" prop="memberScore" label="会员积分" align="center" width="80" />
      <el-table-column v-if="showMemberDiscount" prop="memberDiscount" label="会员折扣" align="center" width="80" />
      <el-table-column label="操作" align="center" width="180">
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
            <el-button slot="reference" v-waves type="danger" size="mini">删除</el-button>
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
          <el-input :value="temp.registerId" :disabled="true" />
        </el-form-item>
        <el-form-item label="手机号" prop="registerPhone">
          <el-input v-model="temp.registerPhone" />
        </el-form-item>
        <el-form-item label="账号名" prop="registerAccount">
          <el-input v-model="temp.registerAccount" />
        </el-form-item>
        <el-form-item label="性别" required>
          <el-radio-group v-model="temp.male">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="registerPassword">
          <el-input v-model="temp.registerPassword" />
        </el-form-item>
        <el-form-item label="邮箱" prop="registerEmail">
          <el-input v-model="temp.registerEmail" />
        </el-form-item>
        <el-form-item v-show="dialogStatus!=='create'" label="会员积分" prop="memberScore">
          <el-input v-model="temp.memberScore" />
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
import { getRegisters, updateRegisterInfo, deleteRegisterInfo, createRegisterInfo } from '@/api/hotel-admin/register-info'
import Pagination from '@/components/Pagination/index'
import waves from '@/directive/waves'

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      showMemberDetail: true,
      showMemberScore: true,
      showMemberDiscount: true,
      starColors: {
        1: '#99A9BF',
        3: '#f7ba2a',
        4: '#ff7b00'
      },
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        asc: true,
        registerPhone: '',
        registerAccount: ''
      },
      tableData: [],
      temp: {
        registerId: 1,
        registerPhone: '',
        registerAccount: '',
        registerPassword: '123456',
        male: 1,
        registerEmail: '',
        memberDetail: '',
        memberScore: 0,
        memberDiscount: 1.00
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        registerPhone: [
          { required: true, message: '请填写手机号', trigger: 'change' },
          { required: true, pattern: /^1[345678]\d{9}$/, message: '手机号格式有误', trigger: 'change' }
        ],
        registerAccount: [
          { required: true, message: '请填写账号名', trigger: 'change' }
        ],
        registerPassword: [
          { required: true, message: '请填写密码', trigger: 'change' },
          { required: true, min: 6, message: '密码至少为6位', trigger: 'change' }
        ],
        registerEmail: [
          { required: true, message: '请填写邮箱', trigger: 'change' },
          { required: true, type: 'email', message: '邮箱格式有误', trigger: 'change' }
        ],
        memberScore: [
          { required: true, message: '请填写会员积分', trigger: 'change' },
          { required: true, pattern: /^[0-9]\d{0,3}$/, message: '请填写0 - 9999整数数值', trigger: 'change' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    showStar(memberDetail) {
      if (memberDetail === '普通会员') {
        return 1
      } else if (memberDetail === '银卡会员') {
        return 2
      } else if (memberDetail === '金卡会员') {
        return 3
      } else if (memberDetail === '铂金会员') {
        return 4
      }
    },
    fetchData() {
      this.listLoading = true
      getRegisters(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'registerId') {
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
        registerId: 1,
        registerPhone: '',
        registerAccount: '',
        registerPassword: '123456',
        male: 1,
        registerEmail: '',
        memberDetail: '',
        memberScore: 0,
        memberDiscount: 1.0
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
            createRegisterInfo(tempData).then(response => {
              const { data } = response
              if (data === true) {
                this.memberInfoComplete()
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
                reject('create register info failed')
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
            updateRegisterInfo(tempData).then(response => {
              const { data } = response
              if (data === true) {
                this.memberInfoComplete()
                for (const v of this.tableData) {
                  if (v.registerId === this.temp.registerId) {
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
                reject('update register info failed')
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
        const { registerId } = this.temp
        deleteRegisterInfo(registerId).then(response => {
          const { data } = response
          if (data === true) {
            for (const v of this.tableData) {
              if (v.registerId === registerId) {
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
            reject('delete register info failed')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '手机号', '账号名', '性别', '密码', '邮箱', '会员等级', '会员积分', '会员折扣']
          const filterVal = ['registerId', 'registerPhone', 'registerAccount', 'male', 'registerPassword', 'registerEmail', 'memberDetail', 'memberScore', 'memberDiscount']
          const data = this.formatJson(filterVal, this.tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'register-list'
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
    },
    memberInfoComplete() {
      if (this.temp.memberScore < 1000) {
        this.temp.memberDiscount = 1.0
        this.temp.memberDetail = '普通会员'
      } else if (this.temp.memberScore < 3000) {
        this.temp.memberDiscount = 0.95
        this.temp.memberDetail = '银卡会员'
      } else if (this.temp.memberScore < 6000) {
        this.temp.memberDiscount = 0.85
        this.temp.memberDetail = '金卡会员'
      } else {
        this.temp.memberDiscount = 0.75
        this.temp.memberDetail = '铂金会员'
      }
    }
  }
}
</script>

<style scoped>

</style>
