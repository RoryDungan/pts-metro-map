'use strict'

export const createStateMachine = rootState => {
  const stateStack = [rootState]

  const stateMachine = {
    push: state => {
      stateStack.push(state)
      if (typeof state.enter === 'function') {
        state.enter(stateMachine)
      }
    },
    pop: () => {
      const oldState = stateStack.pop()
      if (typeof oldState.exit === 'function') {
        oldState.exit(stateMachine)
      }
    },
    update: () => {
      for (let i = stateStack.length - 1; i >= 0; i--) {
        const currentState = stateStack[i]
        if (typeof currentState.update === 'function') {
          currentState.update(stateMachine)
        }
      }
    },
    action: (type, px, py, evt) => {
      const currentState = stateStack[stateStack.length - 1]
      if (typeof currentState.action === 'function') {
        currentState.action(type, px, py, evt)
      }
    }
  }
  return stateMachine
}