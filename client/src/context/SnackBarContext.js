import React, { createContext, useEffect, useState } from "react"
import {SnackBar, Alert} from '@mui/material'

export const SnackBarContext = createContext()

const AUTO_DISMISS = 5000

export function SnackBarProvider({ children }) {
  const [alerts, setAlerts] = useState(['Alert'])

  const activeAlertIds = alerts.join(',')
  useEffect(() => {
    if (activeAlertIds.length > 0) {
      const timer = setTimeout(() => setAlerts((alerts) => alerts.slice(0, alerts.length - 1)), AUTO_DISMISS)
      return () => clearTimeout(timer)
    }
  }, [activeAlertIds])

  const addAlert = (alert) => setAlerts((alerts) => [alert, ...alerts])

  const value = { addAlert }

  return (
    <SnackBarContext.Provider value={value}>
      {children}
      {alerts.map((alert) => <SnackBar key={alert}>{alert}</SnackBar>)}
    </SnackBarContext.Provider>
  )
}