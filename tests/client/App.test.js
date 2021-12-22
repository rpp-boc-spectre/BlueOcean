/**
 * @jest-environment jsdom
 */

import React from 'react'
import 'regenerator-runtime/runtime'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createMemoryHistory } from 'history'
import { BrowserRouter as Router } from 'react-router-dom'

import App from '../../client/src/components/app.jsx'

describe('Home Component', function () {
  test('Should load the home page on root visit', async function () {

    const history = createMemoryHistory()
    const route = '/'
    history.push(route)

    const app = render(
      <Router history={History}>
        <App />
      </Router>
    )

    expect(await app.findByText('I am rendered with React!')).toBeInTheDocument()
  })
})