import {render, screen} from '@testing-library/react';
import {act, useContext, useEffect} from "react";

import {SiteContext} from './Site.js';
import Page, {PageContext} from './Page.js';

import ReactGA from 'react-ga4';
import {MemoryRouter} from "react-router";

describe('Page component', () => {

  const mockSiteData = {SiteID: 10};
  const mockOutlineData = [
    {PageID: 50, PageTitle: 'First Page', PageRoute: '/firstpage', ParentID: 0, OutlineSeq: '1'},
    {PageID: 51, PageTitle: 'Second Page', PageRoute: '/secondpage', ParentID: 0, OutlineSeq: '2'},
    {PageID: 52, PageTitle: 'Third Page', PageRoute: '/thirdpage', ParentID: 51, OutlineSeq: '1'},
    {PageID: 53, PageTitle: 'Fourth Page', PageRoute: '/fourthpage', ParentID: 52, OutlineSeq: '1'}
  ];
  const mockPageSections = [];
  let mockRestApi;

  beforeEach(() => {
    mockRestApi = jest.mock('../../api/api.mjs');
  })

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should render', async () => {
    // given

    // when
    await act(async () => {
      render(
        <SiteContext
          value={{
            restApi: null,
            siteData: null,
            outlineData: null,
            error: null,
            setError: null,
            getChildren: null
          }}
        >
          <MemoryRouter initialEntries={['/']}>
            <Page/>
          </MemoryRouter>
        </SiteContext>
      );
    })

    // then
    const pageElement = screen.getByTestId(/Page/i);
    expect(pageElement).toBeInTheDocument();
  });

  it('should re-render with new page id and update PageContext', async () => {
    // given
    mockRestApi.getPage = jest.fn().mockResolvedValueOnce(mockOutlineData[0])
      .mockResolvedValue(mockOutlineData[1]);
    mockRestApi.getPageSections = jest.fn().mockResolvedValue(mockPageSections);
    const setError = jest.fn();
    const pageDataReceiver = jest.fn();
    const pageSectionsReceiver = jest.fn();
    const breadcrumbsReceiver = jest.fn();
    const MockChildElement = function () {
      const {pageData, pageSections, breadcrumbs} = useContext(PageContext);
      pageDataReceiver(pageData);
      pageSectionsReceiver(pageSections);
      breadcrumbsReceiver(breadcrumbs);
    }

    // when
    let renderedContent;
    await act(async () => {
      renderedContent = render(
        <SiteContext
          value={{
            restApi: mockRestApi,
            siteData: null,
            outlineData: null,
            error: null,
            setError: null,
            getChildren: null
          }}
        >
          <MemoryRouter initialEntries={['/']}>
            <Page pageId={50}>
              <MockChildElement/>
            </Page>
          </MemoryRouter>
        </SiteContext>
      );
    })
    await act(async () => {
      renderedContent.rerender(
        <SiteContext
          value={{
            restApi: mockRestApi,
            siteData: null,
            outlineData: null,
            error: null,
            setError: setError,
            getChildren: null
          }}
        >
          <MemoryRouter initialEntries={['/']}>
            <Page pageId={51}>
              <MockChildElement/>
            </Page>
          </MemoryRouter>
        </SiteContext>
      );
    })

    // then
    const pageElement = screen.getByTestId(/Page/i);
    expect(pageElement).toBeInTheDocument();
    expect(mockRestApi.getPage).toHaveBeenCalledTimes(2);
    expect(mockRestApi.getPage).toHaveBeenNthCalledWith(1, 50);
    expect(mockRestApi.getPage).toHaveBeenNthCalledWith(2, 51);
    expect(mockRestApi.getPageSections).toHaveBeenCalledTimes(2);
    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenCalledWith(null);
    expect(pageDataReceiver).toHaveBeenCalledTimes(4);
    expect(pageDataReceiver).toHaveBeenNthCalledWith(1, null);
    expect(pageDataReceiver).toHaveBeenNthCalledWith(2, mockOutlineData[0]);
    expect(pageDataReceiver).toHaveBeenNthCalledWith(3, null);
    expect(pageDataReceiver).toHaveBeenNthCalledWith(4, mockOutlineData[1]);
  });

  it('should call REST API', async () => {
    // given
    mockRestApi.getPage = jest.fn().mockResolvedValue(mockOutlineData[0]);
    mockRestApi.getPageSections = jest.fn().mockResolvedValue(mockPageSections);

    // when
    await act(async () => {
      render(
        <SiteContext
          value={{
            restApi: mockRestApi,
            siteData: null,
            outlineData: null,
            error: null,
            setError: null,
            getChildren: null
          }}
        >
          <MemoryRouter initialEntries={['/']}>
            <Page pageId={50}/>
          </MemoryRouter>
        </SiteContext>
      );
    })

    // then
    const pageElement = screen.getByTestId(/Page/i);
    expect(pageElement).toBeInTheDocument();
    expect(mockRestApi.getPage).toBeCalledTimes(1);
    expect(mockRestApi.getPage).toBeCalledWith(50);
    expect(mockRestApi.getPageSections).toBeCalledTimes(1);
    expect(mockRestApi.getPageSections).toBeCalledWith(50);
  });

  it('should build breadcrumbs for child components', async () => {
    // given
    mockRestApi.getPage = jest.fn().mockResolvedValue(mockOutlineData[3]);
    mockRestApi.getPageSections = jest.fn().mockResolvedValue(mockPageSections);
    const breadcrumbReceiver = jest.fn();
    const MockPageChild = function () {
      const {breadcrumbs} = useContext(PageContext);
      breadcrumbReceiver(breadcrumbs);
    }

    // when
    await act(async () => {
      render(
        <SiteContext
          value={{
            restApi: mockRestApi,
            siteData: mockSiteData,
            outlineData: mockOutlineData,
            error: null,
            setError: null,
            getChildren: null
          }}
        >
          <MemoryRouter initialEntries={['/']}>
            <Page pageId={53}>
              <MockPageChild/>
            </Page>
          </MemoryRouter>
        </SiteContext>
      );
    })

    // then
    const pageElement = screen.getByTestId(/Page/i);
    expect(pageElement).toBeInTheDocument();
    expect(breadcrumbReceiver).toBeCalledTimes(3); // page renders 3 times
    expect(breadcrumbReceiver).toBeCalledWith([{
      "OutlineSeq": "2",
      "PageID": 51,
      "PageRoute": "/secondpage",
      "PageTitle": "Second Page",
      "ParentID": 0
    }, {"OutlineSeq": "1", "PageID": 52, "PageRoute": "/thirdpage", "PageTitle": "Third Page", "ParentID": 51}]); // parent page in outline
  });

  it('should pass Site errors to child components', async () => {
    // given
    mockRestApi.getPage = jest.fn().mockResolvedValue(mockOutlineData[3]);
    mockRestApi.getPageSections = jest.fn().mockResolvedValue(mockPageSections);
    jest.spyOn(ReactGA, 'send');
    const pageDataReceiver = jest.fn();
    const errorReceiver = jest.fn();
    const MockPageChild = function () {
      const {pageData, error} = useContext(PageContext);
      pageDataReceiver(pageData);
      errorReceiver(error);
    }
    const error = {
      title: 'Error Title',
      description: 'Error description'
    }
    // when
    await act(async () => {
      render(
        <SiteContext
          value={{
            restApi: mockRestApi,
            siteData: mockSiteData,
            outlineData: mockOutlineData,
            error: error,
            setError: null,
            getChildren: null
          }}
        >
          <MemoryRouter initialEntries={['/']}>
            <Page pageId={53}>
              <MockPageChild/>
            </Page>
          </MemoryRouter>
        </SiteContext>
      );
    })

    // then
    const pageElement = screen.getByTestId(/Page/i);
    expect(pageElement).toBeInTheDocument();
    expect(pageDataReceiver).toBeCalledTimes(3);
    expect(pageDataReceiver).toBeCalledWith(mockOutlineData[3]);
    expect(errorReceiver).toBeCalledTimes(3);
    expect(errorReceiver).toBeCalledWith(error);
  });

  it('should pass error in props to child components', async () => {
    // given
    mockRestApi.getPage = jest.fn().mockResolvedValue(mockOutlineData[3]);
    mockRestApi.getPageSections = jest.fn().mockResolvedValue(mockPageSections);
    const pageDataReceiver = jest.fn();
    const errorReceiver = jest.fn();
    const MockPageChild = function () {
      const {pageData, error} = useContext(PageContext);
      pageDataReceiver(pageData);
      errorReceiver(error);
    }
    const error = {
      title: 'Error Title',
      description: 'Error description'
    }
    // when
    await act(async () => {
      render(
        <SiteContext
          value={{
            restApi: mockRestApi,
            siteData: mockSiteData,
            outlineData: mockOutlineData,
            error: null,
            setError: null,
            getChildren: null
          }}
        >
          <MemoryRouter initialEntries={['/']}>
            <Page pageId={53} error={error}>
              <MockPageChild/>
            </Page>
          </MemoryRouter>
        </SiteContext>
      );
    })

    // then
    const pageElement = screen.getByTestId(/Page/i);
    expect(pageElement).toBeInTheDocument();
    expect(pageDataReceiver).toBeCalledTimes(3);
    expect(pageDataReceiver).toBeCalledWith(mockOutlineData[3]);
    expect(errorReceiver).toBeCalledTimes(3);
    expect(errorReceiver).toBeCalledWith(error);
  });

  it('should provide page data to child components', async () => {
    // given
    mockRestApi.getPage = jest.fn().mockResolvedValue(mockOutlineData[3]);
    mockRestApi.getPageSections = jest.fn().mockResolvedValue(mockPageSections);
    const pageDataReceiver = jest.fn();
    const MockPageChild = function () {
      const {pageData, error} = useContext(PageContext);
      pageDataReceiver(pageData);
    }

    // when
    await act(async () => {
      render(
        <SiteContext
          value={{
            restApi: mockRestApi,
            siteData: mockSiteData,
            outlineData: mockOutlineData,
            error: null,
            setError: null,
            getChildren: null
          }}
        >
          <MemoryRouter initialEntries={['/']}>
            <Page pageId={53}>
              <MockPageChild/>
            </Page>
          </MemoryRouter>
        </SiteContext>
      );
    })

    // then
    const pageElement = screen.getByTestId(/Page/i);
    expect(pageElement).toBeInTheDocument();
    expect(pageDataReceiver).toBeCalledTimes(3); // page renders 3 times
    expect(pageDataReceiver).toBeCalledWith(mockOutlineData[3]); // parent page in outline
  });

  it('should update when new page id is received', async () => {
    // given
    mockRestApi.getPage = jest.fn().mockResolvedValue(mockOutlineData[3]);
    mockRestApi.getPageSections = jest.fn().mockResolvedValue(mockPageSections);
    const pageDataReceiver = jest.fn();
    const MockPageChild = function () {
      const {pageData} = useContext(PageContext);
      pageDataReceiver(pageData);
    }

    // when
    await act(async () => {
      render(
        <SiteContext
          value={{
            restApi: mockRestApi,
            siteData: mockSiteData,
            outlineData: mockOutlineData,
            error: null,
            setError: null,
            getChildren: null
          }}
        >
          <MemoryRouter initialEntries={['/']}>
            <Page pageId={53}>
              <MockPageChild/>
            </Page>
          </MemoryRouter>
        </SiteContext>
      );
    })

    // then
    const pageElement = screen.getByTestId(/Page/i);
    expect(pageElement).toBeInTheDocument();
    expect(pageDataReceiver).toBeCalledTimes(3); // page renders 3 times
    expect(pageDataReceiver).toBeCalledWith(mockOutlineData[3]); // parent page in outline
  });

});