# Algolia DocSearch Integration Guide

This document provides step-by-step instructions for integrating Algolia DocSearch into the AI Panel for full-text search capabilities.

## 📋 Prerequisites

- ✅ Dependencies installed: `@docsearch/react` and `algoliasearch`
- ✅ Website must be deployed to a public URL (not localhost)
- ✅ Website should be a technical documentation site
- ✅ You must be the maintainer of the website

## 🚀 Step 1: Apply for Algolia DocSearch

### Application Form
Visit: https://docsearch.algolia.com/apply/

### Required Information
- **Website URL**: Your production website URL (e.g., https://your-site.com)
- **Email**: Your contact email
- **Repository**: GitHub repository URL (optional but recommended)
- **Description**: Brief description of your site (e.g., "BeatAI technical documentation website with Rust tutorials")

### Confirmation Checklist
- ✅ You are the maintainer of this website
- ✅ The website is publicly available
- ✅ The website is technical documentation
- ✅ You can modify the website's code

### Approval Timeline
- Typical approval time: 1-3 business days
- You'll receive credentials via email

## 📧 Step 2: Receive Algolia Credentials

After approval, you'll receive an email with:

```json
{
  "appId": "XXXXXXXXXX",
  "apiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "indexName": "your_site_name"
}
```

## ⚙️ Step 3: Configure the Application

### Update AIAssistant.js Configuration

Open: `/src/components/docs/AIAssistant.js`

Find the `ALGOLIA_CONFIG` object (around line 19) and update it:

```javascript
const ALGOLIA_CONFIG = {
  appId: 'YOUR_ACTUAL_APP_ID',        // Replace with your appId
  apiKey: 'YOUR_ACTUAL_SEARCH_API_KEY', // Replace with your apiKey
  indexName: 'YOUR_ACTUAL_INDEX_NAME',  // Replace with your indexName
  enabled: true  // ⚠️ IMPORTANT: Set to true to enable Algolia search
};
```

### Example Configuration

```javascript
const ALGOLIA_CONFIG = {
  appId: 'BH4D9OD16A',
  apiKey: '60e3c9e13b6b3e3e8e8e8e8e8e8e8e8e',
  indexName: 'beatai_docs',
  enabled: true
};
```

**⚠️ Important Notes:**
- Use the **Search-Only API Key**, NOT the Admin API Key
- The Search-Only API Key is safe to expose in client-side code
- Never commit the Admin API Key to your repository

## 🕷️ Step 4: Configure Algolia Crawler (Optional)

The default crawler configuration works for most sites. However, you can customize it for better results.

### Option A: Use Default Configuration
Algolia will automatically configure the crawler based on your site structure. No action needed.

### Option B: Customize Crawler Configuration

1. **Review the template**: `docsearch.config.json` in the project root
2. **Update selectors** to match your HTML structure:
   ```json
   "selectors": {
     "lvl0": ".docs-layout h1",  // Main page title
     "lvl1": ".docs-content h2",  // Section headings
     "lvl2": ".docs-content h3",  // Subsection headings
     "text": ".docs-content p, .docs-content li"  // Body text
   }
   ```
3. **Exclude irrelevant content**:
   ```json
   "selectors_exclude": [
     ".sidebar",
     ".header",
     ".footer",
     ".ai-panel"
   ]
   ```
4. **Submit to Algolia support** or update via Algolia Dashboard

### Verify Crawler Selectors

Use browser DevTools to verify your selectors:
```javascript
// Test in browser console
document.querySelector('.docs-content h2')  // Should find section headings
document.querySelectorAll('.docs-content p')  // Should find paragraph text
```

## 🧪 Step 5: Test the Integration

### Local Testing (Before First Crawl)

1. Start the development server:
   ```bash
   npm start
   ```

2. Open the AI Panel (click the floating orb)

3. **Expected behavior before first crawl:**
   - Search will work using fallback (Fuse.js metadata search)
   - Results will show "(Metadata only)" label
   - You'll see a message: "Currently searching titles and descriptions only"

4. **Check browser console:**
   - Look for: "Algolia search failed, falling back to metadata search"
   - This is expected before the first crawl

### After First Crawl (1-2 Days)

1. **Test full-text search:**
   - Search for content that's in the document body (not just titles)
   - Example: Search for "变量绑定" or "let mut"
   - You should get results from document content

2. **Verify search features:**
   - ✅ Results show "(Full-text)" label
   - ✅ Snippets appear with highlighted keywords
   - ✅ Context around matched text is displayed
   - ✅ Highlighted text has yellow background

3. **Test spelling corrections:**
   - Try misspelled queries (e.g., "varible" → should suggest "variable")

### Performance Testing

Open browser DevTools → Network tab:
- Algolia API calls should appear as: `https://{appId}-dsn.algolia.net/1/indexes/{indexName}/query`
- Response time should be < 100ms
- Payload size: ~10-50KB per request

## 🎨 Step 6: Customize Appearance (Optional)

### Adjust Highlight Colors

Edit `/src/components/docs/AIAssistant.css`:

```css
/* Change highlight color */
.ai-result-title mark,
.ai-result-snippet mark {
  background: linear-gradient(120deg, #your-color-1 0%, #your-color-2 100%);
  color: #your-text-color;
}
```

### Modify Snippet Length

Edit `/src/components/docs/AIAssistant.js`:

```javascript
const { hits } = await index.search(searchQuery, {
  hitsPerPage: 5,
  attributesToSnippet: ['content:100'],  // Change 50 to 100 for longer snippets
  // ...
});
```

## 🔍 Step 7: Monitor Search Performance

### Algolia Dashboard

1. Login: https://www.algolia.com/dashboard
2. Navigate to: Your Index → Analytics
3. Monitor:
   - Total searches
   - Average search time
   - Top search queries
   - No results queries (for content improvement)

### Key Metrics to Track
- **Average response time**: Should be < 50ms
- **Search success rate**: % of searches with results
- **Popular queries**: Most searched terms
- **Failed searches**: Queries with no results

## 🐛 Troubleshooting

### Issue: "Algolia search failed" error

**Possible causes:**
1. ❌ `enabled: false` in configuration → Set to `true`
2. ❌ Invalid credentials → Double-check appId, apiKey, indexName
3. ❌ Index not yet created → Wait for first crawl (1-2 days after approval)
4. ❌ Network error → Check internet connection

**Debug steps:**
```javascript
// Add console.log to verify config
console.log('Algolia enabled:', ALGOLIA_CONFIG.enabled);
console.log('Algolia appId:', ALGOLIA_CONFIG.appId);
```

### Issue: No results for content-based searches

**Possible causes:**
1. ❌ Crawler hasn't run yet → Wait for first crawl
2. ❌ Wrong selectors in crawler config → Review `docsearch.config.json`
3. ❌ Content excluded by `selectors_exclude` → Check exclusion rules

**Verify index content:**
1. Open Algolia Dashboard
2. Go to: Your Index → Browse
3. Check if documents are indexed
4. Verify `content` field contains text

### Issue: Fallback search always used

**Check:**
```javascript
// In AIAssistant.js
console.log('Search mode:', searchMode);  // Should be 'algolia' when working
```

**Common fixes:**
- Ensure `enabled: true` in `ALGOLIA_CONFIG`
- Verify `searchClient` is initialized (check for `null`)
- Check browser console for error messages

### Issue: Highlighted text not visible

**Check CSS:**
```css
/* Verify mark styles are applied */
.ai-result-snippet mark {
  background: yellow;  /* Fallback color for testing */
}
```

## 📊 Search Quality Optimization

### Improve Search Relevance

1. **Adjust ranking formula** (Algolia Dashboard → Configuration → Ranking):
   - Default order: Typo, Geo, Words, Filters, Proximity, Attribute, Exact, Custom
   - For docs: Consider prioritizing "Exact" higher

2. **Configure synonyms**:
   - Example: "rust" ↔ "Rust 语言"
   - Add via: Dashboard → Synonyms

3. **Set up custom ranking**:
   - Prioritize by: freshness, popularity, hierarchy level

### Monitor "No Results" Queries

1. Dashboard → Analytics → No Results
2. Identify common failed searches
3. Add content or synonyms to improve coverage

## 🔄 Update Frequency

### Crawler Schedule
- **Default**: Weekly (every Monday)
- **Request increase**: Contact Algolia support for daily crawls

### Manual Re-crawl
1. Go to: Algolia Dashboard → Crawler
2. Click: "Re-crawl now"
3. Wait: 1-4 hours for completion

### Triggering Re-crawl After Content Updates
- Algolia crawls automatically on schedule
- For immediate updates: Use manual re-crawl
- For real-time updates: Consider Algolia's paid API-based indexing

## 🔒 Security Best Practices

### API Key Management
- ✅ **DO**: Use Search-Only API Key in client code
- ✅ **DO**: Store Admin API Key securely (never in repo)
- ✅ **DO**: Rotate keys periodically
- ❌ **DON'T**: Commit credentials to Git
- ❌ **DON'T**: Share Admin API Key

### Environment Variables (Recommended)

Create `.env` file:
```bash
REACT_APP_ALGOLIA_APP_ID=your_app_id
REACT_APP_ALGOLIA_API_KEY=your_search_api_key
REACT_APP_ALGOLIA_INDEX_NAME=your_index_name
```

Update `AIAssistant.js`:
```javascript
const ALGOLIA_CONFIG = {
  appId: process.env.REACT_APP_ALGOLIA_APP_ID,
  apiKey: process.env.REACT_APP_ALGOLIA_API_KEY,
  indexName: process.env.REACT_APP_ALGOLIA_INDEX_NAME,
  enabled: true
};
```

Add to `.gitignore`:
```
.env
.env.local
```

## 📝 Next Steps

1. **Apply for Algolia DocSearch** ✅
2. **Deploy site to production** (required for crawler)
3. **Wait for approval** (1-3 days)
4. **Configure credentials** in AIAssistant.js
5. **Wait for first crawl** (1-2 days after approval)
6. **Test search functionality**
7. **Monitor and optimize** via Dashboard

## 🆘 Support

### Algolia Support
- Documentation: https://docsearch.algolia.com/docs/what-is-docsearch
- Community: https://discourse.algolia.com/
- Email: support@algolia.com

### Project Issues
- Report issues: GitHub Issues
- Provide: Browser console errors, network logs, configuration

## 📚 Additional Resources

- **Algolia Search API**: https://www.algolia.com/doc/api-reference/search-api/
- **React Integration**: https://www.algolia.com/doc/guides/building-search-ui/getting-started/react/
- **DocSearch FAQ**: https://docsearch.algolia.com/docs/faq
- **Crawler Configuration**: https://docsearch.algolia.com/docs/record-extractor

---

## ✅ Quick Checklist

Before going live:
- [ ] Algolia account created and approved
- [ ] Credentials updated in `AIAssistant.js`
- [ ] `enabled: true` in `ALGOLIA_CONFIG`
- [ ] Site deployed to public URL
- [ ] First crawl completed
- [ ] Search tested with content-based queries
- [ ] Fallback works when Algolia unavailable
- [ ] Highlight colors match theme
- [ ] Dark mode tested
- [ ] Mobile responsive checked

## 🎉 Success Indicators

Your integration is successful when:
- ✅ Search returns results for document body content (not just titles)
- ✅ Snippets show with highlighted keywords
- ✅ Response time < 100ms
- ✅ Results show "(Full-text)" label
- ✅ Fallback works when network fails
- ✅ Analytics visible in Algolia Dashboard
