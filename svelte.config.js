import adapter from '@sveltejs/adapter-static';

const repository = process.env.GITHUB_REPOSITORY || '';
const repositoryName = repository.includes('/') ? repository.split('/')[1] : '';
const isGitHubPages = process.env.GITHUB_PAGES === 'true' && repositoryName;
const configuredSiteUrl = process.env.PUBLIC_SITE_URL || '';
const usesCustomDomain = /https?:\/\/(www\.)?diabloautodetailing\.com\/?$/i.test(configuredSiteUrl);
const basePath = isGitHubPages && !usesCustomDomain ? `/${repositoryName}` : '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    paths: {
      base: basePath
    }
  }
};

export default config;
