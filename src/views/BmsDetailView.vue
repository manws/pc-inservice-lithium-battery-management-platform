<template>
  <StageCanvas>
    <div class="screen" v-if="detail">
      <div class="bg"></div>

      <div class="header layer">
        <div class="h-left">
          <div class="back-btn" title="返回充电柜" @click="router.push({ name: 'charging' })">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 4L7 10l5.5 6" stroke="#00c2ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="title-group">
            <div class="title">充电柜01信息详情</div>
            <div class="subtitle">BATTERY MANAGEMENT SYSTEM</div>
          </div>
        </div>
        <div class="h-right">
          <div class="status-pill">
            <span class="dot"></span>
            <span class="t">{{ detail.statusText }}</span>
          </div>
          <div class="h-time">{{ clock }}</div>
        </div>
      </div>

      <div class="body layer">
        <div class="left-col">
          <div class="device-card">
            <div class="dc-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="8" width="19" height="12" rx="2" stroke="#00d9ff" stroke-width="2" />
                <rect x="23" y="11" width="2.5" height="6" rx="1" fill="#00d9ff" />
                <path d="M9 14h6M12 11v6" stroke="#00d9ff" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </div>
            <div class="dc-info">
              <div class="name">{{ detail.name }}</div>
              <div class="model">{{ detail.model }}</div>
            </div>
            <div class="dc-temp">
              <div class="v">{{ detail.temperature }}°C</div>
              <div class="l">电池温度</div>
            </div>
          </div>

          <div class="soc-card">
            <div class="ring-wrap">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00e5ff" />
                    <stop offset="100%" stop-color="#1e88ff" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(15,36,56,0.9)" stroke-width="14" />
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="url(#ringGrad)"
                  stroke-width="14"
                  stroke-linecap="round"
                  stroke-dasharray="540.35"
                  :stroke-dashoffset="socOffset"
                />
              </svg>
              <div class="ring-center">
                <div class="soc-val"><span class="num">{{ detail.soc }}</span><span class="pct">%</span></div>
                <div class="soc-lbl">剩余电量 SOC</div>
              </div>
            </div>
            <div class="soc-right">
              <div class="soc-item">
                <div class="l">总电压</div>
                <div class="v">{{ detail.voltage }} V</div>
              </div>
              <div class="soc-divider"></div>
              <div class="soc-item">
                <div class="l">总电流</div>
                <div class="v green">{{ detail.current }} A</div>
              </div>
              <div class="soc-divider"></div>
              <div class="soc-item">
                <div class="l">实时功率</div>
                <div class="v">{{ detail.power }} W</div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-col">
          <div class="section-head"><span class="bar"></span><span class="t">实时参数</span></div>
          <div class="param-grid">
            <div v-for="item in detail.params" :key="item.label" class="p-cell">
              <div class="l">{{ item.label }}</div>
              <div class="v" :class="item.valueTone">{{ item.value }}</div>
              <div class="s" :class="item.hintTone">{{ item.hint }}</div>
            </div>
          </div>

          <div class="bottom">
            <div class="prot-card">
              <div class="section-head green"><span class="bar"></span><span class="t sm">保护状态</span></div>
              <div class="prot-list">
                <div v-for="item in detail.protections" :key="item.label" class="prot-row">
                  <span class="l">{{ item.label }}</span>
                  <span class="prot-tag"><span class="d"></span><span class="t">{{ item.status }}</span></span>
                </div>
              </div>
            </div>

            <div class="alarm-card">
              <div class="alarm-head">
                <div class="section-head orange"><span class="bar"></span><span class="t sm">告警信息</span></div>
                <span class="alarm-cnt">{{ detail.alarms.length }} 条</span>
              </div>
              <div v-for="item in detail.alarms" :key="item.title" class="alarm-item" :class="item.type">
                <div class="ai-icon" :class="item.type">
                  <svg v-if="item.type === 'warn'" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7" stroke="#ffb040" stroke-width="1.6" />
                    <path d="M9 5.2V9.6" stroke="#ffb040" stroke-width="1.6" stroke-linecap="round" />
                    <circle cx="9" cy="12.4" r="0.9" fill="#ffb040" />
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7" stroke="#00d9ff" stroke-width="1.6" />
                    <path d="M5.8 9.2L8 11.2L12.2 6.6" stroke="#00d9ff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="ai-text">
                  <div class="t1">{{ item.title }}</div>
                  <div class="t2" :class="item.type">{{ item.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </StageCanvas>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StageCanvas from '@/components/StageCanvas.vue'
import { useBmsStore } from '@/stores/bms'
import { useClock } from '@/composables/useClock'

const route = useRoute()
const router = useRouter()
const bms = useBmsStore()
const { clock } = useClock()

const detail = computed(() => bms.detail)
const socOffset = computed(() => {
  const soc = detail.value?.soc || 0
  return 540.35 * (1 - soc / 100)
})

function load() {
  bms.loadDetail(route.params.cabinetId)
}

onMounted(load)
watch(() => route.params.cabinetId, load)
</script>

<style scoped>
.screen {
  position: relative;
  width: 1280px;
  height: 800px;
  background: #050f24;
  overflow: hidden;
  color: #fff;
}

.bg {
  position: absolute;
  inset: 0;
  background: url("/assets/bms/bg.jpeg") center/cover no-repeat;
  z-index: 0;
}

.layer {
  position: relative;
  z-index: 1;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 84px;
  padding: 0 40px;
  background: rgba(10, 28, 54, 0.5);
}

.h-left {
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

.title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title {
  font-size: 24px;
  font-weight: 700;
}

.subtitle {
  font-family: var(--font-en);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  color: #7fb8e0;
}

.h-right {
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
  border-radius: 16px;
  background: rgba(33, 140, 89, 0.25);
}

.status-pill .dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #33e68c;
  box-shadow: 0 0 8px rgba(51, 224, 140, 0.8);
}

.status-pill .t {
  font-size: 13px;
  font-weight: 500;
  color: #33e08c;
}

.h-time {
  font-family: var(--font-en);
  font-size: 20px;
  font-weight: 700;
}

.body {
  display: flex;
  gap: 24px;
  height: 716px;
  padding: 20px 40px 24px;
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 472px;
}

.right-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.device-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 22px;
  border-radius: 16px;
  background: rgba(10, 28, 54, 0.6);
  border: 1px solid rgba(0, 194, 255, 0.08);
}

.dc-icon {
  width: 52px;
  height: 52px;
  border-radius: 13px;
  flex-shrink: 0;
  background: rgba(0, 194, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dc-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  font-size: 17px;
  font-weight: 700;
}

.model {
  font-family: var(--font-en);
  font-size: 12px;
  color: #7fb8e0;
}

.dc-temp {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.dc-temp .v {
  font-family: var(--font-en);
  font-size: 20px;
  font-weight: 700;
  color: #33e08c;
}

.dc-temp .l {
  font-size: 12px;
  color: #7fb8e0;
}

.soc-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 32px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(0, 140, 242, 0.22), rgba(8, 33, 66, 0.55));
  box-shadow: 0 0 30px rgba(0, 194, 255, 0.2);
  border: 1px solid rgba(0, 194, 255, 0.12);
}

.ring-wrap {
  position: relative;
  width: 200px;
  height: 200px;
  flex-shrink: 0;
}

.ring-wrap svg {
  transform: rotate(-90deg);
}

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.soc-val {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.soc-val .num {
  font-family: var(--font-en);
  font-size: 48px;
  font-weight: 700;
}

.soc-val .pct {
  font-family: var(--font-en);
  font-size: 20px;
  font-weight: 500;
  color: #00d9ff;
}

.soc-lbl {
  font-size: 14px;
  color: #7fb8e0;
}

.soc-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.soc-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.soc-item .l {
  font-size: 13px;
  color: #7fb8e0;
}

.soc-item .v {
  font-family: var(--font-en);
  font-size: 28px;
  font-weight: 700;
}

.soc-item .v.green {
  color: #33e08c;
}

.soc-divider {
  height: 1px;
  background: rgba(0, 194, 255, 0.15);
}

.section-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-head .bar {
  width: 4px;
  height: 20px;
  border-radius: 2px;
  background: #00c2ff;
}

.section-head .t {
  font-size: 20px;
  font-weight: 700;
}

.param-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.p-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 14px 16px 18px;
  border-radius: 14px;
  background: rgba(13, 36, 66, 0.55);
  border: 1px solid rgba(0, 194, 255, 0.06);
}

.p-cell .l {
  font-size: 13px;
  color: #7fb8e0;
}

.p-cell .v {
  font-family: var(--font-en);
  font-size: 26px;
  font-weight: 700;
}

.p-cell .v.green {
  color: #33e08c;
}

.p-cell .v.cyan {
  color: #00c2ff;
}

.p-cell .s {
  font-size: 12px;
  color: #5b7a95;
}

.p-cell .s.green {
  color: #33e08c;
}

.bottom {
  display: flex;
  gap: 16px;
  flex: 1;
}

.prot-card,
.alarm-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 18px 22px;
  border-radius: 16px;
  background: rgba(10, 28, 54, 0.6);
  border: 1px solid rgba(0, 194, 255, 0.08);
}

