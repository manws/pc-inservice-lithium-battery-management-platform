<template>
  <StageCanvas :stage-class="{ 'kb-open': kbOpen }">
    <img class="bg" src="/assets/login/bg.jpeg" alt="" />

    <div class="brand">
      <div class="logo">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="22" stroke="#00C2FF" stroke-width="2" />
          <circle cx="28" cy="28" r="14" stroke="#00C2FF" stroke-width="1.5" stroke-opacity=".7" />
          <circle cx="28" cy="28" r="6" fill="#00C2FF" />
        </svg>
      </div>
      <div class="brand-title">在役锂电池精细化管理平台</div>
      <div class="brand-sub">IN-SERVICE LITHIUM BATTERY MANAGEMENT PLATFORM</div>
      <div class="brand-line"></div>
    </div>

    <form class="card" :class="{ 'kb-shift': kbOpen }" @submit.prevent="tryLogin">
      <div class="welcome">欢迎登录</div>
      <div class="card-sub">Welcome back, please enter your account</div>
      <div class="underline"></div>

      <label class="field" :class="{ 'is-active': activeField === 'username' }" @click.stop="openKeyboard('username')">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3.5" stroke="#00C2FF" stroke-width="1.5" />
          <path d="M4 16.5C4 13.46 6.69 11 10 11C13.31 11 16 13.46 16 16.5" stroke="#00C2FF" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <input
          :value="username"
          type="text"
          placeholder="请输入用户名"
          autocomplete="off"
          inputmode="none"
          readonly
          @focus="$event.target.blur()"
        />
      </label>

      <label class="field" :class="{ 'is-active': activeField === 'password' }" @click.stop="openKeyboard('password')">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="4.25" y="9.25" width="11.5" height="8.5" rx="1.5" stroke="#00C2FF" stroke-width="1.5" />
          <path d="M6.75 9V6C6.75 4.2 8.2 2.75 10 2.75C11.8 2.75 13.25 4.2 13.25 6V9" stroke="#00C2FF" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="10" cy="13.5" r="1.5" fill="#00C2FF" />
        </svg>
        <input
          :value="password"
          type="password"
          placeholder="请输入密码"
          autocomplete="off"
          inputmode="none"
          readonly
          @focus="$event.target.blur()"
        />
      </label>

      <button class="btn" type="submit">
        <span>登&nbsp;录</span>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 9H14M14 9L9.5 4.5M14 9L9.5 13.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div class="login-error" :class="{ 'is-show': Boolean(error) }">{{ error || '请输入用户名和密码' }}</div>
    </form>

    <div class="features">
      <div class="feature">
        <div class="ico">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M2 11H6L8.5 4L13 18L15.5 11H20" stroke="#00C2FF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <span>实时监测</span>
      </div>
      <div class="feature">
        <div class="ico">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#00C2FF" stroke-width="1.5" />
            <path d="M11 7V11L13.5 12.5" stroke="#00C2FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <span>智能调度</span>
      </div>
      <div class="feature">
        <div class="ico">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="3" y="13" width="4" height="6" rx="1" stroke="#00C2FF" stroke-width="1.5" />
            <rect x="9" y="8" width="4" height="11" rx="1" stroke="#00C2FF" stroke-width="1.5" />
            <rect x="15" y="3" width="4" height="16" rx="1" stroke="#00C2FF" stroke-width="1.5" />
          </svg>
        </div>
        <span>数据分析</span>
      </div>
    </div>

    <div class="copyright">Copyright © 2026 Smart Energy Technology Co., Ltd. All Rights Reserved.</div>

    <div class="custom-keyboard" :class="{ 'is-open': kbOpen }" @mousedown.prevent @click.stop>
      <div class="kb-header">
        <span class="kb-hint">{{ kbHint }}</span>
        <button type="button" class="kb-done" @click="hideKeyboard">完成</button>
      </div>
      <div class="keyboard-row">
        <div v-for="char in numbers" :key="char" class="key" @click="insertChar(char)">{{ char }}</div>
      </div>
      <div v-for="row in letterRows" :key="row" class="keyboard-row">
        <div
          v-for="char in row.split('')"
          :key="char"
          class="key"
          @click="insertChar(isUpperCase ? char.toUpperCase() : char)"
        >
          {{ isUpperCase ? char.toUpperCase() : char }}
        </div>
      </div>
      <div class="keyboard-row">
        <div class="key key-shift" :class="{ 'is-active': isUpperCase }" @click="isUpperCase = !isUpperCase">Shift</div>
        <div class="key key-space" @click="insertChar(' ')">空格</div>
        <div class="key key-backspace" @click="backspace">退格</div>
      </div>
    </div>
  </StageCanvas>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import StageCanvas from '@/components/StageCanvas.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const kbOpen = ref(false)
