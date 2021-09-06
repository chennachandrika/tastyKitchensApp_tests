import {BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {render, screen} from '@testing-library/react'

import App from '../App'

const cartRoutePath = '/cart'

const mockGetCookie = (returnToken = true) => {
  let mockedGetCookie
  if (returnToken) {
    mockedGetCookie = jest.fn(() => ({
      jwt_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwiaWF0IjoxNjE5MDk0MjQxfQ.1i6BbQkQvtvpv72lHPNbl2JOZIB03uRcPbchYYCkL9o',
    }))
  } else {
    mockedGetCookie = jest.fn(() => undefined)
  }
  jest.spyOn(Cookies, 'get')
  Cookies.get = mockedGetCookie
}

const restoreGetCookieFns = () => {
  Cookies.get.mockRestore()
}

const renderWithBrowserRouter = (ui, {route = cartRoutePath} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

describe(':::RJSCPP63AV_TEST_SUITE_2:::Cart Route tests', () => {
  it(':::RJSCPP63AV_TEST_24:::When the "/cart" is provided as the URL in the browser tab, then the page should be navigated to Cart Route and consist of an HTML image element with alt text as "empty cart":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const imageEl = screen.getByRole('img', {name: /empty cart/i, exact: false})
    expect(imageEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_25:::When the cart Route is opened then the page should contain HTML main heading element with text content as "No Order Yet!":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      screen.getByRole('heading', {
        name: /No Order yet!/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_26:::When the cart Route is opened then the page should contain HTML paragraph element with text content as "Your cart is empty. Add something from the menu.":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const paragraphEl = screen.getByText(
      /Your cart is empty. Add something from the menu./i,
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_27:::When the cart Route is opened then the page should contain HTML button element with text content as "Order now"":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      screen.getByRole('button', {
        name: /Order now/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })
})
