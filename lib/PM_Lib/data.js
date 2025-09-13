// Centralized data management for the dashboard
export const dashboardData = {
  currentHarvestValue: {
    value: 15200,
    estimated: 5200,
    currency: "₹",
  },

  upcomingDeliveries: {
    count: 3,
    nextDays: 7,
    value: 1500,
    currency: "₹",
  },

  totalInputCosts: {
    value: 7760,
    percentage: 5.9,
    period: "Last 10 days",
    currency: "₹",
  },

  monthlyYieldTrend: [
    { month: "Jan", rental: 8000, expenses: 6000 },
    { month: "Feb", rental: 12000, expenses: 8000 },
    { month: "Mar", rental: 9000, expenses: 7000 },
    { month: "Apr", rental: 15000, expenses: 9000 },
    { month: "May", rental: 11000, expenses: 8500 },
    { month: "Jun", rental: 18000, expenses: 12000 },
    { month: "Jul", rental: 16000, expenses: 10000 },
  ],

  fieldHealthIndex: [
    { date: "Feb 7", value: 2.5, category: "Catwalks" },
    { date: "Feb 8", value: 3.2, category: "Ivy watering" },
    { date: "Feb 9", value: 4.1, category: "Nutrient period" },
    { date: "Feb 10", value: 3.8, category: "West" },
    { date: "Feb 11", value: 4.5, category: "Moons" },
    { date: "Feb 21", value: 5.0, category: "Full unrealistic" },
  ],

  cropStatus: {
    total: 780,
    growing: 450,
    occupied: 280,
    vacant: 50,
  },

  productionCosts: [
    { date: "Feb 7", production: 25000, overhead: 15000, maintenance: 8000 },
    { date: "Feb 8", production: 30000, overhead: 18000, maintenance: 9000 },
    { date: "Feb 9", production: 28000, overhead: 16000, maintenance: 7500 },
    { date: "Feb 10", production: 35000, overhead: 20000, maintenance: 10000 },
    { date: "Feb 11", production: 32000, overhead: 19000, maintenance: 8500 },
    { date: "Feb 21", production: 40000, overhead: 22000, maintenance: 11000 },
  ],

  cropCycleTasks: [
    {
      id: 1,
      taskName: "Household Fire It Contractor",
      address: "15 Main Street - 2F",
      compliance: 12,
      status: "Approved",
      action: "view",
    },
    {
      id: 2,
      taskName: "Havver plumbing",
      address: "15 Main Street - 2F",
      compliance: 8,
      status: "In progress",
      action: "edit",
    },
    {
      id: 3,
      taskName: "House plumbing Contractor",
      address: "15 Main Street - 2F",
      compliance: 15,
      status: "Approved",
      action: "view",
    },
  ],
}

// Function to update data (for interactive functionality)
export const updateData = (section, newData) => {
  if (dashboardData[section]) {
    dashboardData[section] = { ...dashboardData[section], ...newData }
  }
}

// Function to add new monthly data
export const addMonthlyData = (month, rental, expenses) => {
  dashboardData.monthlyYieldTrend.push({ month, rental, expenses })
}

export const updateMonthlyYield = (month, rental, expenses) => {
  const existingIndex = dashboardData.monthlyYieldTrend.findIndex((item) => item.month === month)

  if (existingIndex !== -1) {
    dashboardData.monthlyYieldTrend[existingIndex] = { month, rental, expenses }
  } else {
    dashboardData.monthlyYieldTrend.push({ month, rental, expenses })
  }
}

export const updateCurrentHarvestValue = (value, estimated) => {
  dashboardData.currentHarvestValue.value = value
  dashboardData.currentHarvestValue.estimated = estimated
}

export const updateTotalInputCosts = (value, percentage) => {
  dashboardData.totalInputCosts.value = value
  dashboardData.totalInputCosts.percentage = percentage
}

export const updateCropStatus = (growing, occupied, vacant) => {
  dashboardData.cropStatus.growing = growing
  dashboardData.cropStatus.occupied = occupied
  dashboardData.cropStatus.vacant = vacant
  dashboardData.cropStatus.total = growing + occupied + vacant
}

export const addProductionCostData = (date, production, overhead, maintenance) => {
  dashboardData.productionCosts.push({ date, production, overhead, maintenance })
}

export const addCropCycleTask = (taskName, address, compliance, status) => {
  const newTask = {
    id: dashboardData.cropCycleTasks.length + 1,
    taskName,
    address,
    compliance,
    status,
    action: "view",
  }
  dashboardData.cropCycleTasks.push(newTask)
}

export const updateCropCycleTaskStatus = (taskId, newStatus) => {
  const task = dashboardData.cropCycleTasks.find((t) => t.id === taskId)
  if (task) {
    task.status = newStatus
  }
}
