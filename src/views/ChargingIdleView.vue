<template>
  <StageCanvas>
    <img class="tech-bg" src="/assets/charging/139_2-20260828_132509904.png" alt="" />

    <div class="header">
      <div class="header-left">
        <div class="back-btn" title="返回登录" @click="goLogin">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 4L7 10l5.5 6" stroke="#00c2ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="logo-box">
          <img src="/assets/charging/139_10-20260828_132509725.svg" alt="logo" />
        </div>
        <div class="title-group">
          <div class="title">在役锂电池精细化管理平台</div>
          <div class="subtitle">IN-SERVICE LITHIUM BATTERY MANAGEMENT PLATFORM</div>
        </div>
      </div>
      <div class="header-right">
        <div class="status-pill">
          <span class="dot"></span>
          <span class="txt">{{ overview.statusText }}</span>
        </div>
        <div class="time">{{ clock }}</div>
      </div>
    </div>

    <div v-if="overview.stats" class="body">
      <div class="stat-row">
        <div v-for="item in overview.stats" :key="item.key" class="stat-card">
          <div class="stat-icon"><img :src="item.icon" alt="" /></div>
          <div class="stat-txt">
            <div class="stat-label">{{ item.label }}</div>
            <div class="stat-vrow">
              <span class="stat-value" :class="item.tone">{{ item.value }}</span>
              <span class="stat-unit">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section-header">
        <span class="bar"></span>
        <span class="title-t">设备柜状态</span>
        <span class="count">充电中 {{ chargingCount }} · 空闲 {{ idleCount }}</span>
      </div>

      <div class="cabinet-row">
        <div
          v-for="cabinet in overview.cabinets"
          :key="cabinet.id"
          class="cabinet"
          :class="cabinet.status === 'charging' ? 'active' : 'idle'"
          @click="openCabinet(cabinet)"
        >
          <div class="cab-top">
            <div class="cab-head">
              <span class="cab-no">{{ cabinet.id }}</span>
              <span class="badge" :class="cabinet.status === 'charging' ? 'active' : 'idle'">
                <span class="dot"></span>
                <span class="t">{{ cabinet.status === 'charging' ? '充电中' : '空闲' }}</span>
              </span>
            </div>
            <div class="statwrap">
              <template v-if="cabinet.status === 'charging'">
                <span class="pct active">{{ cabinet.soc }}</span>
                <span class="pct-unit">%</span>
              </template>
              <span v-else class="pct idle">空闲</span>
            </div>
          </div>
          <div class="cab-stats">
            <div class="row">
              <span class="r-label">今日换电</span>
              <span class="r-vr"><span class="r-v white">{{ cabinet.swap }}</span><span class="r-u">次</span></span>
            </div>
            <div class="divider"></div>
            <div class="row">
              <span class="r-label">今日均衡</span>
              <span class="r-vr"><span class="r-v green">{{ cabinet.balance }}</span><span class="r-u">次</span></span>
            </div>
            <div class="divider"></div>
            <div class="row">
              <span class="r-label">今日充电</span>
              <span class="r-vr"><span class="r-v orange">{{ cabinet.charge }}</span><span class="r-u">次</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </StageCanvas>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StageCanvas from '@/components/StageCanvas.vue'
import { useAuthStore } from '@/stores/auth'
import { useChargingStore } from '@/stores/charging'
import { useClock } from '@/composables/useClock'

const router = useRouter()
const auth = useAuthStore()
const charging = useChargingStore()
const { clock } = useClock()

const overview = computed(() => charging.overview || {})
const chargingCount = computed(() => charging.chargingCount)
const idleCount = computed(() => charging.idleCount)

onMounted(() => {
  charging.loadOverview()
})

function openCabinet(cabinet) {
  if (cabinet.status !== 'charging') return
  router.push({ name: 'bms', params: { cabinetId: cabinet.id } })
}

