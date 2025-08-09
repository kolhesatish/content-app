'use client'

import { useState, useEffect } from 'react'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 3000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

let memoryState = { toasts: [] }

let listeners = []

function dispatch(action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

   case 'DISMISS_TOAST': {
  const { toastId } = action;

  return {
    ...state,
    toasts: state.toasts.map((t) =>
      t.id === toastId ? { ...t, open: false } : t
    ),
  };
}

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

function toast({duration = 3000, ...props }) {
  const id = genId()

  const update = (props) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })
 setTimeout(() => {
  // This triggers the "close" (open: false)
  dispatch({ type: 'DISMISS_TOAST', toastId: id })

  // Then remove after the toast animation finishes
  setTimeout(() => {
    dispatch({ type: 'REMOVE_TOAST', toastId: id })
  }, TOAST_REMOVE_DELAY)
}, duration)

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = useState(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

export { useToast, toast }