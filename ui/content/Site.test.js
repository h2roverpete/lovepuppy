import {render, screen} from '@testing-library/react';
import {act, Fragment} from "react";

import Site from './Site';

import ReactGA from 'react-ga4';
import RestAPI from "../../api/api.mjs";
import {MemoryRouter} from "react-router";

describe('Site component', () => {

  const mockSiteData = {SiteID: 10};
  const mockOutlineData = [
    {PageID: 50, PageTitle: 'First Page', PageRoute: '/firstpage'},
    {PageID: 51, PageTitle: 'Second Page', PageRoute: '/secondpage'}
  ];
  let MockPage;

  beforeEach(() => {
    // set up mock Page component
    MockPage = jest.fn().mockReturnValue((<div data-testid="MockPage"></div>));
  })

  afterEach(() => {
    // clean up spyOn mocks
    jest.restoreAllMocks();
  })

  it('should render Site', async () => {
    // given
    jest.spyOn(RestAPI.prototype, 'getSite').mockResolvedValue(mockSiteData)
    jest.spyOn(RestAPI.prototype, 'getSiteOutline').mockResolvedValue(mockOutlineData);

    // when
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Site pageElement={MockPage}/>
        </MemoryRouter>
      );
    })

    //then
    const siteElement = screen.getByTestId(/Site/i);
    expect(siteElement).toBeInTheDocument();
  });

  it('should render default Page', async () => {
    // given
    jest.spyOn(RestAPI.prototype, 'getSite').mockResolvedValue(mockSiteData)
    jest.spyOn(RestAPI.prototype, 'getSiteOutline').mockResolvedValue(mockOutlineData);

    // when
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Site pageElement={MockPage}/>
        </MemoryRouter>
      );
    })

    // then
    const pageElement = screen.getByTestId(/MockPage/i);
    expect(pageElement).toBeInTheDocument();
    expect(MockPage).toBeCalledTimes(1);
    expect(MockPage).toBeCalledWith({pageId: 50}, undefined);
  });

  it('should render second Page', async () => {
    // given
    jest.spyOn(RestAPI.prototype, 'getSite').mockResolvedValue(mockSiteData)
    jest.spyOn(RestAPI.prototype, 'getSiteOutline').mockResolvedValue(mockOutlineData);

    // when
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/secondpage']}>
          <Site pageElement={MockPage}/>
        </MemoryRouter>
      );
    })

    // then
    const pageElement = screen.getByTestId(/MockPage/i);
    expect(pageElement).toBeInTheDocument();
    expect(MockPage).toBeCalledTimes(1);
    expect(MockPage).toBeCalledWith({pageId: 51}, undefined);
  });

  it('should render page.cfm by page ID', async () => {
    // given
    jest.spyOn(RestAPI.prototype, 'getSite').mockResolvedValue(mockSiteData)
    jest.spyOn(RestAPI.prototype, 'getSiteOutline').mockResolvedValue(mockOutlineData);
    const originalLocation = window.location; // Store original location
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: {
        ...originalLocation, // Keep original methods like assign, reload, replace if needed
        pathname: '/page.cfm',
        search: '?pageid=51',
        href: 'http://localhost/page.cfm?pageid=51',
      },
    });

    // when
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/page.cfm']}>
          <Site pageElement={MockPage}/>
        </MemoryRouter>
      );
    })

    // then
    const pageElement = screen.getByTestId(/MockPage/i);
    expect(pageElement).toBeInTheDocument();
    expect(MockPage).toBeCalledTimes(1);
    expect(MockPage).toBeCalledWith({pageId: 51}, undefined);
  });

  it('should redirect pages for alternate domains', async () => {
    // given
    jest.spyOn(RestAPI.prototype, 'getSite').mockResolvedValue(mockSiteData)
    jest.spyOn(RestAPI.prototype, 'getSiteOutline').mockResolvedValue(mockOutlineData);
    const originalLocation = window.location; // Store original location
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: {
        ...originalLocation, // Keep original methods like assign, reload, replace if needed
        pathname: '/',
        search: '',
        href: 'http://www.alternatedomain.com',
        hostname: 'www.alternatedomain.com'
      },
    });

    // when
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Site pageElement={MockPage} redirects={[{hostname: 'www.alternatedomain.com', pageId: 51}]}/>
        </MemoryRouter>
      );
    })

    // then
    const pageElement = screen.getByTestId(/MockPage/i);
    expect(pageElement).toBeInTheDocument();
    expect(MockPage).toBeCalledTimes(1);
    expect(MockPage).toBeCalledWith({pageId: 51}, undefined);
  });

  it('should send 404 error to Page', async () => {
    // given
    jest.spyOn(RestAPI.prototype, 'getSite').mockResolvedValue(mockSiteData)
    jest.spyOn(RestAPI.prototype, 'getSiteOutline').mockResolvedValue(mockOutlineData);

    // when
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/badPath']}>
          <Site pageElement={MockPage}/>
        </MemoryRouter>
      );
    })

    // then
    const pageElement = screen.getByTestId(/MockPage/i);
    expect(pageElement).toBeInTheDocument();
    expect(MockPage).toBeCalledTimes(1);
    expect(MockPage).toBeCalledWith({
      "error": {
        "description": "The content you are looking for was not found. Please select a topic on the navigation bar to browse the site.",
        "title": "404 Not Found"
      }
    }, undefined);
  });

  it('should send outline loading error to Page', async () => {
    // given
    jest.spyOn(RestAPI.prototype, 'getSite').mockResolvedValue(mockSiteData)
    jest.spyOn(RestAPI.prototype, 'getSiteOutline').mockRejectedValue({code: "ERRCODE", status: 400});

    // when
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Site pageElement={MockPage}/>
        </MemoryRouter>
      );
    })

    // then
    const pageElement = screen.getByTestId(/MockPage/i);
    expect(pageElement).toBeInTheDocument();
    expect(MockPage).toBeCalledTimes(1);
    expect(MockPage).toBeCalledWith({
      "error": {
        "description": "Site data could not be loaded.<br>Code: ERRCODE",
        "title": "400 Server Error"
      }
    }, undefined);
  });

  it('should send site loading error to Page', async () => {
    // given
    jest.spyOn(RestAPI.prototype, 'getSite').mockRejectedValue({code: "ERRCODE", status: 400})
    jest.spyOn(RestAPI.prototype, 'getSiteOutline').mockResolvedValue(mockOutlineData);

    // when
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Site pageElement={MockPage}/>
        </MemoryRouter>
      );
    })

    // then
    const pageElement = screen.getByTestId(/MockPage/i);
    expect(pageElement).toBeInTheDocument();
    expect(MockPage).toBeCalledTimes(1);
    expect(MockPage).toBeCalledWith({
      "error": {
        "description": "Site data could not be loaded.<br>Code: ERRCODE",
        "title": "400 Server Error"
      }
    }, undefined);
  });

  it('should initialize Google Analytics', async () => {
    // given
    jest.spyOn(RestAPI.prototype, 'getSite').mockResolvedValue(mockSiteData)
    jest.spyOn(RestAPI.prototype, 'getSiteOutline').mockResolvedValue(mockOutlineData);
    jest.spyOn(ReactGA, 'initialize');
    const gid = 'MyGoogleID'

    // when
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Site googleId={gid} pageElement={MockPage}/>
        </MemoryRouter>
      );
    })

    // then
    expect(ReactGA.initialize).toBeCalledWith(gid);
  });

});

