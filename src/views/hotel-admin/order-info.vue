<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.registerPhone"
        placeholder="下单手机号"
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
      <div id="search-date-picker">
        <el-date-picker
          v-model="orderTimeInterval"
          type="datetimerange"
          start-placeholder="订单创建时间"
          end-placeholder="订单创建时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @keyup.enter.native="handleFilter"
        />
      </div>
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
      <el-table-column type="expand" width="25">
        <template slot-scope="scope">
          <div style="color: #99a9bf;margin-bottom: 10px">订单备注: </div>
          <div>{{ scope.row.orderDetail }}</div>
        </template>
      </el-table-column>
      <el-table-column label="序号" align="left" sortable="custom" width="90">
        <template slot-scope="scope">
          <span style="margin-left: 18px">{{ scope.row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下单手机号" width="130">
        <template slot-scope="scope">
          <span class="link-type" @click="getOneRegisterData(scope.row.registerPhone)">{{ scope.row.registerPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="roomTypeName" label="房间类型" align="center" width="100" />
      <el-table-column align="center" label="订单创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.orderCreatedTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单入住时间" width="150">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.orderCheckInTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单离开时间" width="150">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.orderLeaveTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderPayment" label="订单费用" align="center" width="90" />
      <el-table-column prop="orderRoomNum" label="房间数量" align="center" width="90" />
      <el-table-column label="完成状态" align="center" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.complete === 1" type="success">完成</el-tag>
          <el-tag v-else type="info">未完成</el-tag>
        </template>
      </el-table-column>
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

    <el-dialog title="编辑" :visible.sync="orderFormVisible" width="37%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="订单号">
          <el-input :value="temp.orderId" disabled />
        </el-form-item>
        <el-form-item label="手机号" prop="registerPhone">
          <el-input :value="temp.registerPhone" disabled />
        </el-form-item>
        <el-form-item label="房间类型" prop="roomTypeName" required>
          <el-select v-model="temp.roomTypeName" placeholder="请选择房型" style="width:56%">
            <el-option v-for="(item, key) in options" :key="key" :label="item.roomTypeName" :value="item.roomTypeName" />
          </el-select>
        </el-form-item>
        <el-form-item label="房间数量" prop="orderRoomNum">
          <el-input-number v-model="temp.orderRoomNum" controls-position="right" :min="1" :max="selectMaxRoomNum" />
          <el-button size="mini" icon="el-icon-refresh" style="margin-left: 10px" @click="refreshMaxRoomNum" />
        </el-form-item>
        <el-form-item label="完成情况" required>
          <el-radio-group v-model="temp.complete">
            <el-radio :label="1">完成</el-radio>
            <el-radio :label="0">未完成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="居住时间" prop="orderLeaveTime">
          <el-date-picker
            v-model="livingDurationTime"
            type="daterange"
            start-placeholder="订单入住时间"
            end-placeholder="订单离开时间"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="订单备注" prop="orderDetail">
          <el-input
            v-model="temp.orderDetail"
            type="textarea"
            :rows="4"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="会员信息" :visible.sync="registerVisible" width="37%">
      <el-form
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="姓名">
          <el-input :value="registerData.registerAccount" readonly />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input :value="registerData.registerPhone" readonly />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input :value="registerData.registerEmail" readonly />
        </el-form-item>
        <el-form-item label="会员等级">
          <el-input :value="registerData.memberDetail" readonly />
        </el-form-item>
        <el-form-item label="会员折扣">
          <el-input :value="registerData.memberDiscount" readonly />
        </el-form-item>
        <el-form-item label="会员积分">
          <el-input :value="registerData.memberScore" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="registerVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOneRegisterByPhone } from '@/api/hotel-admin/register-info'
import { getOrders, updateOrderInfo, deleteOrderInfo } from '@/api/hotel-admin/order-info'
import { getRoomNumByType } from '@/api/hotel-admin/room-info'
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
        orderId: '',
        registerPhone: '',
        roomTypeName: '',
        beginDate: '',
        endDate: ''
      },
      tableData: [],
      registerData: {},
      options: [],
      selectMaxRoomNum: 0,
      temp: {
        orderId: 1,
        registerPhone: '',
        roomTypeName: '',
        orderCreatedTime: '',
        orderCheckInTime: '',
        orderLeaveTime: '',
        orderPayment: 0,
        orderRoomNum: 0,
        orderDetail: '',
        complete: 1
      },
      orderFormVisible: false,
      registerVisible: false,
      dialogStatus: '',
      rules: {
        orderRoomNum: [
          { required: true, message: '请指定房间数量', trigger: 'change' },
          { required: true, pattern: /^[0-9]\d*$/, message: '不可填写非数字字符', trigger: 'change' }
        ],
        orderLeaveTime: [
          { required: true, message: '请指定居住时间', trigger: 'change' }
        ]
      },
      downloadLoading: false
    }
  },
  computed: {
    orderTimeInterval: {
      get() {
        return [this.listQuery.beginDate, this.listQuery.endDate]
      },
      set(value) {
        if (value) {
          this.listQuery.beginDate = value[0]
          this.listQuery.endDate = value[1]
        } else {
          this.listQuery.beginDate = ''
          this.listQuery.endDate = ''
        }
      }
    },
    livingDurationTime: {
      get() {
        return [this.temp.orderCheckInTime, this.temp.orderLeaveTime]
      },
      set(value) {
        if (value) {
          this.temp.orderCheckInTime = value[0]
          this.temp.orderLeaveTime = value[1]
        } else {
          this.temp.orderCheckInTime = ''
          this.temp.orderLeaveTime = ''
        }
      }
    }
  },
  watch: {
    'temp.roomTypeName': {
      handler(newName, oldName) {
        for (const ele of this.options) {
          if (ele.roomTypeName === newName) {
            this.selectMaxRoomNum = ele.sumEmpty
            break
          }
        }
      }
    }
  },
  created() {
    this.fetchData()
    setTimeout(() => {
      this.$message({
        message: '点击手机号可查看下单用户详细信息',
        center: true
      })
    }, 1000)
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getOrders(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'orderId') {
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
        orderId: 1,
        registerPhone: '',
        roomTypeName: '',
        orderCreatedTime: '',
        orderCheckInTime: '',
        orderLeaveTime: '',
        orderPayment: 0,
        orderRoomNum: 0,
        orderDetail: '',
        complete: 1
      }
    },
    handleUpdate(row) {
      getRoomNumByType().then((response) => {
        this.options = response.data
      })
      this.temp = Object.assign({}, row) // copy obj
      for (const item of this.options) {
        if (item.roomTypeName === this.temp.roomTypeName) {
          this.selectMaxRoomNum = item.sumEmpty
          break
        }
      }
      this.orderFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.orderFormVisible = false
          return new Promise((resolve, reject) => {
            const tempData = Object.assign({}, this.temp)
            updateOrderInfo(tempData).then(response => {
              const { data } = response
              if (data === true) {
                for (const v of this.tableData) {
                  if (v.orderId === this.temp.orderId) {
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
                reject('update order info failed')
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
        const { orderId } = this.temp
        deleteOrderInfo(orderId).then(response => {
          const { data } = response
          if (data === true) {
            for (const v of this.tableData) {
              if (v.orderId === orderId) {
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
            reject('delete order info failed')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getOneRegisterData(registerPhone) {
      this.registerVisible = true
      return new Promise((resolve, reject) => {
        getOneRegisterByPhone(registerPhone).then((response) => {
          const { data } = response
          if (data) {
            this.registerData = data
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
          const tHeader = ['订单号', '下单手机号', '房间类型', '订单创建时间', '订单入住时间', '订单离开时间', '订单费用', '房间数量', '订单详情', '完成情况']
          const filterVal = ['orderId', 'registerPhone', 'roomTypeName', 'orderCreatedTime', 'orderCheckInTime', 'orderLeaveTime', 'orderPayment', 'orderRoomNum', 'orderDetail', 'complete']
          const data = this.formatJson(filterVal, this.tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'order-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'complete') {
          return v[j] === 1 ? '完成' : '未完成'
        } else {
          return v[j]
        }
      }))
    },
    refreshMaxRoomNum() {
      for (const ele of this.options) {
        if (ele.roomTypeName === this.temp.roomTypeName) {
          this.selectMaxRoomNum = ele.sumEmpty
          break
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
#search-date-picker {
  margin-bottom:10px;
  display: inline-block;
  vertical-align: middle;
}

/deep/ .el-table {
  .el-table__expand-icon {
    float: right;
  }
  th:first-child, td:first-child {
    border-right: 0;
    background-color: #fff;
  }
}
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
