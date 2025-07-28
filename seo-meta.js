// seo-meta.js

/**
 * Sets the SEO metadata (title, description, keywords) for a page.
 * Call this function from each HTML page's specific <script> block.
 *
 * @param {string} pageIdentifier A unique string identifier for the page (e.g., 'home', 'tool-detail', 'blog-post').
 * @param {string} title The title of the page.
 * @param {string} description The meta description for the page.
 * @param {string} keywords A comma-separated string of keywords for the page.
 */
function setSeoMetaData(pageIdentifier, title, description, keywords) {
    document.title = title;

    // Set or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Set or update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // Optional: Add canonical link for SEO
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', window.location.href);

    // You could also add Open Graph (for social media sharing) or Twitter Card meta tags here
    // Example for Open Graph:
    // let ogTitle = document.querySelector('meta[property="og:title"]');
    // if (!ogTitle) {
    //     ogTitle = document.createElement('meta');
    //     ogTitle.setAttribute('property', 'og:title');
    //     document.head.appendChild(ogTitle);
    // }
    // ogTitle.setAttribute('content', title);
    // (Similar for og:description, og:image, og:url, etc.)

    console.log(`SEO Meta data set for page: ${pageIdentifier}`);
}
