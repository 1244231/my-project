<template>
  <div class="login-page">
    <div class="login-container">
      <h2 class="login-title">易指快销登录</h2>
      <el-form :model="loginForm" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="手机号"
            maxlength="11"
            prefix-icon="el-icon-user"
            type="text"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密码"
            type="password"
            prefix-icon="el-icon-lock"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            round
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import moduleName from '../';
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #25c7ba, #ccc);
  margin: 0;
}

.login-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 30px 20px;
  width: 400px;
  text-align: center;
}

.login-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.el-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #ccc;
  background: transparent !important;
}

.el-input:focus-within {
  border-color: #25c7ba;
  transition: border-color 0.5s;
  color: #000;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  background-color: #25c7ba;
}

::v-deep(.el-input__inner) {
  border: none;
  background: transparent;
  box-shadow: none;
  outline: none;
}

::v-deep(.el-input__inner::placeholder) {
  color: #ccc;
}
</style>
