<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="学 号：">
        <el-input v-model="form.num" style="width: 200px;" placeholder="请输入学号" />
      </el-form-item>
      <el-form-item label="姓 名：">
        <el-input v-model="form.name" style="width: 200px;" placeholder="请输入姓名" />
      </el-form-item>
    </el-form>
    <el-form :inline="true" ref="form" :model="form" label-width="120px">
      <el-form-item label="平均绩点：">
        <el-input v-model="form.GPA" style="width: 100px;" />
      </el-form-item>
      <el-form-item label="班级排名：">
        <el-input v-model="form.ranger" style="width: 100px;" />
      </el-form-item>
    </el-form>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="联系方式：">
        <el-input v-model="form.phone" style="width: 200px;" placeholder="请输入电话" />
      </el-form-item>
      <el-form-item label="学生任职：">
        <el-input v-model="form.work" type="textarea" rows="7" placeholder="填写学生任职情况"/>
      </el-form-item>
    </el-form>
    <el-form :inline="true" ref="form" :model="form" label-width="120px">
      <el-form-item label="高数期中成绩：">
        <el-input type="number" min="0" max="100" v-model="form.mathScore" style="width: 100px;" />
      </el-form-item>
      <el-form-item label="程C期中成绩：">
        <el-input type="number" min="0" max="100" v-model="form.comScore" style="width: 100px;" />
      </el-form-item>
    </el-form>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="个人情况简介：">
        <el-input v-model="form.intro" type="textarea" rows="7"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        ranger: '',
        num: '',
        GPA: '',
        work: '',
        mathScore: '',
        comScore: '',
        phone: '',
        intro: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('提交成功!')
    },
    onCancel() {
      this.$message({
        message: '已取消!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

