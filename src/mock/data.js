export const chargingOverview = {
  statusText: '运行正常',
  stats: [
    {
      key: 'swap',
      label: '今日换电数量',
      value: 18,
      unit: '次',
      tone: 'cyan',
      icon: '/assets/charging/139_29-20260828_132509725.svg'
    },
    {
      key: 'balance',
      label: '今日均衡数量',
      value: 2,
      unit: '次',
      tone: 'white',
      icon: '/assets/charging/139_31-20260828_132509726.svg'
    },
    {
      key: 'charge',
      label: '今日充电总数',
      value: 18,
      unit: '次',
      tone: 'white',
      icon: '/assets/charging/139_33-20260828_132509726.svg'
    }
  ],
  cabinets: [
    { id: '01', status: 'charging', soc: 80, swap: 8, balance: 1, charge: 8 },
    { id: '02', status: 'idle', soc: null, swap: 3, balance: 0, charge: 3 },
    { id: '03', status: 'idle', soc: null, swap: 5, balance: 1, charge: 5 },
    { id: '04', status: 'idle', soc: null, swap: 2, balance: 0, charge: 2 }
  ]
}

export const bmsDetails = {
  '01': {
    cabinetId: '01',
    name: 'BMS · 磷酸铁锂电池组',
    model: '型号 LFP-48V100Ah · SN 20260828A018',
    temperature: 28.5,
    statusText: '运行正常',
    soc: 81,
    voltage: 52.6,
    current: -12.4,
    power: 652,
    params: [
      { label: '单体最高电压', value: '3.312 V', hint: '电芯 #06' },
      { label: '单体最低电压', value: '3.298 V', hint: '电芯 #11' },
      { label: '压差', value: '14 mV', hint: '均衡良好', valueTone: 'green', hintTone: 'green' },
      { label: '健康度 SOH', value: '96%', hint: '状态优秀' },
      { label: '循环次数', value: '328 次', hint: '设计 3000 次' },
      { label: '剩余容量', value: '81.0 Ah', hint: '额定 100 Ah', valueTone: 'cyan' }
    ],
    protections: [
      { label: '过压保护', status: '正常' },
      { label: '过流保护', status: '正常' },
      { label: '温度保护', status: '正常' },
      { label: '短路保护', status: '正常' }
    ],
    alarms: [
      {
        type: 'warn',
        title: '单体压差偏高预警',
        desc: '14:20 · 建议关注电芯 #06 均衡'
      },
      {
        type: 'info',
        title: '系统例行自检完成',
        desc: '13:00 · 所有模块通信正常'
      }
    ]
  }
}

export function getDefaultBmsDetail(cabinetId = '01') {
  return bmsDetails[cabinetId] || bmsDetails['01']
}
