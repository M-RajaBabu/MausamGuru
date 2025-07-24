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
        # Click on the India Weather News tab by selecting a state button, e.g., Delhi (index 71) to check news and AI summaries.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/section/div[2]/div[3]/aside/div/button[32]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Change the selected state to another Indian state, e.g., Maharashtra (index 48), and verify news and AI summaries update accordingly.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/section/div[2]/div[3]/aside/div/button[14]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Change the selected state to another Indian state, e.g., Tamil Nadu (index 57), and verify news and AI summaries update accordingly.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/section/div[2]/div[3]/aside/div/button[23]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Change the selected state to Karnataka (index 45) and verify news and AI summaries update accordingly.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/section/div[2]/div[3]/aside/div/button[11]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Change the selected state to Kerala (index 46) and verify news and AI summaries update accordingly.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/section/div[2]/div[3]/aside/div/button[12]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Change the selected state to Andhra Pradesh (index 35) and verify news and AI summaries update accordingly.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/section/div[2]/div[3]/aside/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Change the selected state to Punjab (index 54) and verify news and AI summaries update accordingly.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/section/div[2]/div[3]/aside/div/button[20]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Change the selected state to Rajasthan (index 55) and verify news and AI summaries update accordingly.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/section/div[2]/div[3]/aside/div/button[21]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Change the selected state to West Bengal (index 62) and verify news and AI summaries update accordingly.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/section/div[2]/div[3]/aside/div/button[28]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Change the selected state to Uttar Pradesh (index 60) and verify news and AI summaries update accordingly.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/section/div[2]/div[3]/aside/div/button[26]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assertion for verifying news items correspond to the selected Indian state or region
        selected_state = 'Uttar Pradesh'
        state_weather_locator = frame.locator('xpath=//section[contains(@class, "selected-state-weather")]')
        state_name_text = await state_weather_locator.locator('xpath=.//h2').inner_text()
        assert selected_state in state_name_text, f"Expected state {selected_state} in news section, but got {state_name_text}"
        
        # Assertion for checking AI-generated summaries for news are coherent and relevant
        ai_summary_locator = frame.locator('xpath=//section[contains(@class, "ai-summary")]')
        ai_summary_text = await ai_summary_locator.inner_text()
        assert len(ai_summary_text) > 20, "AI summary text is too short or missing"
        assert 'weather' in ai_summary_text.lower() or 'forecast' in ai_summary_text.lower(), "AI summary does not seem relevant to weather news"
        
        # After changing the state, verify news and summaries update accordingly
        # We will check for multiple states as per the test plan
        states_to_check = ['Delhi', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Punjab', 'Rajasthan', 'West Bengal', 'Uttar Pradesh']
        for state in states_to_check:
            # Click the button for the state
            button_xpath = f"xpath=//aside//button[contains(text(), '{state}')]"
            button = frame.locator(button_xpath).nth(0)
            await button.click()
            await page.wait_for_timeout(3000)
            # Verify the selected state in the news section updates
            state_name_text = await state_weather_locator.locator('xpath=.//h2').inner_text()
            assert state in state_name_text, f"After selecting {state}, expected news for {state} but got {state_name_text}"
            # Verify AI summary updates and is relevant
            ai_summary_text = await ai_summary_locator.inner_text()
            assert len(ai_summary_text) > 20, f"AI summary for {state} is too short or missing"
            assert 'weather' in ai_summary_text.lower() or 'forecast' in ai_summary_text.lower(), f"AI summary for {state} does not seem relevant to weather news"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    