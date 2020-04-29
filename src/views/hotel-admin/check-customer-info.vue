<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.checkCustomerIdCard"
        placeholder="身份证号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.checkCustomerName"
        placeholder="姓名"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.checkCustomerPhone"
        placeholder="手机号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.orderId"
        placeholder="订单号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.roomNo"
        placeholder="房间号"
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
      <el-table-column fixed="left" prop="checkCustomerId" label="序号" align="center" sortable="custom" width="90" />
      <el-table-column prop="checkCustomerIdCard" label="身份证号" align="center" width="200" />
      <el-table-column prop="checkCustomerName" label="姓名" align="center" width="100" />
      <el-table-column align="center" label="性别" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.male === 1 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="checkCustomerPhone" align="center" label="手机号" width="150" />
      <el-table-column label="订单号" align="center" width="100">
        <template slot-scope="scope">
          <span class="link-type" @click="getOneOrderData(scope.row.orderId)">{{ scope.row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="roomNo" label="房间号" align="center" width="100" />
      <el-table-column prop="checkCustomerCheckInTime" label="入住时间" align="center" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.checkCustomerCheckInTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="checkCustomerLeaveTime" label="离开时间" align="center" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.checkCustomerLeaveTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="living" label="居住状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.living === 1">居住</el-tag>
          <el-tag v-else type="info">离开</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="150">
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

    <el-dialog title="编辑" :visible.sync="checkCustomerFormVisible" width="37%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="序号">
          <el-input :value="temp.checkCustomerId" :disabled="true" />
        </el-form-item>
        <el-form-item label="身份证号" prop="checkCustomerIdCard">
          <el-input v-model="temp.checkCustomerIdCard" />
        </el-form-item>
        <el-form-item label="姓名" prop="checkCustomerName">
          <el-input v-model="temp.checkCustomerName" />
        </el-form-item>
        <el-form-item label="性别" required>
          <el-radio-group v-model="temp.male">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="checkCustomerPhone">
          <el-input v-model="temp.checkCustomerPhone" />
        </el-form-item>
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="temp.orderId" />
        </el-form-item>
        <el-form-item label="房间号" prop="roomNo">
          <el-input v-model="temp.roomNo" />
        </el-form-item>
        <el-form-item label="居住时间" prop="livingDurationTime">
          <el-date-picker
            v-model="livingDurationTime"
            type="datetimerange"
            start-placeholder="入住时间"
            end-placeholder="离开时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="居住状态" prop="living" required>
          <el-radio-group v-model="temp.living">
            <el-radio :label="1">居住</el-radio>
            <el-radio :label="0">离开</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkCustomerFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="订单信息" :visible.sync="orderFormVisible" width="37%">
      <el-form
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="订单号">
          <el-input :value="orderData.orderId" readonly />
        </el-form-item>
        <el-form-item label="订单完成情况">
          <el-tag v-if="orderData.complete === 1" type="success">已完成</el-tag>
          <el-tag v-else type="info">未完成</el-tag>
        </el-form-item>
        <el-form-item label="下单手机号">
          <el-input :value="orderData.registerPhone" readonly />
        </el-form-item>
        <el-form-item label="房间数量">
          <el-input :value="orderData.orderRoomNum" readonly />
        </el-form-item>
        <el-form-item label="房间类型">
          <el-input :value="orderData.roomTypeName" readonly />
        </el-form-item>
        <el-form-item label="订单创建时间">
          <el-input :value="orderData.orderCreatedTime" readonly />
        </el-form-item>
        <el-form-item label="订单入住时间">
          <el-input :value="orderData.orderCheckInTime" readonly />
        </el-form-item>
        <el-form-item label="订单离店时间">
          <el-input :value="orderData.orderLeaveTime" readonly />
        </el-form-item>
        <el-form-item label="订单费用">
          <el-input :value="orderData.orderPayment" readonly />
        </el-form-item>
        <el-form-item label="订单详情">
          <el-input :value="orderData.orderDetail" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCheckCustomers, updateCheckCustomerInfo, deleteCheckCustomerInfo } from '@/api/hotel-admin/check-customer-info'
import { getOneOrderById } from '@/api/hotel-admin/order-info'
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
        checkCustomerIdCard: '',
        checkCustomerName: '',
        checkCustomerPhone: '',
        orderId: '',
        roomNo: ''
      },
      tableData: [],
      orderData: {},
      temp: {
        checkCustomerId: 1,
        checkCustomerIdCard: '',
        checkCustomerName: '',
        male: 1,
        checkCustomerPhone: '',
        orderId: 0,
        roomNo: '',
        checkCustomerCheckInTime: '',
        checkCustomerLeaveTime: '',
        living: 0
      },
      checkCustomerFormVisible: false,
      orderFormVisible: false,
      dialogStatus: '',
      rules: {
        checkCustomerIdCard: [
          { required: true, message: '请填写身份证号', trigger: 'change' },
          { required: true, pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:(?:0[1-9])|(?:1[0-2]))(?:(?:[0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '身份证号格式有误', trigger: ['change', 'blur'] }
        ],
        checkCustomerName: [
          { required: true, message: '请填写姓名', trigger: 'change' }
        ],
        checkCustomerPhone: [
          { required: true, message: '请填写手机号', trigger: 'change' },
          { required: true, pattern: /^1[345678]\d{9}$/, message: '手机号格式有误', trigger: 'change' }
        ],
        orderId: [
          { required: true, message: '请指定订单号', trigger: 'change' },
          { required: true, pattern: /^[1-9]\d*$/, message: '不可填写非数字字符', trigger: 'change' }
        ],
        roomNo: [
          { required: true, message: '请指定房间号', trigger: 'change' },
          { required: true, pattern: /^[1-9]\d*$/, message: '不可填写非数字字符', trigger: 'change' }
        ],
        livingDurationTime: [
          { required: true, message: '请指定居住时间', trigger: 'change' }
        ]
      },
      downloadLoading: false
    }
  },
  computed: {
    livingDurationTime: {
      get() {
        const start = this.temp.checkCustomerCheckInTime
        const end = this.temp.checkCustomerLeaveTime
        return [start, end]
      },
      set(value) {
        if (value) {
          this.temp.checkCustomerCheckInTime = value[0]
          this.temp.checkCustomerLeaveTime = value[1]
        } else {
          this.temp.checkCustomerCheckInTime = ''
          this.temp.checkCustomerLeaveTime = ''
        }
      }
    }
  },
  created() {
    this.fetchData()
    setTimeout(() => {
      this.$message({
        message: '点击订单号可查看订单详细信息',
        center: true
      })
    }, 1500)
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getCheckCustomers(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'checkCustomerId') {
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
        checkCustomerId: 1,
        checkCustomerIdCard: '',
        checkCustomerName: '',
        male: 1,
        checkCustomerPhone: '',
        orderId: 1,
        roomNo: '',
        checkCustomerCheckInTime: '',
        checkCustomerLeaveTime: '',
        living: 0
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.checkCustomerFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.checkCustomerFormVisible = false
          return new Promise((resolve, reject) => {
            const tempData = Object.assign({}, this.temp)
            updateCheckCustomerInfo(tempData).then(response => {
              const { data } = response
              if (data === true) {
                for (const v of this.tableData) {
                  if (v.checkCustomerId === this.temp.checkCustomerId) {
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
                reject('update check-customer info failed')
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
        const { checkCustomerId } = this.temp
        deleteCheckCustomerInfo(checkCustomerId).then(response => {
          const { data } = response
          if (data === true) {
            for (const v of this.tableData) {
              if (v.checkCustomerId === checkCustomerId) {
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
            reject('delete check-customer info failed')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getOneOrderData(orderId) {
      this.orderFormVisible = true
      return new Promise((resolve, reject) => {
        getOneOrderById(orderId).then((response) => {
          const { data } = response
          if (data) {
            this.orderData = data
            resolve(data)
          } else {
            reject('get order info failed')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '身份证号', '姓名', '性别', '手机号', '订单号', '房间号', '入住时间', '离开时间', '是否居住']
          const filterVal = ['checkCustomerId', 'checkCustomerIdCard', 'checkCustomerName', 'male', 'checkCustomerPhone', 'orderId', 'roomNo', 'checkCustomerCheckInTime', 'checkCustomerLeaveTime', 'living']
          const data = this.formatJson(filterVal, this.tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'check-customer-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'male') {
          return v[j] === 1 ? '男' : '女'
        } else if (j === 'living') {
          return v[j] === 1 ? '居住' : '离开'
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
