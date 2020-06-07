<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <!--      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">-->
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            注 册 会 员
          </div>
          <count-to :start-val="0" :end-val="registerNum" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <!--      <div class="card-panel" @click="handleSetLineChartData('messages')">-->
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            公 告 信 息
          </div>
          <count-to :start-val="0" :end-val="messageNum" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <!--      <div class="card-panel" @click="handleSetLineChartData('purchases')">-->
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总 收 入 额
          </div>
          <count-to :start-val="0" :end-val="priceSum" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <!--      <div class="card-panel" @click="handleSetLineChartData('shoppings')">-->
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            订 单 数 量
          </div>
          <count-to :start-val="0" :end-val="orderNum" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getRegisterNum } from '@/api/hotel-admin/register-info'
import { getOrderPriceSum } from '@/api/hotel-admin/order-info'
import { getMessageNum } from '@/api/hotel-admin/message-info'
import { getOrderNum } from '@/api/hotel-admin/order-info'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      registerNum: 0,
      priceSum: 0,
      messageNum: 0,
      orderNum: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getRegisterNum().then(response => {
        this.registerNum = response.data
      })
      getOrderPriceSum().then(response => {
        this.priceSum = response.data
      })
      getMessageNum().then(response => {
        this.messageNum = response.data
      })
      getOrderNum().then(response => {
        this.orderNum = response.data
      })
    }
  }
  // methods: {
  //   handleSetLineChartData(type) {
  //     this.$emit('handleSetLineChartData', type)
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
