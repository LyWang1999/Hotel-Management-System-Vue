<template>
  <div class="app-container">
    <div class="filter-container">
      <div id="search-date-picker">
        <el-date-picker
          v-model="messageTimeInterval"
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
      <el-switch
        v-model="timelineVisible"
        active-text="时间线视图"
        style="float: right;margin-top: 10px"
      />
    </div>

    <el-table
      v-loading="listLoading"
      :data="tableData"
      fit
      border
      highlight-current-row
      class="page-component__scroll el-scrollbar"
      @sort-change="sortChange"
    >
      <el-table-column prop="messageId" label="序号" align="center" sortable="custom" width="90" />
      <el-table-column prop="messageTitle" label="标题" align="center" width="200" />
      <el-table-column prop="messageContent" label="内容" align="center" />
      <el-table-column prop="messageSendTime" label="发送时间" align="center" sortable="custom" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.messageSendTime }}</span>
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

    <el-timeline v-show="timelineVisible">
      <el-timeline-item v-for="(item, key) in tableData" :key="key" :timestamp="item.messageSendTime" placement="top">
        <el-card>
          <h4>{{ item.messageTitle }}</h4>
          <p>{{ item.messageContent }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="50"
        transition-name="fade"
      />
    </el-tooltip>

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
          <el-input :value="temp.messageId" :disabled="true" />
        </el-form-item>
        <el-form-item label="标题" prop="messageTitle">
          <el-input
            v-model="temp.messageTitle"
            type="textarea"
            :rows="3"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="内容" prop="messageContent">
          <el-input
            v-model="temp.messageContent"
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
import { getMessages, updateMessageInfo, createMessageInfo, deleteMessageInfo } from '@/api/hotel-admin/message-info'
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination/index'
import waves from '@/directive/waves'

export default {
  components: { Pagination, BackToTop },
  directives: { waves },
  data() {
    return {
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        asc: true,
        beginDate: '',
        endDate: '',
        sortFiled: ''
      },
      tableData: [],
      temp: {
        messageId: 1,
        messageTitle: '',
        messageContent: '',
        messageSendTime: ''
      },
      dialogFormVisible: false,
      timelineVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        messageTitle: [
          { required: true, message: '请填写标题', trigger: 'change' }
        ],
        messageContent: [
          { required: true, message: '请填写内容', trigger: 'change' }
        ]
      },
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中
        background: '#e7eaf1'// 按钮的背景颜色
      },
      downloadLoading: false
    }
  },
  computed: {
    messageTimeInterval: {
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
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMessages(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data
      this.listQuery.sortFiled = prop
      this.listQuery.asc = order === 'ascending'
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        messageId: '待定',
        messageTitle: '',
        messageContent: '',
        messageSendTime: ''
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
            createMessageInfo(tempData).then(response => {
              const { data } = response
              if (data === true) {
                this.temp.messageSendTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
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
                reject('create message info failed')
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
            updateMessageInfo(tempData).then(response => {
              const { data } = response
              if (data === true) {
                this.temp.messageSendTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
                for (const v of this.tableData) {
                  if (v.messageId === this.temp.messageId) {
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
                reject('update message info failed')
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
        const { messageId } = this.temp
        deleteMessageInfo(messageId).then(response => {
          const { data } = response
          if (data === true) {
            for (const v of this.tableData) {
              if (v.messageId === messageId) {
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
            reject('delete message info failed')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '标题', '内容', '发送时间']
          const filterVal = ['messageId', 'messageTitle', 'messageContent', 'messageSendTime']
          const data = this.formatJson(filterVal, this.tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'message-list'
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
#search-date-picker {
  margin-bottom:10px;
  display: inline-block;
  vertical-align: middle;
}
</style>
