import {BrowserRouter} from 'react-router-dom'

import {render, screen} from '@testing-library/react'

import App from '../App'

const pageNotFoundPath = '/bad-path'

const renderWithBrowserRouter = (ui, {route = pageNotFoundPath} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

describe(':::RJSCPP63AV_TEST_SUITE_5:::Not Found Route tests', () => {
  it(':::RJSCPP63AV_TEST_80:::When the "/bad-path" is provided as the URL in the browser tab, then the page should be navigated to NotFound Route and consist of an HTML image element with alt text as "not found":::5:::', () => {
    renderWithBrowserRouter(<App />)
    const imageEl = screen.getByRole('img', {name: /not found/i, exact: false})
    expect(imageEl).toBeInTheDocument()
  })

  it(':::RJSCPP63AV_TEST_81:::When the "/bad-path" is provided as the URL in the browser tab, then the page should be navigated to NotFound Route and consist of the HTML main heading element with text content as "Page Not Found":::5:::', () => {
    renderWithBrowserRouter(<App />)
    expect(
      screen.getByRole('heading', {
        name: /Page Not Found/i,
        exact: false,
      }),
    ).toBeInTheDocument()
  })

  it(':::RJSCPP63AV_TEST_82:::When the "/bad-path" is provided as the URL in the browser tab, then the page should be navigated to NotFound Route and consist of the HTML paragraph element with text content as "we’re sorry, the page you requested could not be found":::5:::', () => {
    renderWithBrowserRouter(<App />)
    const paragraphEl = screen.getByText(
      /we’re sorry, the page you requested could not be found/i,
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    expect(window.location.pathname).toBe(pageNotFoundPath)
  })
})
