import {createMemoryHistory} from 'history'
import {Router, BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {setupServer} from 'msw/node'
import {rest} from 'msw'
import * as fs from 'fs'
import path from 'path'

import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

const jsxCode = fs.readFileSync(
  path.resolve(__dirname, '../components/Footer/index.js'),
  'utf8',
)

const loginRoutePath = '/login'

const homeRoutePath = '/'

const restaurantDetailsPath = '/restaurant/2200043'

const restaurantDetailsAPIURL = 'https://apis.ccbp.in/restaurants-list/:id'

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

const pageOneRestaurantsListSortByHighestResponse = {
  restaurants: [
    {
      has_online_delivery: true,
      user_rating: {
        rating_text: 'Very Good',
        rating_color: '5BA829',
        total_reviews: 140,
        rating: 4.1,
      },
      name: 'Cafe Madarassi',
      has_table_booking: 0,
      is_delivering_now: 0,
      cost_for_two: 150,
      cuisine: 'Fast Food',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/restaurants/cafe-madarassi-2200153.jpg',
      id: '2200153',
      menu_type: 'VEG',
      location:
        'Dubai colony rode no:1 pradhan mantri kusal kendra 4th floor, Hyderabad,',
      opens_at: '10:00 AM, Tomorrow',
      group_by_time: true,
    },
    {
      has_online_delivery: true,
      user_rating: {
        rating_text: 'Good',
        rating_color: '9ACD32',
        total_reviews: 206,
        rating: 3.9,
      },
      name: 'Hotel Sri Ganesh Bhavan',
      cost_for_two: 200,
      cuisine: 'North Indian, Chinese',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/restaurants/hotel-sriganesh-bhavan-2200045.jpg',
      id: '2200045',
      menu_type: 'VEG',
      location: 'Fortune Enclave, Sri Ram Nagar Colony, Banjara Hills, ',
      opens_at: '09:30 AM, Tomorrow',
      group_by_time: true,
    },
    {
      has_online_delivery: true,
      user_rating: {
        rating_text: 'Good',
        rating_color: '9ACD32',
        total_reviews: 276,
        rating: 3.8,
      },
      name: 'Arunodaya Restuarent',
      has_table_booking: 0,
      is_delivering_now: 0,
      cost_for_two: 500,
      cuisine: 'North Indian, Chinese',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/restaurants/arunodaya-restaurant-2200132.jpg',
      id: '2200132',
      menu_type: 'VEG',
      location:
        'NV Plaza, 4th Floor, Punjagutta Rd, Dwarakapuri, Punjagutta, Hyderabad',
      opens_at: '09:30 AM, Tomorrow',
      group_by_time: true,
    },
  ],
  total: 30,
}

const pageOneRestaurantsListSortByLowestResponse = {
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
    {
      has_online_delivery: true,
      user_rating: {
        rating_text: 'Good',
        rating_color: '9ACD32',
        total_reviews: 111,
        rating: 3.5,
      },
      name: 'Hydarabad Spices',
      has_table_booking: 0,
      is_delivering_now: 0,
      cost_for_two: 400,
      cuisine: 'Fast Food',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/restaurants/hydarabad-spices-2200033.jpg',
      id: '2200033',
      menu_type: 'VEG',
      location:
        'Parkview garden Appartments,Masabtank, Humayun Nagar, Hyderabad,',
      opens_at: '10:00 AM, Tomorrow',
      group_by_time: true,
    },
  ],
  total: 30,
}

