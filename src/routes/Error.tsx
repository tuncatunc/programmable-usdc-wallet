import React from 'react'
import { useRouteError } from "react-router-dom"
type Props = {}

export const Error = (props: Props) => {
  const error = useRouteError();

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{JSON.stringify(error)}</i>
      </p>
    </div>
  );

}