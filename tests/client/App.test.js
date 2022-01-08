/**
 * @jest-environment jsdom
 */

import React from 'react'
import 'regenerator-runtime/runtime'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

import App from '../../client/src/components/app.jsx'

describe('Home Component', function () {

  test.todo('Write some tests later because we have no time')
  // test('Should load the home page on root visit', async function () {

  //   const history = createMemoryHistory()
  //   const route = '/'
  //   history.push(route)

  //   const app = render(
  //     <Router location={history.location} navigator={history}>
  //       <App />
  //     </Router>
  //   )

  //   expect(await app.findByText('I am rendered with React and Material-UI!')).toBeInTheDocument()
  // })

  // test('Should show error when visiting bad page', function () {
  //   const history = createMemoryHistory()
  //   const route = '/about'
  //   history.push(route)

  //   const app = render(
  //     <Router location={history.location} navigator={history}>
  //       <App />
  //     </Router>
  //   )

  //   expect(app.getByText('Not Found 404')).toBeInTheDocument()
  // })
})