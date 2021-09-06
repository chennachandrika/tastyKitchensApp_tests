import {createMemoryHistory} from 'history'
import {Router, BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {setupServer} from 'msw/node'
import {rest} from 'msw'

import {within} from '@testing-library/dom'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

const homeRoutePath = '/'

const restaurantDetailsPath = '/restaurant/2200043'

const cartRoutePath = '/cart'

const restaurantDetailsAPIURL = 'https://apis.ccbp.in/restaurants-list/:id'

const restaurantDetailsBaseURL = 'https://apis.ccbp.in/restaurants-list/'

const offersAPIURL = 'https://apis.ccbp.in/restaurants-list/offers'

const restaurantsAPIURL = 'https://apis.ccbp.in/restaurants-list'

const offersListResponse = {
  offers: [
    {
      image_url:
        'https://assets.ccbp.in/frontend/react-js/restaurants-app-project/carousel-images-jammu-special.jpg',
      id: 1,
    },
    {
      image_url:
        'https://assets.ccbp.in/frontend/react-js/restaurants-app-project/carousel-images-rajasthani-special.jpg',
      id: 2,
    },
    {
      image_url:
        'https://assets.ccbp.in/frontend/react-js/restaurants-app-project/carousel-images-uttar-pradesh-special.jpg',
      id: 3,
    },
  ],
}

const pageOneRestaurantsListInitialResponse = {
  restaurants: [
    {
      has_online_delivery: true,
      user_rating: {
        rating_text: 'Average',
        rating_color: 'CDD614',
        total_reviews: 345,
        rating: 3.4,
      },
      id: '2200043',
      name: 'Village Traditional Foods',
      has_table_booking: 0,
      is_delivering_now: 0,
      cost_for_two: 700,
      cuisine: 'North Indian, Chinese',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/restaurants/village-traditional-foods-2200043.jpg',
      menu_type: 'VEG',
      location:
        '1-8-303, Sindhi Colony Rd, Sindhi Colony, Begumpet, Hyderabad, Telangana 500003',
      opens_at: '10:00 AM, Tomorrow',
      group_by_time: true,
    },
    {
      has_online_delivery: true,
      user_rating: {
        rating_text: 'Good',
        rating_color: '9ACD32',
        total_reviews: 461,
        rating: 3.5,
      },
      name: 'BHotel Akbar',
      has_table_booking: 0,
      is_delivering_now: 0,
      cost_for_two: 500,
      cuisine: 'North Indian, Chinese',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/restaurants/b-hotel-akbar-2200044.jpg',
      id: '2200044',
      menu_type: 'VEG',
      location:
        'Metro Pillar Number KUK39, 1-10-74, 1st Floor, Above Balaji Family Dhaba Hotel',
      opens_at: '09:00 AM, Tomorrow',
      group_by_time: true,
    },
  ],
  total: 30,
}

const restaurantDetailsResponse = {
  rating: 3.4,
  id: '2200043',
  name: 'Village Traditional Foods',
  cost_for_two: 700,
  cuisine: 'North Indian, Chinese',
  image_url:
    'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/restaurants/village-traditional-foods-2200043.jpg',
  reviews_count: 345,
  opens_at: '10:00 AM, Tomorrow',
  location:
    '1-8-303, Sindhi Colony Rd, Sindhi Colony, Begumpet, Hyderabad, Telangana 500003',
  items_count: 15,
  food_items: [
    {
      name: 'Chicken Salad',
      cost: 345,
      food_type: 'NON-VEG',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/food-items-2/chicken-salad-16.jpg',
      id: 'c172e4b2-9288-4a6f-b77b-510eef8e945d',
      rating: 4,
    },
    {
      name: 'Onion Salad',
      cost: 315,
      food_type: 'VEG',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/food-items-2/onion-salad-17.jpg',
      id: '02d8f007-af50-4da5-b22d-9072cd026b69',
      rating: 4.2,
    },
    {
      name: 'Okra Salad',
      cost: 375,
      food_type: 'VEG',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/food-items-2/okra-salad-18.jpg',
      id: '6668718b-6f1c-49d1-854e-f92c6802484e',
      rating: 3.8,
    },
    {
      name: 'Mutton Salad',
      cost: 335,
      food_type: 'NON-VEG',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/food-items-2/mutton-salad-19.cms',
      id: 'e6005897-c520-457a-be5a-11a77f8d0cba',
      rating: 4.2,
    },
  ],
}

const server = setupServer(
  rest.get(offersAPIURL, (req, res, ctx) => res(ctx.json(offersListResponse))),
  rest.get(restaurantsAPIURL, (req, res, ctx) => {
    const query = req.url.searchParams
    const offset = query.get('offset')
    const sortByRating = query.get('sort_by_rating')
    if (offset === '0' && (sortByRating === undefined || sortByRating === '')) {
      return res(ctx.json(pageOneRestaurantsListInitialResponse))
    } else if (offset === '0' && sortByRating === 'Highest') {
      return res(ctx.json(pageOneRestaurantsListSortByHighestResponse))
    } else if (offset === '0' && sortByRating === 'Lowest') {
      return res(ctx.json(pageOneRestaurantsListSortByLowestResponse))
    } else return res(ctx.json(pageTwoRestaurantsListSortByHighestResponse))
  }),
  rest.get(restaurantDetailsAPIURL, (req, res, ctx) =>
    res(ctx.json(restaurantDetailsResponse)),
  ),
)

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

const renderWithBrowserRouter = (
  ui = <App />,
  {route = restaurantDetailsPath} = {},
) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

const rtlRender = (ui = <App />, path = restaurantDetailsPath) => {
  const history = createMemoryHistory()
  history.push(path)
  render(<Router history={history}>{ui}</Router>)
  return {
    history,
  }
}

const mockLocalStorage = (function () {
  let store = {}

  return {
    getItem: function (key) {
      return store[key] || null
    },
    setItem: function (key, value) {
      store[key] = value.toString()
    },
    removeItem: function (key) {
      delete store[key]
    },
    clear: function () {
      store = {}
    },
  }
})()

const restoreLocalStorage = () => {
  localStorage.clear()
}

const originalConsoleError = console.error
const originalFetch = window.fetch

// {
// TODO:
// 8. Tests for failure
// }

describe(':::RJSCPP63AV_TEST_SUITE_4:::Restaurant Details Route tests', () => {
  beforeAll(() => {
    server.listen()
  })

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    })
  })

  afterEach(() => {
    server.resetHandlers()
    restoreLocalStorage()
    window.fetch = originalFetch
  })

  afterAll(() => {
    server.close()
  })

  it(':::RJSCPP63AV_TEST_55:::When HTTP GET request should be made to restaurantDetailsAPI is successful, the page should consist of at least two HTML list items, and the food items list should be rendered using a unique key as a prop for each food item :::5:::', async () => {
    mockGetCookie()
    console.error = message => {
      if (
        /Each child in a list should have a unique "key" prop/.test(message) ||
        /Encountered two children with the same key/.test(message)
      ) {
        throw new Error(message)
      }
    }
    rtlRender(<App />, restaurantDetailsPath)
    restoreGetCookieFns()

    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    console.error = originalConsoleError
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_56:::When the Restaurant Details Route is accessed, then the HTML container element with testid attribute value as "loader" should not be visible to the user:::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, restaurantDetailsPath)
    await screen.queryByTestId('loader')

    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    await expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_57:::Restaurant Details Route should consist of an HTML unordered list element to display the list of items in the Header:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('list').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('list')[0].tagName).toBe('UL')
  })

  it(':::RJSCPP63AV_TEST_58:::When the HTTP GET request in the Restaurant Details route is successful, an HTML image element with alt as "restaurant" and src equal to the value of the key "image_url" should be displayed:::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, restaurantDetailsPath)

    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', {name: /^restaurant/i, exact: false}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', {name: /^restaurant/i, exact: false}).src,
    ).toBe(restaurantDetailsResponse.image_url)
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_59:::When the HTTP GET request in the Restaurant Details route is successful, an HTML main heading element with text content as the value of the key "name" should be displayed:::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, restaurantDetailsPath)
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_60:::When the HTTP GET request in the Restaurant Details route is successful, an HTML paragraph element with text content as the value of the key "cuisine" should be displayed:::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, restaurantDetailsPath)
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const paragraphEl = screen.getByText(restaurantDetailsResponse.cuisine, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_61:::When the HTTP GET request in the Restaurant Details route is successful, an HTML paragraph element with text content as the value of the key "rating" should be displayed:::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, restaurantDetailsPath)
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const ratingParagraphEl = screen.getAllByText(
      restaurantDetailsResponse.rating,
      {exact: false},
    )[0]
    expect(ratingParagraphEl).toBeInTheDocument()
    expect(ratingParagraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_62:::When the HTTP GET request in the Restaurant Details route is successful, an HTML paragraph element with text content as the value of the key "cost_for_two" should be displayed:::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, restaurantDetailsPath)
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const costForTwoParagraphEl = screen.getByText(
      restaurantDetailsResponse.cost_for_two,
      {exact: false},
    )
    expect(costForTwoParagraphEl).toBeInTheDocument()
    expect(costForTwoParagraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_63:::The Restaurant Details Page should contain all the food item images with alt text "food-item" :::5:::', async () => {
    mockGetCookie()
    console.error = message => {
      if (
        /Each child in a list should have a unique "key" prop/.test(message) ||
        /Encountered two children with the same key/.test(message)
      ) {
        throw new Error(message)
      }
    }
    rtlRender(<App />, restaurantDetailsPath)
    restoreGetCookieFns()

    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const foodItemsLength = restaurantDetailsResponse.food_items.length
    const foodItems = screen.getAllByAltText(/food-item/i, {exact: false})
    expect(foodItems.length).toBe(foodItemsLength)

    console.error = originalConsoleError
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_64:::The Empty Cart view should be displayed when the user did not add any food items to the cart:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    const listEl = screen.getAllByRole('listitem')
    expect(listEl[1].textContent).toMatch(/Cart/i)
    userEvent.click(listEl[1])
    expect(
      await screen.findByRole('heading', {
        name: /No Order Yet!/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_65:::When the Restaurant Details Route is accessed, an HTTP GET request should be made to restaurants details API with the given restaurants details API URL:::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(() => ({
      ok: true,
      json: () => Promise.resolve(restaurantDetailsResponse),
    }))
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(mockFetchFunction.mock.calls[0][0]).toMatch(restaurantDetailsBaseURL)
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_66:::When the home link in the Header is clicked, then the page should be navigated to the home route:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const homeLink = screen.getAllByRole('link', {
      name: /home/i,
      exact: false,
    })
    userEvent.click(homeLink[0])
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe(homeRoutePath)
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_67:::When the logo in the Header is clicked, then the page should be navigated to the home route:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const imageEls = screen.getAllByRole('img', {
      name: /website logo/i,
      exact: false,
    })
    userEvent.click(imageEls[0])
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe(homeRoutePath)
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_68:::When the cart link in the Header is clicked, then the page should be navigated to cart route:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()
    const cartLink = screen.getAllByRole('link', {
      name: /cart/i,
      exact: false,
    })
    userEvent.click(cartLink[0])

    expect(
      await screen.queryByRole('heading', {
        name: /No Order Yet!/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    expect(window.location.pathname).toBe(cartRoutePath)
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_69:::When the HTTP GET request in the Restaurant Details route is successful, an HTML paragraph element with text content as "Cost for two":::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, restaurantDetailsPath)
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const paragraphEl = screen.getByText(/Cost for two/i, {exact: false})
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_70:::When the HTTP GET request in the Restaurant Details route is successful, the page should contain all the food item images in that restaurant with alt text as "food-item":::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, restaurantDetailsPath)
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const foodItems = screen.getAllByRole('img', {
      name: /food-item/i,
      exact: false,
    })

    const {food_items} = restaurantDetailsResponse

    expect(foodItems.length).toBe(food_items.length)

    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_71:::The Cart should be empty by default when the user did not add food items to it:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: restaurantDetailsPath})

    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const listEl = screen.getAllByRole('listitem')
    expect(listEl[1].textContent).toMatch(/Cart/i)
    userEvent.click(listEl[1])

    expect(
      await screen.queryByRole('heading', {
        name: /No Order Yet!/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_72:::When the HTTP GET request in the Restaurant Details route is successful, When the HTML button element with text Add is clicked in any Food item then Item should be added to cart:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: restaurantDetailsPath})

    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const foodItems = screen.getAllByTestId('foodItem')
    const firstFoodItem = foodItems[0]
    const firstFoodItemAddButton = within(firstFoodItem).getByRole('button', {
      name: /Add/i,
      exact: false,
    })

    userEvent.click(firstFoodItemAddButton)
    // TODO: need to resolve
    // expect(localStorage.setItem).toHaveBeenCalled()
    const activeFoodItemCountElement = within(firstFoodItem).getByTestId(
      'active-count',
    )

    expect(activeFoodItemCountElement.textContent).toBe('1')
    const listEl = screen.getAllByRole('listitem')
    expect(listEl[1].textContent).toMatch(/Cart/i)
    userEvent.click(listEl[1])

    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_73:::The Cart Should be empty when the user removes all food items in the restaurant Details Route:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: restaurantDetailsPath})
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const foodItems = screen.getAllByTestId('foodItem')
    const firstFoodItem = foodItems[0]
    const firstFoodItemAddButton = within(firstFoodItem).getByRole('button', {
      name: /Add/i,
      exact: false,
    })
    userEvent.click(firstFoodItemAddButton)
    expect(
      within(firstFoodItem).queryByRole('button', {
        name: /Add/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()
    const firstFoodItemActiveCountElement = within(firstFoodItem).getByTestId(
      'active-count',
    )
    expect(firstFoodItemActiveCountElement.textContent).toBe('1')
    const firstFoodItemMinusButton = within(firstFoodItem).getByTestId(
      'decrement-count',
    )
    userEvent.click(firstFoodItemMinusButton)
    const secondFoodItem = foodItems[1]
    const secondFoodItemAddButton = within(secondFoodItem).getByRole('button', {
      name: /Add/i,
      exact: false,
    })
    userEvent.click(secondFoodItemAddButton)
    const secondFoodItemActiveCountElement = within(secondFoodItem).getByTestId(
      'active-count',
    )
    expect(secondFoodItemActiveCountElement.textContent).toBe('1')
    const secondFoodItemMinusButton = within(secondFoodItem).getByTestId(
      'decrement-count',
    )
    userEvent.click(secondFoodItemMinusButton)
    const listEl = screen.getAllByRole('listitem')
    expect(listEl[1].textContent).toMatch(/Cart/i)
    userEvent.click(listEl[1])
    expect(
      await screen.queryByRole('heading', {
        name: /No Order Yet!/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_74:::The Cart Route should contain food items with added quantity:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: restaurantDetailsPath})
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const foodItems = screen.getAllByTestId('foodItem')
    const firstFoodItem = foodItems[0]
    const firstFoodItemAddButton = within(firstFoodItem).getByRole('button', {
      name: /Add/i,
      exact: false,
    })
    userEvent.click(firstFoodItemAddButton)
    expect(
      within(firstFoodItem).queryByRole('button', {
        name: /Add/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()
    const firstFoodItemActiveCountElement = within(firstFoodItem).getByTestId(
      'active-count',
    )
    expect(firstFoodItemActiveCountElement.textContent).toBe('1')
    const firstFoodItemPlusButton = within(firstFoodItem).getByTestId(
      'increment-count',
    )
    userEvent.click(firstFoodItemPlusButton)

    const secondFoodItem = foodItems[1]
    const secondFoodItemAddButton = within(secondFoodItem).getByRole('button', {
      name: /Add/i,
      exact: false,
    })
    userEvent.click(secondFoodItemAddButton)
    const secondFoodItemActiveCountElement = within(secondFoodItem).getByTestId(
      'active-count',
    )
    expect(secondFoodItemActiveCountElement.textContent).toBe('1')
    const secondFoodItemPlusButton = within(secondFoodItem).getByTestId(
      'increment-count',
    )
    userEvent.click(secondFoodItemPlusButton)

    const listEl = screen.getAllByRole('listitem')
    expect(listEl[1].textContent).toMatch(/Cart/i)
    userEvent.click(listEl[1])
    expect(
      await screen.queryByRole('heading', {
        name: /No Order Yet!/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()

    const cartItems = screen.getAllByTestId('cartItem')
    const firstCartItem = cartItems[0]
    const secondCartItem = cartItems[1]
    const firstCartItemQuantity = within(firstCartItem).getByText('2')
    const secondCartItemQuantity = within(secondCartItem).getByText('2')
    expect(firstCartItemQuantity).toBeInTheDocument()
    expect(secondCartItemQuantity).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_75:::The Cart should be empty when the user removes the items in the Cart by Decreasing the quantity of a food item to 0 for all the cart items:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: restaurantDetailsPath})
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const foodItems = screen.getAllByTestId('foodItem')
    const firstFoodItem = foodItems[0]
    const firstFoodItemAddButton = within(firstFoodItem).getByRole('button', {
      name: /Add/i,
      exact: false,
    })
    userEvent.click(firstFoodItemAddButton)
    expect(
      within(firstFoodItem).queryByRole('button', {
        name: /Add/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()

    const listEl = screen.getAllByRole('listitem')
    expect(listEl[1].textContent).toMatch(/Cart/i)
    userEvent.click(listEl[1])
    expect(
      await screen.queryByRole('heading', {
        name: /No Order Yet!/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()

    const cartItems = screen.getAllByTestId('cartItem')
    const firstCartItem = cartItems[0]
    const firstCartItemQuantity = within(firstCartItem).getByText('1')
    expect(firstCartItemQuantity).toBeInTheDocument()
    const firstCartItemMinusButton = within(firstCartItem).getByTestId(
      'decrement-quantity',
    )
    userEvent.click(firstCartItemMinusButton)
    expect(
      await screen.queryByRole('heading', {
        name: /No Order Yet!/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_76:::The cart total price value should change accordingly when the cart items quantity is changed:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: restaurantDetailsPath})
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const foodItems = screen.getAllByTestId('foodItem')
    const firstFoodItem = foodItems[0]
    const firstFoodItemAddButton = within(firstFoodItem).getByRole('button', {
      name: /Add/i,
      exact: false,
    })
    userEvent.click(firstFoodItemAddButton)
    expect(
      within(firstFoodItem).queryByRole('button', {
        name: /Add/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()

    const listEl = screen.getAllByRole('listitem')
    expect(listEl[1].textContent).toMatch(/Cart/i)
    userEvent.click(listEl[1])
    expect(
      await screen.queryByRole('heading', {
        name: /No Order Yet!/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()

    const cartItems = screen.getAllByTestId('cartItem')
    const firstCartItem = cartItems[0]
    const firstCartItemQuantity = within(firstCartItem).getByTestId(
      'item-quantity',
    )
    expect(firstCartItemQuantity.textContent).toBe('1')
    const firstCartItemPlusButton = within(firstCartItem).getByTestId(
      'increment-quantity',
    )
    userEvent.click(firstCartItemPlusButton)
    userEvent.click(firstCartItemPlusButton)
    expect(firstCartItemQuantity.textContent).toBe('3')
    const {food_items} = restaurantDetailsResponse
    const {cost} = food_items[0]
    const quantityThreeTotalPrice = `${3 * cost}.00`
    const totalPriceElement = screen.getByTestId('total-price')
    expect(totalPriceElement.textContent).toBe(quantityThreeTotalPrice)
    const firstCartItemMinusButton = within(firstCartItem).getByTestId(
      'decrement-quantity',
    )
    userEvent.click(firstCartItemMinusButton)
    expect(firstCartItemQuantity.textContent).toBe('2')
    const quantityTwoTotalPrice = `${2 * cost}.00`
    expect(totalPriceElement.textContent).toBe(quantityTwoTotalPrice)
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_77:::When the user clicks the HTML button element with the text "Place Order" then the HTML main heading element with text as "Payment Successful" should be displayed to the user:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: restaurantDetailsPath})
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const foodItems = screen.getAllByTestId('foodItem')
    const firstFoodItem = foodItems[0]
    const firstFoodItemAddButton = within(firstFoodItem).getByRole('button', {
      name: /Add/i,
      exact: false,
    })
    userEvent.click(firstFoodItemAddButton)
    expect(
      within(firstFoodItem).queryByRole('button', {
        name: /Add/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()

    const listEl = screen.getAllByRole('listitem')
    expect(listEl[1].textContent).toMatch(/Cart/i)
    userEvent.click(listEl[1])
    expect(
      await screen.queryByRole('heading', {
        name: /No Order Yet!/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()

    const cartItems = screen.getAllByTestId('cartItem')
    const firstCartItem = cartItems[0]
    const firstCartItemQuantity = within(firstCartItem).getByTestId(
      'item-quantity',
    )
    expect(firstCartItemQuantity.textContent).toBe('1')
    const placeOrderButton = screen.getByRole('button', {
      name: /Place Order/i,
      exact: false,
    })
    userEvent.click(placeOrderButton)
    expect(
      await screen.getByRole('heading', {
        name: /Payment Successful/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_78:::When the user clicks the HTML button element with the text "Place Order" then the HTML paragraph element with text as "Payment Successful" should be displayed to the user:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: restaurantDetailsPath})
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const foodItems = screen.getAllByTestId('foodItem')
    const firstFoodItem = foodItems[0]
    const firstFoodItemAddButton = within(firstFoodItem).getByRole('button', {
      name: /Add/i,
      exact: false,
    })
    userEvent.click(firstFoodItemAddButton)
    expect(
      within(firstFoodItem).queryByRole('button', {
        name: /Add/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()

    const listEl = screen.getAllByRole('listitem')
    expect(listEl[1].textContent).toMatch(/Cart/i)
    userEvent.click(listEl[1])
    expect(
      await screen.queryByRole('heading', {
        name: /No Order Yet!/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()

    const cartItems = screen.getAllByTestId('cartItem')
    const firstCartItem = cartItems[0]
    const firstCartItemQuantity = within(firstCartItem).getByTestId(
      'item-quantity',
    )
    expect(firstCartItemQuantity.textContent).toBe('1')
    const placeOrderButton = screen.getByRole('button', {
      name: /Place Order/i,
      exact: false,
    })
    userEvent.click(placeOrderButton)

    const successMessageElement = await screen.getByText(
      /Thank you for ordering Your payment is successfully completed/i,
      {exact: false},
    )
    expect(successMessageElement.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_79:::After Payment Successful, If the user clicks the HTML button element with the text "Go to Home Page" then the page should redirect to home page:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: restaurantDetailsPath})
    expect(
      await screen.findByRole('heading', {
        name: restaurantDetailsResponse.name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const foodItems = screen.getAllByTestId('foodItem')
    const firstFoodItem = foodItems[0]
    const firstFoodItemAddButton = within(firstFoodItem).getByRole('button', {
      name: /Add/i,
      exact: false,
    })
    userEvent.click(firstFoodItemAddButton)
    expect(
      within(firstFoodItem).queryByRole('button', {
        name: /Add/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()

    const listEl = screen.getAllByRole('listitem')
    expect(listEl[1].textContent).toMatch(/Cart/i)
    userEvent.click(listEl[1])
    expect(
      await screen.queryByRole('heading', {
        name: /No Order Yet!/i,
        exact: false,
      }),
    ).not.toBeInTheDocument()

    const cartItems = screen.getAllByTestId('cartItem')
    const firstCartItem = cartItems[0]
    const firstCartItemQuantity = within(firstCartItem).getByTestId(
      'item-quantity',
    )
    expect(firstCartItemQuantity.textContent).toBe('1')
    const placeOrderButton = screen.getByRole('button', {
      name: /Place Order/i,
      exact: false,
    })
    userEvent.click(placeOrderButton)
    expect(
      await screen.getByRole('heading', {
        name: /Payment Successful/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    const successMessageElement = screen.getByText(
      /Thank you for ordering Your payment is successfully completed/i,
      {exact: false},
    )
    expect(successMessageElement.tagName).toBe('P')
    const goToHomePage = screen.getByRole('button', {
      name: /Go to Home Page/i,
      exact: false,
    })
    userEvent.click(goToHomePage)
    restoreGetCookieFns()
  })
})