async function goLogin() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.tech-bg {
  position: absolute;
  inset: 0;
  width: 1280px;
  height: 800px;
  object-fit: cover;
  z-index: 0;
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 1280px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: rgba(10, 28, 54, 0.5);
  z-index: 3;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(5, 15, 36, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-btn:hover {
  background: rgba(0, 194, 255, 0.18);
}

.logo-box {
  width: 48px;
  height: 48px;
}

.logo-box img {
  display: block;
  width: 48px;
  height: 48px;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.subtitle {
  font-size: 11px;
  font-weight: 500;
  color: #7fb8e0;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  background: rgba(33, 140, 89, 0.25);
  border-radius: 16px;
}

.status-pill .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #33e58c;
}

.status-pill .txt {
  font-size: 13px;
  font-weight: 500;
  color: #33e08c;
}

.time {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.body {
  position: absolute;
  top: 88px;
  left: 0;
  width: 1280px;
  height: 712px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 24px 40px 28px;
  z-index: 2;
}

.stat-row {
  display: flex;
  gap: 24px;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 26px 28px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(0, 140, 242, 0.25), rgba(8, 33, 66, 0.55));
  box-shadow: 0 0 24px rgba(0, 194, 255, 0.2);
}

.stat-icon {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.stat-icon img {
  display: block;
  width: 56px;
  height: 56px;
}

.stat-txt {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 15px;
  color: #7fb8e0;
}

.stat-vrow {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.stat-value {
  font-size: 44px;
  font-weight: 700;
  line-height: 1;
}

.stat-value.cyan {
  color: #00d9ff;
}

.stat-value.white {
  color: #fff;
}

.stat-unit {
  font-size: 16px;
  color: #7fb8e0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-header .bar {
  width: 4px;
  height: 20px;
  border-radius: 2px;
  background: #00c2ff;
}

.title-t {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.count {
  font-size: 13px;
  color: #7fb8e0;
}

.cabinet-row {
  display: flex;
  gap: 20px;
  flex: 1;
}

.cabinet {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
  border-radius: 18px;
}

.cabinet.active {
  background: linear-gradient(to bottom, rgba(0, 140, 242, 0.32), rgba(8, 33, 66, 0.5));
  border: 1px solid rgba(0, 217, 255, 0.5);
  box-shadow: 0 0 28px rgba(0, 194, 255, 0.28);
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.15s;
}

.cabinet.active:hover {
  box-shadow: 0 0 36px rgba(0, 194, 255, 0.42);
  transform: translateY(-2px);
}

.cabinet.idle {
  background: rgba(13, 31, 56, 0.5);
  border: 1px solid rgba(89, 128, 158, 0.3);
}

.cab-top {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cab-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cab-no {
  font-size: 22px;
  font-weight: 700;
}

.cabinet.active .cab-no {
  color: #8fd4f5;
}

.cabinet.idle .cab-no {
  color: #5e7d94;
}

.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border-radius: 15px;
}

.badge .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.badge .t {
  font-size: 14px;
  font-weight: 500;
}

.badge.active {
  background: rgba(0, 194, 255, 0.22);
}

.badge.active .dot {
  background: #00c2ff;
}

.badge.active .t {
  color: #00d9ff;
}

.badge.idle {
  background: rgba(102, 133, 158, 0.18);
}

.badge.idle .dot {
  background: #8cadc7;
}

.badge.idle .t {
  color: #a8c0d0;
}

.statwrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.pct {
  font-weight: 700;
  line-height: 1;
}

.pct.active {
  font-size: 52px;
  color: #fff;
}

.pct.idle {
  font-size: 36px;
  color: #b8ccdc;
}

.pct-unit {
  font-size: 22px;
  font-weight: 500;
  color: #00d9ff;
}

.cab-stats {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(5, 15, 36, 0.45);
}

.cab-stats .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}

.divider {
  height: 1px;
  background: rgba(0, 194, 255, 0.12);
}

.r-label {
  font-size: 13px;
  color: #9cc5e5;
}

.r-vr {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.r-v {
  font-size: 18px;
  font-weight: 700;
}

.r-v.white {
  color: #fff;
}

.r-v.green {
  color: #33e08c;
}

.r-v.orange {
  color: #ffb040;
}

.r-u {
  font-size: 12px;
  color: #7fb8e0;
}
</style>
