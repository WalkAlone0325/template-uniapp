<template>
  <view class="page">
    <page-head :title="title"></page-head>

    <view
      class="uni-mx-10 uni-my-10"
      style="height: 40rpx; border: 1px solid #000; background-color: aquamarine"
    ></view>
    <view style="height: 40rpx; border: 1px solid #000; margin: 40rpx; background-color: blue"></view>

    <uni-icons type="icon-daohang" custom-prefix="iconfont"></uni-icons>
    <uni-icons type="icon-dengji" custom-prefix="iconfont" size="30"></uni-icons>
    <uni-icons type="icon-daka" custom-prefix="iconfont" size="30"></uni-icons>

    <base-icon type="icon-daohang" custom @click="clickIcon"></base-icon>
    <base-icon type="spinner-cycle"></base-icon>

    <view class="uni-loadmore">
      <uni-load-more status="more"></uni-load-more>
    </view>

    <uni-list>
      <uni-list-item title="列表文字" note="列表描述信息"></uni-list-item>
      <uni-list-item :disabled="true" title="列表文字" note="列表禁用状态"></uni-list-item>
    </uni-list>

    <view class="uni-card">
      <uni-collapse>
        <uni-collapse-item title="默认开启" :open="true">
          <text>折叠内容</text>
        </uni-collapse-item>
        <uni-collapse-item title="折叠内容">
          <text>折叠内容</text>
        </uni-collapse-item>
        <uni-collapse-item title="禁用状态" disabled>
          <text>折叠内容</text>
        </uni-collapse-item>
      </uni-collapse>

      <view class="uni-list">
        <view
          class="uni-list-cell uni-collapse"
          v-for="(list, index) in lists"
          :key="index"
          :class="index === lists.length - 1 ? 'uni-list-cell-last' : ''"
        >
          <view
            class="uni-list-cell-navigate uni-navigate-bottom"
            hover-class="uni-list-cell-hover"
            :class="list.show ? 'uni-active' : ''"
            @click="trigerCollapse(index)"
          >
            {{ list.title }}
          </view>
          <view class="uni-list uni-collapse" :class="list.show ? 'uni-active' : ''">
            <view
              class="uni-list-cell"
              hover-class="uni-list-cell-hover"
              v-for="(item, key) in list.item"
              :key="key"
              :class="key === list.item.length - 1 ? 'uni-list-cell-last' : ''"
            >
              <view class="uni-list-cell-navigate uni-navigate-right">{{ item }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'list-with-collapses',
      lists: [
        {
          title: '产品',
          show: false,
          item: ['iOS', 'Android', 'HTML5']
        },
        {
          title: '方案',
          show: false,
          item: ['PC方案', '手机方案', 'TV方案']
        },
        {
          title: '新闻',
          show: false,
          item: ['公司新闻', '行业新闻']
        }
      ]
    }
  },
  methods: {
    trigerCollapse(e) {
      for (let i = 0, len = this.lists.length; i < len; ++i) {
        if (e === i) {
          this.lists[i].show = !this.lists[i].show
        } else {
          this.lists[i].show = false
        }
      }
    },
    clickIcon() {
      console.log(uni.$u, '111')
    }
  }
}
</script>

<style></style>
