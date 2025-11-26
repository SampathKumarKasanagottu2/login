/**
 * Base Attendance Provider
 * 
 * Abstract base class providing common functionality for all attendance providers.
 * Handles Puppeteer browser initialization, cleanup, and health checks.
 * 
 * Concrete providers (AkriviaProvider, etc.) should extend this class
 * and implement the login() and logout() methods.
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import isReachable from 'is-reachable';
import {
    IAttendanceProvider,
    ProviderConfig,
    LoginCredentials,
    LoginResult,
    LogoutResult
} from './provider.interface';

export abstract class BaseAttendanceProvider implements IAttendanceProvider {
    protected browser?: Browser;
    protected page?: Page;
    protected config: ProviderConfig;

    constructor(config: ProviderConfig) {
        this.config = config;
    }

    /**
     * Get provider name from configuration
     */
    getName(): string {
        return this.config.name;
    }

    async enableGeolocation(): Promise<void> {
        const context = this.browser?.defaultBrowserContext();
        const url = new URL(this.config.loginUrl);

        console.log(`[${this.getName()}] Enabling geolocation permissions...`);

        await context?.overridePermissions(url.origin, ['geolocation']);

        await this.page?.setGeolocation({
            latitude: 17.433245692380474,
            longitude: 78.37831458068635,
            accuracy: 100
        })

    }

    /**
     * Initialize Puppeteer browser and create a new page
     * Sets up user agent and prepares for automation
     */
    async initialize(): Promise<void> {
        // Determine Chrome executable path based on OS
        // Use environment variable if set, otherwise try to find chrome
        const chromePath = process.env.PUPPETEER_EXECUTABLE_PATH ||
            (process.platform === 'darwin'
            ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            : process.platform === 'win32'
                ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
                : '/usr/bin/chromium-browser'); // Linux - use chromium-browser as fallback

        console.log(`[${this.getName()}] Initializing browser...`);
        console.log(`[${this.getName()}] Using Chrome path: ${chromePath}`);

        this.browser = await puppeteer.launch({
            headless: this.config.headless ? "new" : false, // Use new headless mode
            executablePath: chromePath,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding'
            ],

        });

        this.page = await this.browser.newPage();

        await this.enableGeolocation();

        await this.page.setViewport({
            width: 1920,
            height: 1080
        })

        // Set realistic user agent
        const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
        await this.page.setUserAgent(userAgent);

        console.log(`[${this.getName()}] Browser initialized successfully`);
    }

    /**
     * Cleanup resources - close browser and release memory
     */
    async cleanup(): Promise<void> {
        if (this.browser) {
            console.log(`[${this.getName()}] Closing browser...`);
            await this.browser.close();
            this.browser = undefined;
            this.page = undefined;
            console.log(`[${this.getName()}] Browser closed`);
        }
    }

    /**
     * Check if system has internet connectivity
     * Tests by reaching google.com
     */
    async healthCheck(): Promise<boolean> {
        try {
            const isOnline = await isReachable('www.google.com', { timeout: 10000 });
            console.log(`[${this.getName()}] Health check: ${isOnline ? 'PASS' : 'FAIL'}`);
            return isOnline;
        } catch (error) {
            console.error(`[${this.getName()}] Health check failed:`, error);
            return false;
        }
    }

    /**
     * Abstract method - must be implemented by concrete providers
     * Performs login and attendance sign-in
     */
    abstract login(credentials: LoginCredentials): Promise<LoginResult>;

    /**
     * Abstract method - must be implemented by concrete providers
     * Performs logout and attendance sign-out
     */
    abstract logout(credentials: LoginCredentials): Promise<LogoutResult>;
}