.prot-card {
  gap: 14px;
}

.alarm-card {
  gap: 12px;
}

.section-head.green .bar {
  background: #33e08c;
}

.section-head.orange .bar {
  background: #ffb040;
}

.section-head .t.sm {
  font-size: 18px;
}

.prot-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prot-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 12px 0 14px;
  border-radius: 10px;
  background: rgba(5, 15, 36, 0.5);
}

.prot-row .l {
  font-size: 14px;
  color: #d5e8f5;
}

.prot-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 0 9px;
  border-radius: 12px;
  background: rgba(33, 140, 89, 0.22);
}

.prot-tag .d {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: #33e08c;
}

.prot-tag .t {
  font-size: 12px;
  font-weight: 500;
  color: #33e08c;
}

.alarm-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alarm-cnt {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 11px;
  background: rgba(255, 176, 64, 0.22);
  font-size: 12px;
  font-weight: 500;
  color: #ffb040;
}

.alarm-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
}

.alarm-item.warn {
  background: rgba(51, 33, 8, 0.5);
}

.alarm-item.info {
  background: rgba(5, 15, 36, 0.5);
}

.ai-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-icon.warn {
  background: rgba(255, 176, 64, 0.18);
}

.ai-icon.info {
  background: rgba(0, 194, 255, 0.15);
}

.ai-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ai-text .t1 {
  font-size: 14px;
  font-weight: 500;
}

.ai-text .t2 {
  font-size: 12px;
}

.ai-text .t2.warn {
  color: #b08050;
}

.ai-text .t2.info {
  color: #5b7a95;
}
</style>
