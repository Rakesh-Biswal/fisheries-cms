"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  updateMonthlyYield,
  updateCurrentHarvestValue,
  updateTotalInputCosts,
  updateCropStatus,
  addProductionCostData,
  addCropCycleTask,
} from "@/lib/PM_Lib/data";
import { Settings } from "lucide-react"

export default function DataManagementPanel({ onDataUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("harvest")

  const [harvestData, setHarvestData] = useState({
    value: "",
    estimated: "",
  })

  const [yieldData, setYieldData] = useState({
    month: "",
    rental: "",
    expenses: "",
  })

  const [inputCostData, setInputCostData] = useState({
    value: "",
    percentage: "",
  })

  const [cropStatusData, setCropStatusData] = useState({
    growing: "",
    occupied: "",
    vacant: "",
  })

  const [productionData, setProductionData] = useState({
    date: "",
    production: "",
    overhead: "",
    maintenance: "",
  })

  const [taskData, setTaskData] = useState({
    taskName: "",
    address: "",
    compliance: "",
    status: "Pending",
  })

  const handleUpdateHarvest = () => {
    if (harvestData.value && harvestData.estimated) {
      updateCurrentHarvestValue(Number.parseInt(harvestData.value), Number.parseInt(harvestData.estimated))
      onDataUpdate?.()
      setHarvestData({ value: "", estimated: "" })
    }
  }

  const handleUpdateYield = () => {
    if (yieldData.month && yieldData.rental && yieldData.expenses) {
      updateMonthlyYield(yieldData.month, Number.parseInt(yieldData.rental), Number.parseInt(yieldData.expenses))
      onDataUpdate?.()
      setYieldData({ month: "", rental: "", expenses: "" })
    }
  }

  const handleUpdateInputCosts = () => {
    if (inputCostData.value && inputCostData.percentage) {
      updateTotalInputCosts(Number.parseInt(inputCostData.value), Number.parseFloat(inputCostData.percentage))
      onDataUpdate?.()
      setInputCostData({ value: "", percentage: "" })
    }
  }

  const handleUpdateCropStatus = () => {
    if (cropStatusData.growing && cropStatusData.occupied && cropStatusData.vacant) {
      updateCropStatus(
        Number.parseInt(cropStatusData.growing),
        Number.parseInt(cropStatusData.occupied),
        Number.parseInt(cropStatusData.vacant),
      )
      onDataUpdate?.()
      setCropStatusData({ growing: "", occupied: "", vacant: "" })
    }
  }

  const handleAddProductionData = () => {
    if (productionData.date && productionData.production && productionData.overhead && productionData.maintenance) {
      addProductionCostData(
        productionData.date,
        Number.parseInt(productionData.production),
        Number.parseInt(productionData.overhead),
        Number.parseInt(productionData.maintenance),
      )
      onDataUpdate?.()
      setProductionData({ date: "", production: "", overhead: "", maintenance: "" })
    }
  }

  const handleAddTask = () => {
    if (taskData.taskName && taskData.address && taskData.compliance) {
      addCropCycleTask(taskData.taskName, taskData.address, Number.parseInt(taskData.compliance), taskData.status)
      onDataUpdate?.()
      setTaskData({ taskName: "", address: "", compliance: "", status: "Pending" })
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 lg:p-4 shadow-lg"
      >
        <Settings className="w-5 h-5 lg:w-6 lg:h-6" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 lg:p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg lg:text-xl">Data Management Panel</CardTitle>
            <Button variant="outline" onClick={() => setIsOpen(false)} size="sm">
              Close
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 lg:gap-2 mt-4">
            {[
              { id: "harvest", label: "Harvest" },
              { id: "yield", label: "Yield" },
              { id: "costs", label: "Costs" },
              { id: "status", label: "Status" },
              { id: "production", label: "Production" },
              { id: "tasks", label: "Tasks" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="text-xs lg:text-sm"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {activeTab === "harvest" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Update Harvest Value</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label>Current Value (₹)</Label>
                  <Input
                    type="number"
                    value={harvestData.value}
                    onChange={(e) => setHarvestData({ ...harvestData, value: e.target.value })}
                    placeholder="15200"
                  />
                </div>
                <div>
                  <Label>Estimated This Month (₹)</Label>
                  <Input
                    type="number"
                    value={harvestData.estimated}
                    onChange={(e) => setHarvestData({ ...harvestData, estimated: e.target.value })}
                    placeholder="5200"
                  />
                </div>
              </div>
              <Button onClick={handleUpdateHarvest} className="w-full lg:w-auto">
                Update Harvest Data
              </Button>
            </div>
          )}

          {activeTab === "yield" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Add Monthly Yield Data</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Month</Label>
                  <Input
                    value={yieldData.month}
                    onChange={(e) => setYieldData({ ...yieldData, month: e.target.value })}
                    placeholder="Aug"
                  />
                </div>
                <div>
                  <Label>Rental Income (₹)</Label>
                  <Input
                    type="number"
                    value={yieldData.rental}
                    onChange={(e) => setYieldData({ ...yieldData, rental: e.target.value })}
                    placeholder="20000"
                  />
                </div>
                <div>
                  <Label>Expenses (₹)</Label>
                  <Input
                    type="number"
                    value={yieldData.expenses}
                    onChange={(e) => setYieldData({ ...yieldData, expenses: e.target.value })}
                    placeholder="12000"
                  />
                </div>
              </div>
              <Button onClick={handleUpdateYield} className="w-full lg:w-auto">
                Add Yield Data
              </Button>
            </div>
          )}

          {activeTab === "costs" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Update Input Costs</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label>Total Value (₹)</Label>
                  <Input
                    type="number"
                    value={inputCostData.value}
                    onChange={(e) => setInputCostData({ ...inputCostData, value: e.target.value })}
                    placeholder="7760"
                  />
                </div>
                <div>
                  <Label>Percentage Change (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={inputCostData.percentage}
                    onChange={(e) => setInputCostData({ ...inputCostData, percentage: e.target.value })}
                    placeholder="5.9"
                  />
                </div>
              </div>
              <Button onClick={handleUpdateInputCosts} className="w-full lg:w-auto">
                Update Input Costs
              </Button>
            </div>
          )}

          {activeTab === "status" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Update Crop Status</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Growing Units</Label>
                  <Input
                    type="number"
                    value={cropStatusData.growing}
                    onChange={(e) => setCropStatusData({ ...cropStatusData, growing: e.target.value })}
                    placeholder="450"
                  />
                </div>
                <div>
                  <Label>Occupied Units</Label>
                  <Input
                    type="number"
                    value={cropStatusData.occupied}
                    onChange={(e) => setCropStatusData({ ...cropStatusData, occupied: e.target.value })}
                    placeholder="280"
                  />
                </div>
                <div>
                  <Label>Vacant Units</Label>
                  <Input
                    type="number"
                    value={cropStatusData.vacant}
                    onChange={(e) => setCropStatusData({ ...cropStatusData, vacant: e.target.value })}
                    placeholder="50"
                  />
                </div>
              </div>
              <Button onClick={handleUpdateCropStatus} className="w-full lg:w-auto">
                Update Crop Status
              </Button>
            </div>
          )}

          {activeTab === "production" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Add Production Cost Data</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    value={productionData.date}
                    onChange={(e) => setProductionData({ ...productionData, date: e.target.value })}
                    placeholder="Feb 22"
                  />
                </div>
                <div>
                  <Label>Production Cost (₹)</Label>
                  <Input
                    type="number"
                    value={productionData.production}
                    onChange={(e) => setProductionData({ ...productionData, production: e.target.value })}
                    placeholder="45000"
                  />
                </div>
                <div>
                  <Label>Overhead Cost (₹)</Label>
                  <Input
                    type="number"
                    value={productionData.overhead}
                    onChange={(e) => setProductionData({ ...productionData, overhead: e.target.value })}
                    placeholder="25000"
                  />
                </div>
                <div>
                  <Label>Maintenance Cost (₹)</Label>
                  <Input
                    type="number"
                    value={productionData.maintenance}
                    onChange={(e) => setProductionData({ ...productionData, maintenance: e.target.value })}
                    placeholder="12000"
                  />
                </div>
              </div>
              <Button onClick={handleAddProductionData} className="w-full lg:w-auto">
                Add Production Data
              </Button>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Add New Task</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label>Task Name</Label>
                  <Input
                    value={taskData.taskName}
                    onChange={(e) => setTaskData({ ...taskData, taskName: e.target.value })}
                    placeholder="Equipment Maintenance"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={taskData.address}
                    onChange={(e) => setTaskData({ ...taskData, address: e.target.value })}
                    placeholder="15 Main Street - 2F"
                  />
                </div>
                <div>
                  <Label>Compliance Score</Label>
                  <Input
                    type="number"
                    value={taskData.compliance}
                    onChange={(e) => setTaskData({ ...taskData, compliance: e.target.value })}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    value={taskData.status}
                    onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In progress">In progress</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleAddTask} className="w-full lg:w-auto">
                Add Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
