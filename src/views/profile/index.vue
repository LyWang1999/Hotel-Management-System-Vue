<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="7" :xs="24">
          <user-card
            :user="user"
          />
          <div class="thank-watching">
            <h3>致谢</h3>
            <p>感谢您花时间阅读我的简历</p>
            <p>期待能有机会和您共事</p>
          </div>
        </el-col>

        <el-col :span="17" :xs="24">
          <el-card>

            <el-tabs v-model="activeTab">
              <el-tab-pane label="个人能力" name="SelfCapability">
                <self-capability
                  :user-capability="userCapability"
                />
              </el-tab-pane>

              <el-tab-pane label="项目详情" name="project-detail">
                <project-detail
                  :images="projectDetail.images"
                  :projects="projectDetail.projects"
                />
              </el-tab-pane>

            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import SelfCapability from './components/SelfCapability'
import ProjectDetail from './components/ProjectDetail'

export default {
  name: 'Profile',
  components: { UserCard, SelfCapability, ProjectDetail },
  data() {
    return {
      // 关于我
      user: {
        name: '王凌云',
        role: '本科生',
        education: '浙江工业大学 - 计算机学院 - 软件工程',
        phone: '17857699125',
        email: '1664269235@qq.com',
        qq: '1664269235',
        expectedJob: 'Java后端开发 / 大数据平台架构',
        expectedCity: '杭州 / 宁波',
        gitHubLink: 'https://github.com/kuluoluohaoxiuyi',
        blogLink: 'https://www.cnblogs.com/kuluo/',
        avatar: ''
      },
      // 个人能力
      userCapability: {
        skills: [
          'WEB框架：SpringBoot / SpringMVC / MyBatis / Netty',
          'WEB常用第三方库：PageHelper / GeneralMapper / ProtoStuff / AutoValue',
          '大数据框架：Spark / Flume / Kafka / ZooKeeper / Sqoop',
          '前端框架：Vue / ElementUI / LayUI',
          '数据库：MySQL / HBase / Hive',
          '版本管理和自动化部署工具：Git / Maven / npm'
        ],
        repos: [
          {
            description: 'SpringBoot + MyBatis 酒店管理系统后端：',
            link: 'https://github.com/kuluoluohaoxiuyi/Hotel-Management-System-Springboot'
          },
          {
            description: 'Vue + ElementUI 酒店管理系统前端：',
            link: 'https://github.com/kuluoluohaoxiuyi/Hotel-Management-System-Vue'
          },
          {
            description: 'Spring + Struts + MyBatis + LayUI 人脸识别签到：',
            link: 'https://github.com/kuluoluohaoxiuyi/facecheck-management'
          },
          {
            description: 'Spring + Struts + MyBatis + LayUI 酒店管理系统：',
            link: 'https://github.com/iamStephenFang/Hotel-Management-System'
          }
        ],
        articles: [
          {
            articleTile: '实时流处理的单节点伪分布式环境搭建',
            articleLink: 'https://www.cnblogs.com/kuluo/p/12586627.html'
          },
          {
            articleTile: 'Spark学习摘记 —— Pair RDD行动操作API归纳',
            articleLink: 'https://www.cnblogs.com/kuluo/p/12567221.html'
          },
          {
            articleTile: 'Netty + Spring + ZooKeeper搭建轻量级RPC框架',
            articleLink: 'https://www.cnblogs.com/kuluo/p/12722255.html'
          },
          {
            articleTile: '深入理解Netty核心组件',
            articleLink: 'https://www.cnblogs.com/kuluo/p/12618823.html'
          }
        ],
        experience: [
          '服务外包国赛赛题 —— 东软 —— 交通时空大数据分析挖掘系统',
          '服务外包省赛赛题 —— 恒生电子 —— 用户行为分析平台'
        ],
        stuJobs: [
          '计算机学院团学学生会 —— E度电视台 —— 部长',
          '五四青年节宣传品制作',
          '十佳歌手宣传品制作',
          '2018新生迎新活动宣传品制作',
          '举办主持人大赛'
        ],
        images: []
      },
      // 项目详情
      projectDetail: {
        projects: [
          {
            projectName: '交通时空大数据分析挖掘系统',
            myJobs: [
              '搭建Flume + Kafka + Spark Streaming大数据实时流计算引擎',
              '搭建KubeSphere分布式容器化微服务平台'
            ]
          },
          {
            projectName: '用户行为分析平台',
            myJobs: [
              '开发基于SpringBoot + MyBatis的WEB应用'
            ]
          }
        ],
        images: []
      },
      activeTab: 'SelfCapability'
    }
  }
}
</script>

<style lang="scss" scoped>
  .thank-watching {
    margin: 5px 10px 20px;
    border-top: 3px solid #dfe6ec;
    text-align: center;
    opacity: .9;

    h3 {
      color: #5a5e66;
      margin-bottom: 10px;
    }

    p {
      font-size: 14px;
      margin: 5px 0;
      color: #666;
    }
  }
</style>
