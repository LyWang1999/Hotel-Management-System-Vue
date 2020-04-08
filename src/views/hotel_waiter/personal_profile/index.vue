<template>
  <div className="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="学 号：">
        <el-input v-model="form.studentNumber" style="width: 200px;" placeholder="请输入学号" required />
      </el-form-item>
      <el-form-item label="姓 名：">
        <el-input v-model="form.name" style="width: 200px;" placeholder="请输入姓名" required />
      </el-form-item>
      <el-form-item label="性 别：">
        <el-radio-group v-model="form.gender">
          <el-radio label="男" />
          <el-radio label="女" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="专 业：">
        <el-select v-model="form.professionDirectionName" placeholder="请选择您的专业">
          <el-option label="软件工程" value="软件工程" />
          <el-option label="数字媒体技术" value="数字媒体技术" />
          <el-option label="计算机科学与技术" value="计算机科学与技术" />
        </el-select>
      </el-form-item>
      <el-form-item label="班 级：">
        <el-select v-model="form.className" placeholder="请选择您的班级">
          <el-option label="1601" value="1601" />
          <el-option label="1602" value="1602" />
          <el-option label="1701" value="1701" />
          <el-option label="1702" value="1702" />
          <el-option label="1801" value="1801" />
          <el-option label="1802" value="1802" />
          <el-option label="1901" value="1901" />
          <el-option label="1902" value="1902" />
        </el-select>
      </el-form-item>
      <el-form-item label="平均绩点：">
        <el-input v-model="form.gradePointAverage" style="width: 200px;" placeholder="请输入平均绩点" required />
      </el-form-item>
      <el-form-item label="政治面貌：">
        <el-select v-model="form.politicalStatus" placeholder="请选择您的政治面貌">
          <el-option label="团员" value="团员" />
          <el-option label="入党积极分子" value="入党积极分子" />
          <el-option label="党员" value="党员" />
        </el-select>
      </el-form-item>
      <el-form-item label="职业方向：">
        <el-checkbox-group v-model="form.careerPath">
          <el-checkbox label="考研" name="careerPath" />
          <el-checkbox label="出国" name="careerPath" />
          <el-checkbox label="就业" name="careerPath" />
          <el-checkbox label="创业" name="careerPath" />
          <el-checkbox label="其他" name="careerPath" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="联系方式：">
        <el-input v-model="form.phone" style="width: 200px;" placeholder="请输入电话" required />
      </el-form-item>
      <el-form-item label="邮 箱：">
        <el-input v-model="form.mail" style="width: 200px;" placeholder="请输入邮箱" required />
      </el-form-item>
      <el-form-item label="家庭住址：">
        <el-input v-model="form.address" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="项目实践经历：">
        <el-input v-model="form.practicalExperience" type="textarea" rows="7" required />
      </el-form-item>
      <el-form-item label="个人荣誉：">
        <el-input v-model="form.glory" type="textarea" rows="7" required />
      </el-form-item>
      <el-form-item label="研究兴趣方向：">
        <el-input v-model="form.researchInterestDirection" type="textarea" rows="7" required />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保 存</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getOneStudentById } from '@/api/personal_profile'

export default {
  data() {
    return {
      form: {
        name: '',
        gender: '',
        studentNumber: '',
        gradePointAverage: '',
        politicalStatus: '',
        professionDirectionName: '',
        className: '',
        phone: '',
        mail: '',
        address: '',
        careerPath: '',
        practicalExperience: '',
        glory: '',
        researchInterestDirection: ''
      }
    }
  },
  created() {
    this.getPersonalProfile()
  },
  methods: {
    getPersonalProfile() {
      getOneStudentById({
        id: this.$store.getters.id
      }).then(response => {
        this.form.name = response.data.name
        this.form.gender = response.data.gender
        this.form.studentNumber = response.data.studentNumber
        this.form.gradePointAverage = response.data.gradePointAverage
        this.form.politicalStatus = response.data.politicalStatus
        this.form.professionDirectionName = response.data.professionDirectionName
        this.form.className = response.data.className
        this.form.phone = response.data.phone
        this.form.mail = response.data.mail
        this.form.address = response.data.address
        this.form.careerPath = response.data.careerPath
        this.form.practicalExperience = response.data.practicalExperience
        this.form.glory = response.data.glory
        this.form.researchInterestDirection = response.data.researchInterestDirection
        // this.form = response.data
      })
    },
    onSubmit() {
      this.$message('保存成功!')
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

