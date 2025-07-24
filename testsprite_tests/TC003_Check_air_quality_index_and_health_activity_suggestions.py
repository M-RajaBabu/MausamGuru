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
        # Click on Air Quality tab to view detailed AQI information.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/nav/div/div/button[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Navigate to 'Health & Activities' tab to verify health and outdoor activity suggestions correspond to AQI level 2 (Good).
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/nav/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert that the displayed AQI matches the expected AQI from the API data
        expected_aqi = 2
        aqi_locator = frame.locator('xpath=//div[contains(text(),"AQI") or contains(text(),"Air Quality Index")]')
        displayed_aqi_text = await aqi_locator.inner_text()
        assert str(expected_aqi) in displayed_aqi_text, f"Expected AQI {expected_aqi} not found in displayed text: {displayed_aqi_text}"
          
        # Assert that the health and outdoor activity suggestions correspond to AQI level 2 (Fair)
        health_suggestion_locator = frame.locator('xpath=//div[contains(text(),"Air quality is acceptable.")]')
        assert await health_suggestion_locator.count() > 0, "Health suggestion for AQI level 2 (Fair) not found."
          
        activity_suggestion_text = await frame.locator('xpath=//div[contains(text(),"Great day for outdoor activities!")]').inner_text()
        assert "Great day for outdoor activities!" in activity_suggestion_text, "Expected activity suggestion not found for AQI level 2."
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    