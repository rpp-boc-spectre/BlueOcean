import { useContext } from 'react'

import { SnackBarContext } from '../context/SnackBarContext'

const useSnackBar = () => useContext(SnackBarContext)

export default useSnackBar