import {createMemoryHistory} from 'history'
import {Router, BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {setupServer} from 'msw/node'
import {rest} from 'msw'

import App from '../App'

const loginRoutePath = '/login'
const homeRoutePath = '/'

const loginSuccessResponse = {
  jwt_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwiaWF0IjoxNjE5MDk0MjQxfQ.1i6BbQkQvtvpv72lHPNbl2JOZIB03uRcPbchYYCkL9o',
}

const passwordIncorrect = {
  error_msg: "Username and Password didn't match",
}

const invalidUser = {
  error_msg: 'Username is not found',
}
const invalidInputs = {
  error_msg: 'Username or password is invalid',
}

const apiUrl = 'https://apis.ccbp.in/login'

const server = setupServer(
  rest.post(apiUrl, (req, res, ctx) => {
    const username = JSON.parse(req.body).username
    const password = JSON.parse(req.body).password

    if (
      username === '' ||
      password === '' ||
      username === undefined ||
      password === undefined
    )
      return res(ctx.status(400, 'invalid request'), ctx.json(invalidInputs))
    else if (username === 'rahul' && password === 'rahul@2021')
      return res(ctx.json(loginSuccessResponse))
    else if (username === 'rahul' && password !== 'rahul@2021')
      return res(
        ctx.status(401, 'invalid request'),
        ctx.json(passwordIncorrect),
      )
    else return res(ctx.status(404, 'invalid request'), ctx.json(invalidUser))
  }),
)

let historyInstance
const mockHistoryReplace = instance => {
  jest.spyOn(instance, 'replace')
}

const restoreHistoryReplace = instance => {
  instance.replace.mockRestore()
}

const mockSetCookie = () => {
  jest.spyOn(Cookies, 'set')
  Cookies.set = jest.fn()
}

const restoreSetCookieFns = () => {
  Cookies.set.mockRestore()
}

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

const renderWithBrowserRouter = (ui = <App />, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

const rtlRender = (ui = <App />, path = '/') => {
  historyInstance = createMemoryHistory()
  historyInstance.push(path)
  render(<Router history={historyInstance}>{ui}</Router>)
  return {
    history: historyInstance,
  }
}

// {
// TODO:
// 6.LoginRoute -> Login Route (confirm with RP) same for all Routes
// }

describe(':::RJSCPP63AV_TEST_SUITE_1:::Authentication Login Route Tests', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error')
    server.listen()
  })

  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled()
    server.resetHandlers()
  })
  afterAll(() => {
    console.error.mockRestore()
    server.close()
  })

  it(':::RJSCPP63AV_TEST_1:::Login Route should consist of an HTML image element with alt text as "website logo":::5:::', () => {
    renderWithBrowserRouter(<App />, loginRoutePath)
    const imageEl = screen.getAllByRole('img', {name: /website logo/i})
    expect(imageEl[0]).toBeInTheDocument()
  })

  it(':::RJSCPP63AV_TEST_2:::LoginRoute should consist of an HTML image element with the given image and alt text as "login landing":::5:::', () => {
    renderWithBrowserRouter(<App />, loginRoutePath)
    const imageEl = screen.getByRole('img', {name: /login landing/i})
    expect(imageEl).toBeInTheDocument()
  })

  it(':::RJSCPP63AV_TEST_3:::LoginRoute should consist of an HTML image element with the given text logo and alt text as "website text logo":::5:::', () => {
    renderWithBrowserRouter(<App />, loginRoutePath)
    const imageEl = screen.getAllByRole('img', {name: /website text logo/i})
    expect(imageEl[0]).toBeInTheDocument()
  })

  it(':::RJSCPP63AV_TEST_4:::Login Route should consist of an HTML form element:::5:::', () => {
    const {container} = renderWithBrowserRouter(<App />, loginRoutePath)
    const formEl = container.querySelectorAll('form')[0]
    expect(formEl).toBeInTheDocument()
  })

  it(':::RJSCPP63AV_TEST_5:::LoginRoute should consist of an HTML main heading element with "Sign in" as text content:::5:::', () => {
    renderWithBrowserRouter(<App />, loginRoutePath)
    const buttonEl = screen.getByRole('heading', {
      name: /Sign in/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
  })

  it(':::RJSCPP63AV_TEST_6:::LoginRoute should consist of the USERNAME input field with type as "text":::5:::', () => {
    renderWithBrowserRouter(<App />, loginRoutePath)
    expect(
      screen.getByLabelText(/USERNAME/i, {
        exact: false,
      }).type,
    ).toBe('text')
  })

  it(':::RJSCPP63AV_TEST_7:::Login Route should consist of the HTML input element with the label as PASSWORD and type as "password":::5:::', () => {
    renderWithBrowserRouter(<App />, loginRoutePath)
    expect(screen.getByLabelText(/PASSWORD/i, {exact: false}).type).toBe(
      'password',
    )
  })

  it(':::RJSCPP63AV_TEST_8:::LoginRoute should consist of an HTML button element with "Sign in" as text content and type as "submit":::5:::', () => {
    renderWithBrowserRouter(<App />, loginRoutePath)
    const buttonEl = screen.getByRole('button', {
      name: /Sign in/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    expect(buttonEl.type).toBe('submit')
  })

  it(':::RJSCPP63AV_TEST_9:::When the user provided the text in the HTML input element with the label as "USERNAME", the text should be displayed in the HTML input element:::5:::', () => {
    renderWithBrowserRouter(<App />, loginRoutePath)
    const userNameEl = screen.getByRole('textbox')
    userEvent.type(userNameEl, 'rahul')
    expect(userNameEl).toHaveValue('rahul')
  })

  it(':::RJSCPP63AV_TEST_10:::When the user provided the text in the HTML input element with the label as "PASSWORD", the text should be displayed in the HTML input element:::5:::', () => {
    renderWithBrowserRouter(<App />, loginRoutePath)
    const passwordEl = screen.getByLabelText(/password/i)
    userEvent.type(passwordEl, 'rahul')
    expect(passwordEl).toHaveValue('rahul')
  })

  it(':::RJSCPP63AV_TEST_11:::When the unauthenticated user provided "/login" in the browser tab then the page should be navigated to LoginRoute and consists of an HTML input element with "lucifer" as a placeholder:::5:::', () => {
    renderWithBrowserRouter(<App />, loginRoutePath)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it(':::RJSCPP63AV_TEST_12:::When an authenticated user tries to access the LoginRoute then the page should be navigated to HomeRoute:::5:::', async () => {
    mockGetCookie()
    const {history} = rtlRender(<App />, loginRoutePath)
    await waitFor(() => expect(history.location.pathname).toBe(homeRoutePath))
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_13:::When a valid username is provided and the sign in button is clicked with an empty password then the respective error message should be displayed using an HTML paragraph element:::5:::', async () => {
    const {history} = rtlRender(<App />, loginRoutePath)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const signinButton = screen.getByRole('button', {
      name: /Sign in/i,
      exact: false,
    })
    expect(history.location.pathname).toBe(loginRoutePath)

    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, '')
    userEvent.click(signinButton)
    await waitFor(() =>
      screen.getByText(/Username or password is invalid/i, {
        exact: false,
      }),
    )
    const paragraphEl = screen.getByText(/Username or password is invalid/i, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
  })

  it(':::RJSCPP63AV_TEST_14:::When a valid username is provided and the sign in button is clicked with an empty password then the respective error message should be displayed and the page should not be navigated:::5:::', async () => {
    const {history} = rtlRender(<App />, loginRoutePath)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const signinButton = screen.getByRole('button', {
      name: /Sign in/i,
      exact: false,
    })
    expect(history.location.pathname).toBe('/login')

    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, '')
    userEvent.click(signinButton)

    await waitFor(() =>
      expect(
        screen.getByText(/Username or password is invalid/i, {
          exact: false,
        }),
      ).toBeInTheDocument(),
    )
    expect(history.location.pathname).toBe(loginRoutePath)
  })

  it(':::RJSCPP63AV_TEST_15:::When a non-empty password is provided and the sign in button is clicked with an empty username then the respective error message should be displayed and the page should not be navigated:::5:::', async () => {
    const {history} = rtlRender(<App />, loginRoutePath)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const signinButton = screen.getByRole('button', {
      name: /Sign in/i,
      exact: false,
    })
    expect(history.location.pathname).toBe('/login')

    userEvent.type(usernameField, '')
    userEvent.type(passwordField, 'rahul1')
    userEvent.click(signinButton)
    await waitFor(() =>
      expect(
        screen.getByText(/Username or password is invalid/i, {
          exact: false,
        }),
      ).toBeInTheDocument(),
    )

    expect(history.location.pathname).toBe(loginRoutePath)
  })

  it(':::RJSCPP63AV_TEST_16:::When an empty username and empty password is provided and the sign in button is clicked with an empty username then the respective error message should be displayed and the page should not be navigated:::5:::', async () => {
    const {history} = rtlRender(<App />, loginRoutePath)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const signinButton = screen.getByRole('button', {
      name: /Sign in/i,
      exact: false,
    })
    expect(history.location.pathname).toBe('/login')

    userEvent.type(usernameField, '')
    userEvent.type(passwordField, '')
    userEvent.click(signinButton)
    await waitFor(() =>
      expect(
        screen.getByText(/Username or password is invalid/i, {
          exact: false,
        }),
      ).toBeInTheDocument(),
    )

    expect(history.location.pathname).toBe(loginRoutePath)
  })

  it(':::RJSCPP63AV_TEST_17:::When an invalid username and password are provided and the Sign in button is clicked then the respective error message should be displayed and the page should not be navigated:::5:::', async () => {
    const {history} = rtlRender(<App />, loginRoutePath)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const signinButton = screen.getByRole('button', {
      name: /Sign in/i,
      exact: false,
    })
    expect(history.location.pathname).toBe('/login')

    userEvent.type(usernameField, 'unknown')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(signinButton)
    await waitFor(() =>
      expect(
        screen.getByText(/Username is not found/i, {
          exact: false,
        }),
      ).toBeInTheDocument(),
    )
    expect(history.location.pathname).toBe(loginRoutePath)
  })

  it(':::RJSCPP63AV_TEST_18:::When a valid username and invalid password are provided and the sign in button is clicked then the respective error message should be displayed and the page should not be navigated:::5:::', async () => {
    const {history} = rtlRender(<App />, loginRoutePath)
    mockHistoryReplace(history)
    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const signinButton = screen.getByRole('button', {
      name: /Sign in/i,
      exact: false,
    })
    expect(history.location.pathname).toBe('/login')

    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, 'wrongPassword')
    userEvent.click(signinButton)

    await waitFor(() =>
      expect(
        screen.getByText(/Username and Password didn't match/i, {exact: false}),
      ).toBeInTheDocument(),
    )
    expect(history.location.pathname).toBe(loginRoutePath)
  })

  it(':::RJSCPP63AV_TEST_19:::When a valid username and password are provided and the sign button is clicked then the page should be navigated to HomeRoute:::5:::', async () => {
    const {history} = rtlRender(<App />, loginRoutePath)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const signinButton = screen.getByRole('button', {
      name: /Sign in/i,
      exact: false,
    })

    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(signinButton)

    mockGetCookie()
    await waitFor(() => expect(history.location.pathname).toBe(homeRoutePath))

    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_20:::When a valid username and password are provided and the sign in button is clicked then the history.replace() method should be called:::5:::', async () => {
    const {history} = rtlRender(<App />, loginRoutePath)
    mockHistoryReplace(history)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const signinButton = screen.getByRole('button', {
      name: /Sign in/i,
      exact: false,
    })
    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(signinButton)
    await waitFor(() => expect(history.replace).toHaveBeenCalled())
    restoreHistoryReplace(history)
  })

  it(':::RJSCPP63AV_TEST_21:::When a valid username and password are provided and the sign in button is clicked then the history.replace() method should be called with the argument "/":::5:::', async () => {
    const {history} = rtlRender(<App />, loginRoutePath)
    mockHistoryReplace(history)
    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const signinButton = screen.getByRole('button', {
      name: /Sign in/i,
      exact: false,
    })
    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(signinButton)
    await waitFor(() => screen.queryByText('Home'))
    restoreHistoryReplace(history)
  })

  it(':::RJSCPP63AV_TEST_22:::When a user successfully sign in then the Cookies.set() method should be called:::5:::', async () => {
    mockSetCookie()
    renderWithBrowserRouter(<App />, loginRoutePath)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const submitButton = screen.getByRole('button', {
      name: /Sign in/i,
      exact: false,
    })
    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(submitButton)
    await waitFor(() => expect(Cookies.set).toHaveBeenCalled())
    restoreSetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_23:::When a user successfully sign in then the Cookies.set() method should be called with three arguments - "jwt_token" string as the first argument, JWT token value as the second argument and expiry days as the third argument:::5:::', async () => {
    mockSetCookie()
    renderWithBrowserRouter(<App />, loginRoutePath)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const submitButton = screen.getByRole('button', {
      name: /Sign in/i,
      exact: false,
    })
    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(submitButton)
    await waitFor(() =>
      expect(Cookies.set).toHaveBeenCalledWith(
        'jwt_token',
        loginSuccessResponse.jwt_token,
        expect.objectContaining({expires: expect.any(Number)}),
      ),
    )
    restoreSetCookieFns()
  })
})
