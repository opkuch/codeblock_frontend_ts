
export const utilService = {
    debounce
}

  function debounce(func: Function, wait = 500) {
    let timeout: any
  
    return function executedFunction(...args: any) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
  
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  