import React, { ReactElement } from "react"
import type { RootState } from "../../app/store"
import { useSelector, useDispatch } from "react-redux"
import { increment, decrement } from "./counterSlice"

export const Counter: React.FC = (): ReactElement => {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div className="h-full w-32">
      <button className="btn btn-blue"
        onClick={() => dispatch(increment())}
      >
        Increment
      </button>
    </div>
  )
}