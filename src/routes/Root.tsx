import React from 'react'
import { Outlet } from "react-router-dom"
import { Nav } from "../common/Nav"

type Props = {}

export const Root = (props: Props) => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  )
}