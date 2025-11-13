import axios from "axios";

/**
 * @class RestAPI
 *
 * Class to access the backend server.
 *
 * @property siteId{Number}     Content site ID for resolving
 * @property host{String}       REST API host
 * @property apiKey{String}     API key for backend access
 */
class RestAPI {
    constructor(siteId, host, apiKey) {
        this.siteId = siteId;
        this.host = host;
        axios.defaults.headers.common["x-api-key"] = apiKey;
    }

    /**
     * Get page data.
     *
     * @param pageId{Number}    ID of page to fetch
     * @returns {Promise<PageData>}
     */
    async getPage(pageId) {
        try {
            const response = await axios.get(`${this.host}/api/v1/content/pages/${pageId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching page ${pageId}.`, error);
        }
    }

    /**
     * Get the array of page sections.
     *
     * @param pageId{Number}    ID of page to fetch
     * @returns {Promise<[PageSectionData]>}
     */
    async getPageSections(pageId) {
        try {
            const response = await axios.get(`${this.host}/api/v1/content/pages/${pageId}/sections`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching page ${pageId} sections.`, error);
        }
    }

    /**
     * Get the site navigation outline.
     *
     * @returns {Promise<[PageData]>}
     */
    async getSiteOutline() {
        try {
            const response = await axios.get(`${this.host}/api/v1/content/sites/${this.siteId}/pages`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching site ${this.siteId} pages.`, error);
        }
    }

    /**
     * Get the site configuration information.
     *
     * @returns {Promise<SiteData>}
     */
    async getSiteData() {
        try {
            const response = await axios.get(`${this.host}/api/v1/content/sites/${this.siteId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching site data. siteId=${this.siteId}`, error);
        }
    }

    /**
     * Get the guest book configuration.
     *
     * @param guestBookId{Number}
     * @returns {Promise<GuestBookConfig>}
     */
    async getGuestBook(guestBookId) {
        try {
            const response = await axios.get(`${this.host}/api/v1/guestbook/${guestBookId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching guestbook. guestBookId=${guestBookId}`, error);
        }
    }

    /**
     * Retrieve guest data
     *
     * @param guestId {Number}
     * @return {Promise<GuestData>}
     */
    async getGuest(guestId) {
        try {
            const response = await axios.get(`${this.host}/api/v1/guestbook/guest/${guestId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching guest data. guestId=${guestId}`, error);
        }
    }

    /**
     * Post guest data
     *
     * @param guestBookId {Number}
     * @param data {GuestData}
     * @return {Promise<GuestData>}
     */
    async insertOrUpdateGuest(guestBookId, data) {
        try {
            const response = await axios.post(`${this.host}/api/v1/guestbook/${guestBookId}/guest`, data);
            return response.data;
        } catch (error) {
            console.error(`Error posting guest data. guestBookId=${guestBookId}, data=${JSON.stringify(data)}`, error);
        }
    }

    /**
     * Retrieve guest feedback
     *
     * @param guestFeedbackId {Number}
     * @return {Promise<GuestFeedbackData>}
     */
    async getGuestFeedback(guestFeedbackId) {
        const response = await axios.get(`${this.host}/api/v1/guestbook/feedback/${guestFeedbackId}`);
        return response.data;
    }

    /**
     * Submit guest feedback
     *
     * @param guestId {Number}
     * @param data {GuestFeedbackData}
     * @return {Promise<GuestFeedbackData>}
     */
    async insertOrUpdateGuestFeedback(guestId, data) {
        const response = await axios.post(`${this.host}/api/v1/guestbook/guest/${guestId}/feedback`, data);
        return response.data;
    }
}

export default RestAPI;