const activeField = ref('')
const isUpperCase = ref(false)
const numbers = '1234567890'.split('')
const letterRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
let ignoreDocClickUntil = 0

const kbHint = computed(() => (activeField.value === 'password' ? '请输入密码' : '请输入用户名'))

function openKeyboard(field) {
  activeField.value = field
  kbOpen.value = true
  ignoreDocClickUntil = Date.now() + 400
}

function hideKeyboard() {
  kbOpen.value = false
  activeField.value = ''
}

function insertChar(char) {
  if (activeField.value === 'password') {
    password.value += char
  } else if (activeField.value === 'username') {
    username.value += char
  }
  error.value = ''
}

function backspace() {
  if (activeField.value === 'password') {
    password.value = password.value.slice(0, -1)
  } else if (activeField.value === 'username') {
    username.value = username.value.slice(0, -1)
  }
  error.value = ''
}

async function tryLogin() {
  const user = username.value.trim()
  const pass = password.value.trim()
  if (!user || !pass) {
    error.value = !user && !pass ? '请输入用户名和密码' : !user ? '请输入用户名' : '请输入密码'
    return
  }
  error.value = ''
  await auth.login(user, pass)
  router.push({ name: 'charging' })
}

function onDocClick(event) {
  if (!kbOpen.value || Date.now() < ignoreDocClickUntil) return
  if (event.target.closest('.field') || event.target.closest('.custom-keyboard')) return
  hideKeyboard()
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
})
</script>

<style scoped>
.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.brand {
  position: absolute;
  left: -28px;
  top: 172px;
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 2;
}

.logo {
  width: 88px;
  height: 88px;
  border-radius: 20px;
  background: rgba(0, 194, 255, 0.3);
  border: 1px solid #00d9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(0, 194, 255, 0.6);
}

.brand-title {
  font-size: 34px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
  text-shadow: 0 0 18px rgba(0, 194, 255, 0.55);
}

.brand-sub {
  font-family: var(--font-en);
  font-size: 13px;
  font-weight: 500;
  color: #33e0ff;
  letter-spacing: 2.5px;
  text-shadow: 0 0 10px rgba(0, 194, 255, 0.4);
}

.brand-line {
  width: 64px;
  height: 3px;
  border-radius: 2px;
  background: #33e0ff;
  box-shadow: 0 0 14px rgba(0, 217, 255, 0.8);
}

.card {
  position: absolute;
  left: 744px;
  top: 180px;
  width: 480px;
  padding: 48px;
  border-radius: 16px;
  background: rgba(13, 36, 66, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 24px;
  z-index: 3;
  box-shadow: 0 0 50px rgba(0, 194, 255, 0.25), 0 20px 40px -8px rgba(0, 0, 0, 0.4);
  transition: top 0.28s ease;
}

.card.kb-shift {
  top: 36px;
}

.welcome {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
}

.card-sub {
  font-family: var(--font-en);
  font-size: 14px;
  color: #7fb8e0;
}

.underline {
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, rgba(0, 194, 255, 0) 0%, rgba(0, 194, 255, 0.5) 50%, rgba(0, 194, 255, 0) 100%);
}

