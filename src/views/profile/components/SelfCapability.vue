<template>
  <div class="self-capability">
    <div class="post">
      <div class="capability-block">
        <span class="capability-name text-muted">技能清单</span>
      </div>
      <ul class="list-capability">
        <li v-for="(item, key) in userCapability.skills" :key="key">
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="post">
      <div class="capability-block">
        <span class="capability-name text-muted">开源项目</span>
      </div>
      <ul class="list-capability">
        <li v-for="(item, key) in userCapability.repos" :key="key">
          {{ item.description }}
          <a
            style="color: cornflowerblue"
            :href="item.link"
            target="_blank"
          >
            {{ item.link }}
          </a>
        </li>
      </ul>
    </div>

    <div class="post">
      <div class="capability-block">
        <span class="capability-name text-muted">技术文章</span>
      </div>
      <ul class="list-capability">
        <li v-for="(item, key) in userCapability.articles" :key="key">
          <a
            style="color: cornflowerblue"
            :href="item.articleLink"
            target="_blank"
          >
            {{ item.articleTile }}
          </a>
        </li>
      </ul>
    </div>

    <div class="post">
      <div class="capability-block">
        <span class="capability-name text-muted">项目经历</span>
      </div>
      <ul class="list-capability">
        <li v-for="(item, key) in userCapability.experience" :key="key">
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="post">
      <div class="capability-block">
        <span class="capability-name text-muted">在校任职</span>
      </div>
      <ul class="list-capability">
        <li v-for="(item, key) in userCapability.stuJobs" :key="key">
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="post">
      <div class="capability-block">
        <span class="capability-name">获奖证书</span>
      </div>
      <div class="capability-images">
        <el-image
          v-for="(item, key) in userCapability.images"
          :key="key"
          class="image"
          fit="cover"
          :src="item"
          :preview-src-list="userCapability.images"
        >
          <div slot="placeholder">
            加载中...
          </div>
        </el-image>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userCapability: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.self-capability {
  .capability-block {
    .capability-name{
      display: block;
      padding: 2px 0;
      font-size: 20px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 240px;
      height: 200px;
      margin-right: 20px;
    }

    .list-capability {
      padding-left: 20px;

      li {
        margin-bottom: 5px;
      }
    }

    .capability-images {
      padding-top: 20px;
    }
  }
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  position: relative;
  top: 40%;
  left: 50%;
}

.el-carousel__item {
  background-color: #99a9bf;
}
</style>
