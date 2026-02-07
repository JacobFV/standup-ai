import { chromium } from "playwright-core";
import type { BrowserbaseClient } from "./client.js";

export async function createBrowserSession(client: BrowserbaseClient) {
  const session = await client.createSession();

  const browser = await chromium.connectOverCDP(session.connectUrl!);
  const context = browser.contexts()[0]!;
  const page = context.pages()[0]!;

  return { session, browser, context, page };
}

export async function loginToNotion(
  client: BrowserbaseClient,
  credentials: { email: string; password: string }
) {
  const { session, browser, page } = await createBrowserSession(client);

  try {
    await page.goto("https://www.notion.so/login");
    await page.waitForLoadState("networkidle");

    await page.fill('input[type="email"]', credentials.email);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.fill('input[type="password"]', credentials.password);
    await page.click('button[type="submit"]');
    await page.waitForLoadState("networkidle");

    const cookies = await page.context().cookies();

    return {
      success: true,
      sessionId: session.id,
      cookies,
    };
  } catch (error) {
    return {
      success: false,
      sessionId: session.id,
      error: String(error),
    };
  } finally {
    await browser.close();
  }
}

export async function loginToLinear(
  client: BrowserbaseClient,
  credentials: { email: string; password: string }
) {
  const { session, browser, page } = await createBrowserSession(client);

  try {
    await page.goto("https://linear.app/login");
    await page.waitForLoadState("networkidle");

    await page.fill('input[name="email"]', credentials.email);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.fill('input[type="password"]', credentials.password);
    await page.click('button[type="submit"]');
    await page.waitForLoadState("networkidle");

    const cookies = await page.context().cookies();

    return {
      success: true,
      sessionId: session.id,
      cookies,
    };
  } catch (error) {
    return {
      success: false,
      sessionId: session.id,
      error: String(error),
    };
  } finally {
    await browser.close();
  }
}
