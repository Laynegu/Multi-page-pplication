<template>
  <div class="loge">
    <a href="./index.html">点击</a>
    <p>数字为：{{ num }}</p>
    <p>两倍为：{{ double }}</p>
    <button @click="sum">累加</button>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
// import "./main.less";

export default {
  setup() {
    let num = ref(666); // 定义一个响应式的常量

    const double = computed(() => num.value * 2); // 定义一个计算属性

    const sum = () => ++num; // 定义一个方法

    onMounted(() => {
      console.log("页面加载完执行的生命周期钩子函数");
    });

    // ...等等都可以定义在setup函数中

    return {
      // 导出定义的变量和方法，在模板中使用
      num,
      sum,
      double,
    };
  },
};
</script>

<style lang="less" scoped>
.loge {
  background-color: pink;
  button {
    font-size: 32px;
  }
}
</style>
