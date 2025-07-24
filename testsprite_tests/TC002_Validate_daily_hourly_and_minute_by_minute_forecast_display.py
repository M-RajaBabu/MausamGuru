import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Input 'Mumbai' in the location search input and select it.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Mumbai')
        

        # Click on the 'Forecast' tab to view weather forecasts.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/nav/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on the 'Daily' forecast tab to ensure daily forecast data is displayed and verify it.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div[2]/button[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on the 'Hourly' forecast tab to display hourly forecast data and verify it.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div[2]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on the 'MinuteCast' tab to display minute-by-minute forecast data and verify it.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div[2]/button[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert that the location displayed is 'Mumbai' as selected (though page content shows 'New Delhi, IN', so we check for presence of location element and log warning if mismatch)
        location_element = frame.locator('xpath=//div[contains(text(),"Mumbai")]')
        assert await location_element.count() > 0, "Selected location 'Mumbai' is not displayed on the page."
        # Assert that the daily forecast tab is visible and contains forecast data
        daily_forecast_tab = frame.locator('xpath=//button[contains(text(),"Daily")]')
        assert await daily_forecast_tab.is_visible(), "Daily forecast tab is not visible."
        daily_forecast_data = frame.locator('xpath=//div[contains(@class, "daily-forecast-data")]')
        assert await daily_forecast_data.count() > 0, "Daily forecast data is not displayed."
        # Assert that the hourly forecast tab is visible and contains forecast data
        hourly_forecast_tab = frame.locator('xpath=//button[contains(text(),"Hourly")]')
        assert await hourly_forecast_tab.is_visible(), "Hourly forecast tab is not visible."
        hourly_forecast_data = frame.locator('xpath=//div[contains(@class, "hourly-forecast-data")]')
        assert await hourly_forecast_data.count() > 0, "Hourly forecast data is not displayed."
        # Assert that the minute-by-minute forecast tab is visible and contains forecast data or shows appropriate message
        minutecast_tab = frame.locator('xpath=//button[contains(text(),"MinuteCast")]')
        assert await minutecast_tab.is_visible(), "MinuteCast tab is not visible."
        minutecast_data = frame.locator('xpath=//div[contains(@class, "minutecast-data")]')
        minutecast_message = frame.locator('xpath=//*[contains(text(), "Minutely precipitation data not available")]')
        assert (await minutecast_data.count() > 0) or (await minutecast_message.count() > 0), "Minute-by-minute precipitation data is neither displayed nor is there a message indicating unavailability."
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    