const pageTwoRestaurantsListSortByHighestResponse = {
  restaurants: [
    {
      has_online_delivery: true,
      user_rating: {
        rating_text: 'Good',
        rating_color: '9ACD32',
        total_reviews: 97,
        rating: 3.9,
      },
      name: 'Mr Brown',
      has_table_booking: 0,
      is_delivering_now: 0,
      cost_for_two: 500,
      cuisine: 'Bakery',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/restaurants/mr-brown-2300183.webp',
      id: '2300183',
      menu_type: 'VEG',
      location: 'Addagutta Society - HMT Hills Rd, Kukatpally, Hyderabad,',
      opens_at: '04:00 PM, Tomorrow',
      group_by_time: true,
    },
    {
      has_online_delivery: true,
      user_rating: {
        rating_text: 'Good',
        rating_color: '9ACD32',
        total_reviews: 56,
        rating: 3.6,
      },
      name: 'Royal Spicy Foods',
      has_table_booking: 0,
      is_delivering_now: 0,
      cost_for_two: 150,
      cuisine: 'Street Food',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/restaurants/royal-spicy-foods-2200201.jpg',
      id: '2200201',
      menu_type: 'VEG',
      location: 'Mehdipatnam, Hyderabad',
      opens_at: '12:00 PM, Tomorrow',
      group_by_time: true,
    },
    {
      has_online_delivery: true,
      user_rating: {
        rating_text: 'Good',
        rating_color: '9ACD32',
        total_reviews: 51,
        rating: 3.6,
      },
      name: 'Mr.Ice Cream',
      has_table_booking: 0,
      is_delivering_now: 0,
      cost_for_two: 700,
      cuisine: 'Bakery',
      image_url:
        'https://assets.ccbp.in/frontend/react-js/tasty-kitchens/restaurants/mr-ice-cream-2200283.webp',
      id: '2200283',
      menu_type: 'VEG',
      location: 'Street Number 6, Domalguda, Himayatnagar, Hyderabad,',
      opens_at: '12:00 PM, Tomorrow',
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

const mockHistoryReplace = instance => {
  jest.spyOn(instance, 'replace')
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

const mockRemoveCookie = () => {
  jest.spyOn(Cookies, 'remove')
  Cookies.remove = jest.fn()
}

const restoreRemoveCookieFns = () => {
  Cookies.remove.mockRestore()
}

const renderWithBrowserRouter = (
  ui = <App />,
  {route = homeRoutePath} = {},
) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

const rtlRender = (ui = <App />, path = homeRoutePath) => {
  const history = createMemoryHistory()
  history.push(path)
  render(<Router history={history}>{ui}</Router>)
  return {
    history,
  }
}

const originalConsoleError = console.error
const originalFetch = window.fetch

describe(':::RJSCPP63AV_TEST_SUITE_3:::Home Route Tests', () => {
  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    window.fetch = originalFetch
  })

  afterAll(() => {
    server.close()
  })

  it(':::RJSCPP63AV_TEST_28:::When HTTP GET request should be made to offersApi is successful, the page should consist of at least two HTML list items, and the offers list should be rendered using a unique key as a prop for each similar offer item :::5:::', async () => {
    mockGetCookie()
    console.error = message => {
      if (
        /Each child in a list should have a unique "key" prop/.test(message) ||
        /Encountered two children with the same key/.test(message)
      ) {
        throw new Error(message)
      }
    }
    rtlRender(<App />, homeRoutePath)
    restoreGetCookieFns()

    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    console.error = originalConsoleError
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_29:::HomeRoute should consist of an HTML image element with the given logo URL as src and alt text as "website logo":::5:::', async () => {
    rtlRender(<App />, homeRoutePath)
    const imageEls = screen.getAllByRole('img', {
      name: /website logo/i,
      exact: false,
    })
    expect(imageEls[0]).toBeInTheDocument()
  })

  it(':::RJSCPP63AV_TEST_30:::Home Route should consist of an HTML unordered list element to display the list of items in the Header:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('list').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('list')[0].tagName).toBe('UL')
  })

  it(':::RJSCPP63AV_TEST_31:::Home Route should consist of an HTML element with text content as "Home" wrapped with Link from react-router-dom:::5:::', async () => {
    rtlRender(<App />, homeRoutePath)
    expect(
      screen.getAllByRole('link', {
        name: /Home/i,
        exact: false,
      })[0],
    ).toBeInTheDocument()
  })

  it(':::RJSCPP63AV_TEST_32:::Home Route should consist of an HTML element with text content as "Cart" wrapped with Link from react-router-dom:::5:::', async () => {
    rtlRender(<App />, homeRoutePath)
    expect(
      screen.getAllByRole('link', {
        name: /Home/i,
        exact: false,
      })[0],
    ).toBeInTheDocument()
  })

  it(':::RJSCPP63AV_TEST_33:::HomeRoute should consist of an HTML button element with "Logout" as text content:::5:::', async () => {
    rtlRender(<App />, homeRoutePath)
    expect(
      await screen.getByRole('button', {
        name: /Logout/,
        exact: false,
      }),
    ).toBeInTheDocument()
  })

  it(':::RJSCPP63AV_TEST_34:::When the Home Route is opened, it should initially contain an HTML container element with testid attribute value as "loader":::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, homeRoutePath)
    await screen.queryByTestId('loader')

    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_35:::When the Restaurants List offers and Restaurants data fetched successfully then the HTML container element with testid attribute value as "loader" should not visible to the user:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    await screen.queryByTestId('loader')

    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    await expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_36:::When the Home Route is opened then the page should contain at least 2 HTML images with alt text as "offer":::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, homeRoutePath)
    const offerImages = await screen.findAllByAltText(/offer/i, {exact: false})
    expect(offerImages.length).toBeGreaterThan(2)
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_37:::HomeRoute should consist of an HTML main heading element with "Popular Restaurants" as text content:::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, homeRoutePath)
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Popular Restaurants/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_38:::HomeRoute should consist of an HTML paragraph element with "Select Your favourite restaurent special dish and make your day happy..." as text content:::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, homeRoutePath)
    await screen.findAllByAltText(/offer/i, {exact: false})
    const paragraphEl = await screen.getByText(
      /Select Your favourite restaurent special dish and make your day happy.../i,
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_39:::JS code implementation for Footer Component should use "FaPinterestSquare", "FaInstagram", "FaTwitter" and "FaFacebookSquare" from the react-icons package:::5:::', async () => {
    rtlRender(<App />, homeRoutePath)
    expect(jsxCode.match(/FaPinterestSquare/).length).toBeGreaterThanOrEqual(1)
    expect(jsxCode.match(/<FaPinterestSquare/).length).toBeGreaterThanOrEqual(1)
    expect(jsxCode.match(/FaInstagram/).length).toBeGreaterThanOrEqual(1)
    expect(jsxCode.match(/<FaInstagram/).length).toBeGreaterThanOrEqual(1)
    expect(jsxCode.match(/FaTwitter/).length).toBeGreaterThanOrEqual(1)
    expect(jsxCode.match(/<FaTwitter/).length).toBeGreaterThanOrEqual(1)
    expect(jsxCode.match(/FaFacebookSquare/).length).toBeGreaterThanOrEqual(1)
    expect(jsxCode.match(/<FaFacebookSquare/).length).toBeGreaterThanOrEqual(1)
  })

  it(':::RJSCPP63AV_TEST_40:::Home Route should consist of Footer with HTML paragraph element with text content as "The only thing we`re serious about is food. Contact us on":::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, homeRoutePath)
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /The only thing we`re serious about is food. Contact us on/i,
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_41:::When the logout button is clicked then the Cookies.remove() method should be called with the "jwt_token" string as an argument:::5:::', async () => {
    mockRemoveCookie()
    mockGetCookie()
    rtlRender(<App />, homeRoutePath)

    const logoutBtn = await screen.getByRole('button', {
      name: /Logout/i,
      exact: false,
    })
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    userEvent.click(logoutBtn)
    expect(Cookies.remove).toHaveBeenCalledWith('jwt_token')
    restoreRemoveCookieFns()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_42:::When the logout button is clicked then the history.replace() method should be called with the argument "/login":::5:::', async () => {
    mockGetCookie()
    const {history} = rtlRender(<App />, homeRoutePath)
    mockHistoryReplace(history)
    const logoutBtn = await screen.getByRole('button', {
      name: /Logout/i,
      exact: false,
    })

    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    userEvent.click(logoutBtn)
    expect(history.replace).toHaveBeenCalledWith(loginRoutePath)
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_43:::When the logout button is clicked then the page should be navigated to LoginRoute:::5:::', async () => {
    mockRemoveCookie()
    mockGetCookie()
    const {history} = rtlRender(<App />, homeRoutePath)

    const logoutBtn = screen.getByRole('button', {
      name: /logout/i,
      exact: false,
    })
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    userEvent.click(logoutBtn)

    await waitFor(() => expect(history.location.pathname).toBe(loginRoutePath))
    restoreGetCookieFns()
    restoreRemoveCookieFns()
  })

  it(':::RJSCPP63AV_TEST_44:::When the Home Route is accessed, an HTTP GET request should be made to restaurants offers api with the given restaurants offers API URL:::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === offersAPIURL) {
        return {
          ok: true,
          json: () => Promise.resolve(offersListResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve(pageOneRestaurantsListInitialResponse),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Popular Restaurants/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(mockFetchFunction.mock.calls[0][0]).toMatch(offersAPIURL)
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_45:::When the Home Route is accessed, an HTTP GET request should be made to restaurants lists api with the given restaurants list API URL:::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === offersAPIURL) {
        return {
          ok: true,
          json: () => Promise.resolve(offersListResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve(pageOneRestaurantsListInitialResponse),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Popular Restaurants/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(mockFetchFunction.mock.calls[1][0]).toMatch(restaurantsAPIURL)
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_46:::When the Home Route is opened, an HTTP GET request should be made to restaurantsListAPI with all the query parameters and their initial values:::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(url => {
      if (url === offersAPIURL) {
        return {
          ok: true,
          json: () => Promise.resolve(offersListResponse),
        }
      }
      return {
        ok: true,
        json: () => Promise.resolve(pageOneRestaurantsListInitialResponse),
      }
    })
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Popular Restaurants/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(mockFetchFunction.mock.calls[1][0]).toMatch('offset=')
    expect(mockFetchFunction.mock.calls[1][0]).toMatch('sort_by_rating=')
    expect(mockFetchFunction.mock.calls[1][0]).toMatch('limit=')
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_47:::When the Home Route is opened then the page should contain all the restaurants list items that we get in response with the testid="restaurant-item":::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, homeRoutePath)
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    const restaurantsListItems = screen.getAllByTestId('restaurant-item')
    expect(restaurantsListItems.length).toBe(
      pageOneRestaurantsListInitialResponse.restaurants.length,
    )
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_48:::The restaurant List item should contain the all the details of the restaurant:::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, homeRoutePath)
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    const restaurantsListItems = screen.getAllByTestId('restaurant-item')
    const firstRestaurantItem = restaurantsListItems[0]
    const {restaurants} = pageOneRestaurantsListInitialResponse
    const {name, image_url, cuisine} = restaurants[0]
    expect(within(firstRestaurantItem).getByAltText(/restaurant/i).src).toBe(
      image_url,
    )
    expect(
      within(firstRestaurantItem).getByRole('heading', {
        name,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(
      within(firstRestaurantItem).getByText(cuisine, {
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_49:::When the restaurant list item with testid="restaurant-item" is clicked then the page should navigated to restaurant details page:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: homeRoutePath})
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    const restaurantsListItems = screen.getAllByAltText('restaurant')
    userEvent.click(restaurantsListItems[0])
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe(restaurantDetailsPath)
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_50:::The Restaurants List select filter should contain "Sort By" as default selected value:::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, homeRoutePath)
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    expect(screen.getByRole('option', {name: 'Sort by'}).selected).toBe(true)
    expect(screen.getByRole('option', {name: 'Highest'}).selected).toBe(false)
    expect(screen.getByRole('option', {name: 'Lowest'}).selected).toBe(false)
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_51:::The Restaurants List should be sort by Highest when user select sort by filter value as "Highest":::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, homeRoutePath)
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    userEvent.selectOptions(screen.getByRole('combobox'), ['Highest'])
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Cafe Madarassi/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('option', {name: 'Sort by'}).selected).toBe(false)
    expect(screen.getByRole('option', {name: 'Highest'}).selected).toBe(true)
    expect(screen.getByRole('option', {name: 'Lowest'}).selected).toBe(false)

    const {restaurants} = pageOneRestaurantsListSortByHighestResponse
    const {name} = restaurants[0]
    const restaurantsListItems = screen.getAllByTestId('restaurant-item')
    expect(
      await within(restaurantsListItems[0]).findByRole('heading', {
        name,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_52:::The Restaurants List should be sort by Highest when user select sort by filter value as "Lowest":::5:::', async () => {
    mockGetCookie()
    rtlRender(<App />, homeRoutePath)
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    userEvent.selectOptions(screen.getByRole('combobox'), ['Lowest'])
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('option', {name: 'Sort by'}).selected).toBe(false)
    expect(screen.getByRole('option', {name: 'Highest'}).selected).toBe(false)
    expect(screen.getByRole('option', {name: 'Lowest'}).selected).toBe(true)

    const {restaurants} = pageOneRestaurantsListSortByLowestResponse
    const {name, image_url, cuisine} = restaurants[2]
    const restaurantsListItems = screen.getAllByTestId('restaurant-item')
    expect(
      await within(restaurantsListItems[2]).findByRole('heading', {
        name,
        exact: false,
      }),
    ).toBeInTheDocument()

    expect(
      within(restaurantsListItems[2]).getByRole('img', {name: 'restaurant'})
        .src,
    ).toBe(image_url)

    expect(
      within(restaurantsListItems[2]).getByRole('heading', {
        name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const cuisineTypeElement = within(
      restaurantsListItems[2],
    ).getByText(cuisine, {exact: false})
    expect(cuisineTypeElement.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_53:::When the HTML button element with testid="pagination-right-button" is clicked then restaurants List of second page with selected filter should be visible to the user:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: homeRoutePath})
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    userEvent.selectOptions(screen.getByRole('combobox'), ['Highest'])
    const paginationRightBtn = await screen.findByTestId(
      'pagination-right-button',
    )
    expect(screen.getByRole('option', {name: 'Sort by'}).selected).toBe(false)
    expect(screen.getByRole('option', {name: 'Highest'}).selected).toBe(true)
    expect(screen.getByRole('option', {name: 'Lowest'}).selected).toBe(false)

    expect(paginationRightBtn).toBeInTheDocument()

    userEvent.click(paginationRightBtn)
    expect(
      await screen.findByRole('heading', {
        name: /Mr Brown/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    const {restaurants} = pageTwoRestaurantsListSortByHighestResponse
    const {name, image_url, cuisine} = restaurants[2]
    const restaurantsListItems = screen.getAllByTestId('restaurant-item')

    expect(
      within(restaurantsListItems[2]).getByRole('img', {name: 'restaurant'})
        .src,
    ).toBe(image_url)

    expect(
      within(restaurantsListItems[2]).getByRole('heading', {
        name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const cuisineTypeElement = within(
      restaurantsListItems[2],
    ).getByText(cuisine, {exact: false})
    expect(cuisineTypeElement.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it(':::RJSCPP63AV_TEST_54:::The Restaurants List items should be displayed based on the pagination and sort by filter:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: homeRoutePath})
    await screen.findAllByAltText(/offer/i, {exact: false})
    expect(
      await screen.findByRole('heading', {
        name: /Village Traditional Foods/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    userEvent.selectOptions(screen.getByRole('combobox'), ['Highest'])
    const paginationRightBtn = await screen.findByTestId(
      'pagination-right-button',
    )
    expect(screen.getByRole('option', {name: 'Sort by'}).selected).toBe(false)
    expect(screen.getByRole('option', {name: 'Highest'}).selected).toBe(true)
    expect(screen.getByRole('option', {name: 'Lowest'}).selected).toBe(false)

    expect(paginationRightBtn).toBeInTheDocument()

    userEvent.click(paginationRightBtn)
    expect(
      await screen.findByRole('heading', {
        name: /Mr Brown/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    const paginationleftBtn = screen.getByTestId('pagination-left-button')

    userEvent.click(paginationleftBtn)

    expect(
      await screen.findByRole('heading', {
        name: /Cafe Madarassi/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    const {restaurants} = pageOneRestaurantsListSortByHighestResponse
    const {name, image_url, cuisine} = restaurants[2]
    const restaurantsListItems = screen.getAllByTestId('restaurant-item')

    expect(
      within(restaurantsListItems[2]).getByRole('img', {name: 'restaurant'})
        .src,
    ).toBe(image_url)

    expect(
      within(restaurantsListItems[2]).getByRole('heading', {
        name,
        exact: false,
      }),
    ).toBeInTheDocument()

    const cuisineTypeElement = within(
      restaurantsListItems[2],
    ).getByText(cuisine, {exact: false})
    expect(cuisineTypeElement.tagName).toBe('P')

    restoreGetCookieFns()
  })
})