.field {
  height: 52px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border-radius: 8px;
  background: rgba(5, 15, 36, 0.6);
  border: 1px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field.is-active {
  border-color: #00c2ff;
  box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.12);
}

.field svg {
  flex: none;
}

.field input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  caret-color: #00c2ff;
  font-family: var(--font-cn);
  font-size: 14px;
  color: #dcebfa;
}

.field input::placeholder {
  color: #5b7a95;
}

.btn {
  height: 52px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(90deg, #00c2ff 0%, #1f8cf2 100%);
  box-shadow: 0 4px 16px rgba(0, 194, 255, 0.4);
  font-family: var(--font-cn);
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 4px;
  transition: transform 0.15s, box-shadow 0.2s;
}

.btn:hover {
  box-shadow: 0 6px 22px rgba(0, 194, 255, 0.55);
  transform: translateY(-1px);
}

.login-error {
  min-height: 18px;
  font-size: 13px;
  color: #ff8a8a;
  text-align: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.login-error.is-show {
  opacity: 1;
}

.features {
  position: absolute;
  left: 12px;
  top: 566px;
  width: 720px;
  height: 80px;
  display: flex;
  gap: 56px;
  z-index: 2;
}

.feature {
  width: 200px;
  height: 60px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.ico {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0, 194, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.feature span {
  font-size: 18px;
  font-weight: 500;
  color: #b0d4f2;
}

.copyright {
  position: absolute;
  left: 0;
  top: 742px;
  width: 744px;
  text-align: center;
  font-family: var(--font-en);
  font-size: 12px;
  color: #5b7a95;
  z-index: 2;
}

.custom-keyboard {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  padding: 16px 24px 20px;
  border-radius: 16px 16px 0 0;
  background: rgba(8, 24, 48, 0.94);
  border-top: 1px solid rgba(0, 194, 255, 0.45);
  box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.45), 0 -4px 24px rgba(0, 194, 255, 0.18);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transform: translateY(110%);
  pointer-events: none;
  transition: transform 0.28s ease;
  user-select: none;
  -webkit-user-select: none;
}

.custom-keyboard.is-open {
  transform: translateY(0);
  pointer-events: auto;
}

.kb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}

.kb-hint {
  font-size: 13px;
  color: #7fb8e0;
  letter-spacing: 0.5px;
}

.kb-done {
  height: 32px;
  padding: 0 16px;
  border: 1px solid #00c2ff;
  border-radius: 6px;
  background: rgba(0, 194, 255, 0.15);
  color: #00d9ff;
  font-family: var(--font-cn);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.kb-done:active {
  background: rgba(0, 194, 255, 0.3);
}

.keyboard-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  justify-content: center;
}

.custom-keyboard > .keyboard-row:last-child {
  margin-bottom: 0;
}

.key {
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(5, 15, 36, 0.75);
  border: 1px solid #1a4d73;
  border-radius: 8px;
  font-family: var(--font-en);
  font-size: 18px;
  font-weight: 500;
  color: #dcebfa;
  cursor: pointer;
  transition: background 0.1s, border-color 0.1s, box-shadow 0.1s, color 0.1s;
}

.key:active {
  background: rgba(0, 194, 255, 0.28);
  border-color: #00c2ff;
  box-shadow: 0 0 12px rgba(0, 194, 255, 0.35);
  color: #fff;
}

.key-shift,
.key-backspace {
  flex: 1.6;
  font-family: var(--font-cn);
  font-size: 15px;
}

.key-space {
  flex: 4;
  font-family: var(--font-cn);
  font-size: 15px;
  color: #7fb8e0;
}

.key-shift.is-active {
  background: rgba(0, 194, 255, 0.35);
  border-color: #00d9ff;
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 194, 255, 0.4);
}
</style>
